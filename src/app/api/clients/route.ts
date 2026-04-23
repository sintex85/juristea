import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { clients, cases } from "@/lib/db/schema"
import { eq, desc, sql } from "drizzle-orm"
import { z } from "zod"

const createSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  nif: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const rows = await db
    .select({
      id: clients.id,
      name: clients.name,
      email: clients.email,
      phone: clients.phone,
      nif: clients.nif,
      caseCount: sql<number>`(select count(*) from cases where cases.client_id = clients.id)`,
      createdAt: clients.createdAt,
    })
    .from(clients)
    .where(eq(clients.userId, session.user.id))
    .orderBy(desc(clients.createdAt))

  return Response.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const [created] = await db
    .insert(clients)
    .values({ ...parsed.data, email: parsed.data.email || null, userId: session.user.id })
    .returning()

  return Response.json(created, { status: 201 })
}
