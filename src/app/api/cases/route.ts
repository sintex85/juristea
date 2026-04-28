import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { cases, clients } from "@/lib/db/schema"
import { eq, desc, sql } from "drizzle-orm"
import { z } from "zod"
import { PLANS } from "@/lib/stripe/plans"

const createSchema = z.object({
  title: z.string().trim().min(1, "Pon un título al expediente.").max(300),
  clientId: z.string().min(1, "Elige el cliente del expediente."),
  caseNumber: z.string().nullish(),
  nig: z.string().nullish(),
  court: z.string().nullish(),
  jurisdiction: z.string().nullish(),
  description: z.string().nullish(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const rows = await db
    .select({
      id: cases.id,
      title: cases.title,
      caseNumber: cases.caseNumber,
      court: cases.court,
      jurisdiction: cases.jurisdiction,
      status: cases.status,
      clientName: clients.name,
      createdAt: cases.createdAt,
    })
    .from(cases)
    .leftJoin(clients, eq(cases.clientId, clients.id))
    .where(eq(cases.userId, session.user.id))
    .orderBy(desc(cases.updatedAt))

  return Response.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const [count] = await db
    .select({ count: sql<number>`count(*)` })
    .from(cases)
    .where(eq(cases.userId, session.user.id))

  const user = await db.query.users.findFirst({ where: eq((await import("@/lib/db/schema")).users.id, session.user.id) })
  const plan = PLANS[user?.plan ?? "free"]
  if (Number(count.count) >= plan.maxCases) {
    return Response.json({ error: "Límite de expedientes alcanzado. Actualiza al plan Despacho." }, { status: 403 })
  }

  const [created] = await db
    .insert(cases)
    .values({ ...parsed.data, userId: session.user.id })
    .returning()

  return Response.json(created, { status: 201 })
}
