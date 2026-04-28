/**
 * Google Calendar integration.
 *
 * Reads OAuth tokens stored by NextAuth (DrizzleAdapter) in the `accounts`
 * table and pushes events to the user's primary Google Calendar.
 *
 * Calendar API: https://developers.google.com/calendar/api/v3/reference/events
 */

import { and, eq } from "drizzle-orm"
import { db } from "./db"
import { accounts, events as eventsTable } from "./db/schema"

const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"
const GCAL_BASE = "https://www.googleapis.com/calendar/v3"

type EventPayload = {
  id: string
  title: string
  description?: string | null
  location?: string | null
  startAt: Date
  endAt?: Date | null
  allDay?: boolean
  gcalEventId?: string | null
}

type TokenSet = {
  access_token: string
  refresh_token: string | null
  expires_at: number | null
}

/** Read the user's Google account row + ensure access_token is fresh. */
async function getValidGoogleToken(userId: string): Promise<TokenSet | null> {
  const row = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, userId), eq(accounts.provider, "google")),
  })
  if (!row?.access_token) return null

  const now = Math.floor(Date.now() / 1000)
  const expiresAt = row.expires_at ?? 0

  // Token is still valid for at least 60 seconds: use as-is.
  if (expiresAt - now > 60) {
    return {
      access_token: row.access_token,
      refresh_token: row.refresh_token,
      expires_at: expiresAt,
    }
  }

  // Try refresh.
  if (!row.refresh_token) return null

  const clientId = process.env.AUTH_GOOGLE_ID
  const clientSecret = process.env.AUTH_GOOGLE_SECRET
  if (!clientId || !clientSecret) return null

  const res = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: row.refresh_token,
      grant_type: "refresh_token",
    }),
  })
  if (!res.ok) {
    console.error("[gcal] refresh failed", await res.text())
    return null
  }
  const data = (await res.json()) as {
    access_token: string
    expires_in: number
    refresh_token?: string
    scope?: string
  }
  const newExpiresAt = now + data.expires_in
  await db
    .update(accounts)
    .set({
      access_token: data.access_token,
      expires_at: newExpiresAt,
      refresh_token: data.refresh_token ?? row.refresh_token,
      scope: data.scope ?? row.scope,
    })
    .where(and(eq(accounts.userId, userId), eq(accounts.provider, "google")))

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? row.refresh_token,
    expires_at: newExpiresAt,
  }
}

export async function isGoogleCalendarConnected(userId: string): Promise<boolean> {
  const row = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, userId), eq(accounts.provider, "google")),
  })
  if (!row?.access_token) return false
  return Boolean(row.scope?.includes("calendar"))
}

function toGcalEvent(e: EventPayload) {
  if (e.allDay) {
    const date = e.startAt.toISOString().slice(0, 10)
    const endDate = (e.endAt ?? e.startAt).toISOString().slice(0, 10)
    return {
      summary: e.title,
      description: e.description ?? undefined,
      location: e.location ?? undefined,
      start: { date },
      end: { date: endDate },
    }
  }
  return {
    summary: e.title,
    description: e.description ?? undefined,
    location: e.location ?? undefined,
    start: { dateTime: e.startAt.toISOString() },
    end: { dateTime: (e.endAt ?? new Date(e.startAt.getTime() + 60 * 60 * 1000)).toISOString() },
  }
}

/** Create or update the corresponding Google Calendar event. Idempotent. */
export async function syncEventToGoogle(userId: string, event: EventPayload) {
  const token = await getValidGoogleToken(userId)
  if (!token) return { skipped: true as const }

  const body = JSON.stringify(toGcalEvent(event))
  const headers = {
    Authorization: `Bearer ${token.access_token}`,
    "Content-Type": "application/json",
  }

  if (event.gcalEventId) {
    const res = await fetch(`${GCAL_BASE}/calendars/primary/events/${event.gcalEventId}`, {
      method: "PATCH",
      headers,
      body,
    })
    if (res.status === 404) {
      // Saved id is stale — fall through to create.
    } else if (!res.ok) {
      console.error("[gcal] update failed", await res.text())
      return { error: "update_failed" as const }
    } else {
      return { gcalEventId: event.gcalEventId, updated: true as const }
    }
  }

  const res = await fetch(`${GCAL_BASE}/calendars/primary/events`, {
    method: "POST",
    headers,
    body,
  })
  if (!res.ok) {
    console.error("[gcal] create failed", await res.text())
    return { error: "create_failed" as const }
  }
  const data = (await res.json()) as { id?: string }
  if (data.id) {
    await db
      .update(eventsTable)
      .set({ gcalEventId: data.id })
      .where(eq(eventsTable.id, event.id))
    return { gcalEventId: data.id, created: true as const }
  }
  return { error: "no_id" as const }
}

export async function deleteEventFromGoogle(
  userId: string,
  gcalEventId: string | null | undefined
) {
  if (!gcalEventId) return { skipped: true as const }
  const token = await getValidGoogleToken(userId)
  if (!token) return { skipped: true as const }
  const res = await fetch(`${GCAL_BASE}/calendars/primary/events/${gcalEventId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token.access_token}` },
  })
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    console.error("[gcal] delete failed", await res.text())
    return { error: "delete_failed" as const }
  }
  return { deleted: true as const }
}
