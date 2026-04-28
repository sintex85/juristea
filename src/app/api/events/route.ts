import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { events, cases } from "@/lib/db/schema"
import { eq, and, gte, lte, asc } from "drizzle-orm"
import { z } from "zod"
import { syncEventToGoogle } from "@/lib/google-calendar"

const createSchema = z.object({
  title: z.string().min(1).max(300),
  type: z.enum(["vista", "juicio", "reunion", "llamada", "plazo", "declaracion", "mediacion", "otro"]).optional(),
  caseId: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  startAt: z.string().min(1),
  endAt: z.string().optional(),
  allDay: z.boolean().optional(),
  color: z.string().optional(),
  remindMinutesBefore: z.number().int().optional(),
  whatsappReminder: z.boolean().optional(),
})

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const url = new URL(req.url)
  const from = url.searchParams.get("from")
  const to = url.searchParams.get("to")

  const conditions = [eq(events.userId, session.user.id)]
  if (from) conditions.push(gte(events.startAt, new Date(from)))
  if (to) conditions.push(lte(events.startAt, new Date(to)))

  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      type: events.type,
      description: events.description,
      location: events.location,
      startAt: events.startAt,
      endAt: events.endAt,
      allDay: events.allDay,
      color: events.color,
      completed: events.completed,
      whatsappReminder: events.whatsappReminder,
      caseId: events.caseId,
      caseTitle: cases.title,
    })
    .from(events)
    .leftJoin(cases, eq(events.caseId, cases.id))
    .where(and(...conditions))
    .orderBy(asc(events.startAt))

  return Response.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const [created] = await db
    .insert(events)
    .values({
      ...parsed.data,
      startAt: new Date(parsed.data.startAt),
      endAt: parsed.data.endAt ? new Date(parsed.data.endAt) : null,
      caseId: parsed.data.caseId || null,
      userId: session.user.id,
    })
    .returning()

  // Best-effort push to Google Calendar — never blocks the response.
  syncEventToGoogle(session.user.id, {
    id: created.id,
    title: created.title,
    description: created.description,
    location: created.location,
    startAt: created.startAt,
    endAt: created.endAt,
    allDay: created.allDay,
    gcalEventId: created.gcalEventId,
  }).catch((err) => console.error("[events:create] gcal sync failed", err))

  return Response.json(created, { status: 201 })
}
