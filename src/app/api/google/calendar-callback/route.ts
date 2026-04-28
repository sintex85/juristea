import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { accounts } from "@/lib/db/schema"

const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"

type TokenResponse = {
  access_token: string
  refresh_token?: string
  expires_in: number
  scope: string
  token_type: string
  id_token?: string
}

function decodeIdTokenSub(idToken: string): string | null {
  try {
    const payloadB64 = idToken.split(".")[1]
    const payload = JSON.parse(
      Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
    ) as { sub?: string }
    return payload.sub ?? null
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const errorParam = url.searchParams.get("error")

  if (errorParam) {
    redirect(`/dashboard/settings?gcal=denied&reason=${encodeURIComponent(errorParam)}`)
  }
  if (!code || state !== session.user.id) {
    redirect("/dashboard/settings?gcal=invalid_state")
  }

  const clientId = process.env.AUTH_GOOGLE_ID
  const clientSecret = process.env.AUTH_GOOGLE_SECRET
  const baseUrl = process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL
  if (!clientId || !clientSecret || !baseUrl) {
    redirect("/dashboard/settings?gcal=misconfigured")
  }

  // Exchange code → tokens
  const tokenRes = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: code!,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: `${baseUrl}/api/google/calendar-callback`,
      grant_type: "authorization_code",
    }),
  })

  if (!tokenRes.ok) {
    const text = await tokenRes.text()
    console.error("[gcal-connect] token exchange failed", text)
    redirect("/dashboard/settings?gcal=token_exchange_failed")
  }

  const tokens = (await tokenRes.json()) as TokenResponse
  const now = Math.floor(Date.now() / 1000)
  const expiresAt = now + tokens.expires_in

  // Find existing google account row for this user
  const existing = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, session.user.id), eq(accounts.provider, "google")),
  })

  if (existing) {
    await db
      .update(accounts)
      .set({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? existing.refresh_token,
        expires_at: expiresAt,
        scope: tokens.scope,
        token_type: tokens.token_type,
        id_token: tokens.id_token ?? existing.id_token,
      })
      .where(and(eq(accounts.userId, session.user.id), eq(accounts.provider, "google")))
  } else {
    const providerAccountId = tokens.id_token ? decodeIdTokenSub(tokens.id_token) : null
    if (!providerAccountId) {
      redirect("/dashboard/settings?gcal=missing_account_id")
    }
    await db.insert(accounts).values({
      userId: session.user.id,
      type: "oauth",
      provider: "google",
      providerAccountId: providerAccountId!,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? null,
      expires_at: expiresAt,
      scope: tokens.scope,
      token_type: tokens.token_type,
      id_token: tokens.id_token ?? null,
    })
  }

  redirect("/dashboard/settings?gcal=connected")
}
