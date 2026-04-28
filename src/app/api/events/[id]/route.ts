import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import {
  syncEventToGoogle,
  deleteEventFromGoogle,
} from "@/lib/google-calendar"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  if (body.startAt) body.startAt = new Date(body.startAt)
  if (body.endAt) body.endAt = new Date(body.endAt)

  const [updated] = await db
    .update(events)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(events.id, id), eq(events.userId, session.user.id)))
    .returning()

  if (!updated) return Response.json({ error: "No encontrado" }, { status: 404 })

  syncEventToGoogle(session.user.id, {
    id: updated.id,
    title: updated.title,
    description: updated.description,
    location: updated.location,
    startAt: updated.startAt,
    endAt: updated.endAt,
    allDay: updated.allDay,
    gcalEventId: updated.gcalEventId,
  }).catch((err) => console.error("[events:update] gcal sync failed", err))

  return Response.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params

  const [deleted] = await db
    .delete(events)
    .where(and(eq(events.id, id), eq(events.userId, session.user.id)))
    .returning()

  if (!deleted) return Response.json({ error: "No encontrado" }, { status: 404 })

  deleteEventFromGoogle(session.user.id, deleted.gcalEventId).catch((err) =>
    console.error("[events:delete] gcal delete failed", err)
  )

  return Response.json({ success: true })
}
