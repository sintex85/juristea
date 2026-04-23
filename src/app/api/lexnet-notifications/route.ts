import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { lexnetNotifications, cases } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { z } from "zod"

const createSchema = z.object({
  subject: z.string().min(1),
  sender: z.string().optional(),
  type: z.enum(["sentencia", "providencia", "auto", "diligencia", "emplazamiento", "requerimiento", "other"]).optional(),
  receivedAt: z.string().min(1),
  caseId: z.string().optional(),
  lexnetId: z.string().optional(),
  metadata: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const rows = await db
    .select({
      id: lexnetNotifications.id,
      subject: lexnetNotifications.subject,
      sender: lexnetNotifications.sender,
      type: lexnetNotifications.type,
      receivedAt: lexnetNotifications.receivedAt,
      read: lexnetNotifications.read,
      caseTitle: cases.title,
    })
    .from(lexnetNotifications)
    .leftJoin(cases, eq(lexnetNotifications.caseId, cases.id))
    .where(eq(lexnetNotifications.userId, session.user.id))
    .orderBy(desc(lexnetNotifications.receivedAt))

  return Response.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const [created] = await db
    .insert(lexnetNotifications)
    .values({
      ...parsed.data,
      receivedAt: new Date(parsed.data.receivedAt),
      caseId: parsed.data.caseId || null,
      userId: session.user.id,
    })
    .returning()

  return Response.json(created, { status: 201 })
}
