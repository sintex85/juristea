import { eq, and, gte, lte, asc } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { events, cases, deadlines, accounts } from "@/lib/db/schema"
import { Calendar } from "@/components/calendar/calendar"
import type { CalendarItem, CaseLite } from "@/components/calendar/types"

export default async function AgendaPage() {
  const session = await auth()
  if (!session?.user?.id) return null
  const userId = session.user.id

  // Three-month window centered on today
  const today = new Date()
  const from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const to = new Date(today.getFullYear(), today.getMonth() + 2, 0, 23, 59, 59)

  const [evRows, dlRows, caseRows, googleAcct] = await Promise.all([
    db
      .select({
        id: events.id,
        title: events.title,
        type: events.type,
        description: events.description,
        location: events.location,
        startAt: events.startAt,
        endAt: events.endAt,
        allDay: events.allDay,
        completed: events.completed,
        whatsappReminder: events.whatsappReminder,
        remindMinutesBefore: events.remindMinutesBefore,
        caseId: events.caseId,
        caseTitle: cases.title,
      })
      .from(events)
      .leftJoin(cases, eq(events.caseId, cases.id))
      .where(and(eq(events.userId, userId), gte(events.startAt, from), lte(events.startAt, to)))
      .orderBy(asc(events.startAt)),
    db
      .select({
        id: deadlines.id,
        title: deadlines.title,
        dueDate: deadlines.dueDate,
        status: deadlines.status,
        caseId: deadlines.caseId,
        caseTitle: cases.title,
      })
      .from(deadlines)
      .innerJoin(cases, eq(deadlines.caseId, cases.id))
      .where(and(eq(deadlines.userId, userId), gte(deadlines.dueDate, from), lte(deadlines.dueDate, to)))
      .orderBy(asc(deadlines.dueDate)),
    db
      .select({ id: cases.id, title: cases.title })
      .from(cases)
      .where(eq(cases.userId, userId))
      .orderBy(asc(cases.title)),
    db.query.accounts.findFirst({
      where: and(eq(accounts.userId, userId), eq(accounts.provider, "google")),
    }),
  ])

  const evItems: CalendarItem[] = evRows.map((e) => ({
    id: e.id,
    kind: "event" as const,
    title: e.title,
    type: e.type,
    startAt: e.startAt.toISOString(),
    endAt: e.endAt ? e.endAt.toISOString() : null,
    allDay: e.allDay,
    location: e.location,
    description: e.description,
    caseId: e.caseId,
    caseTitle: e.caseTitle,
    completed: e.completed,
    whatsappReminder: e.whatsappReminder,
    remindMinutesBefore: e.remindMinutesBefore,
  }))

  const dlItems: CalendarItem[] = dlRows.map((d) => ({
    id: `dl-${d.id}`,
    kind: "deadline" as const,
    title: d.title,
    type: "plazo" as const,
    startAt: d.dueDate.toISOString(),
    endAt: null,
    allDay: true,
    location: null,
    description: null,
    caseId: d.caseId,
    caseTitle: d.caseTitle,
    completed: d.status === "completed",
    whatsappReminder: false,
    remindMinutesBefore: null,
  }))

  const caseList: CaseLite[] = caseRows
  const gcalConnected = Boolean(
    googleAcct?.access_token && googleAcct?.scope?.includes("calendar")
  )

  return (
    <Calendar
      initialItems={[...evItems, ...dlItems]}
      cases={caseList}
      gcalConnected={gcalConnected}
    />
  )
}
