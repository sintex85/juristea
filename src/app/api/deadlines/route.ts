import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { deadlines, cases } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { z } from "zod"

const createSchema = z.object({
  title: z.string().min(1).max(300),
  caseId: z.string().min(1),
  dueDate: z.string().min(1),
  description: z.string().optional(),
  alertDays: z.number().int().min(0).max(30).optional(),
  notificationId: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const rows = await db
    .select({
      id: deadlines.id,
      title: deadlines.title,
      dueDate: deadlines.dueDate,
      status: deadlines.status,
      alertDays: deadlines.alertDays,
      caseId: deadlines.caseId,
      caseTitle: cases.title,
      caseNumber: cases.caseNumber,
    })
    .from(deadlines)
    .innerJoin(cases, eq(deadlines.caseId, cases.id))
    .where(eq(deadlines.userId, session.user.id))
    .orderBy(asc(deadlines.dueDate))

  return Response.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const [created] = await db
    .insert(deadlines)
    .values({
      ...parsed.data,
      dueDate: new Date(parsed.data.dueDate),
      userId: session.user.id,
    })
    .returning()

  return Response.json(created, { status: 201 })
}
