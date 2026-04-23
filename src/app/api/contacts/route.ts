import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { contacts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { z } from "zod"

const createSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.enum(["cliente", "contrario", "procurador", "perito", "testigo", "notario", "mediador", "otro"]).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const rows = await db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, session.user.id))
    .orderBy(desc(contacts.updatedAt))

  return Response.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const [created] = await db
    .insert(contacts)
    .values({
      ...parsed.data,
      email: parsed.data.email || null,
      clientId: parsed.data.clientId || null,
      caseId: parsed.data.caseId || null,
      userId: session.user.id,
    })
    .returning()

  return Response.json(created, { status: 201 })
}
