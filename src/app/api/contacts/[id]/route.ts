import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { contacts } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  const [updated] = await db
    .update(contacts)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(contacts.id, id), eq(contacts.userId, session.user.id)))
    .returning()

  if (!updated) return Response.json({ error: "No encontrado" }, { status: 404 })
  return Response.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })
  const { id } = await params

  const [deleted] = await db
    .delete(contacts)
    .where(and(eq(contacts.id, id), eq(contacts.userId, session.user.id)))
    .returning()

  if (!deleted) return Response.json({ error: "No encontrado" }, { status: 404 })
  return Response.json({ success: true })
}
