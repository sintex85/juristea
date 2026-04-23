import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { events, cases, deadlines } from "@/lib/db/schema"
import { eq, and, gte, asc } from "drizzle-orm"
import { AgendaClient } from "./agenda-client"

export default async function AgendaPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Get events
  const allEvents = await db
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
      caseTitle: cases.title,
    })
    .from(events)
    .leftJoin(cases, eq(events.caseId, cases.id))
    .where(and(eq(events.userId, userId), gte(events.startAt, startOfToday)))
    .orderBy(asc(events.startAt))

  // Get upcoming deadlines to show in agenda
  const upcomingDeadlines = await db
    .select({
      id: deadlines.id,
      title: deadlines.title,
      dueDate: deadlines.dueDate,
      status: deadlines.status,
      caseTitle: cases.title,
    })
    .from(deadlines)
    .innerJoin(cases, eq(deadlines.caseId, cases.id))
    .where(
      and(
        eq(deadlines.userId, userId),
        eq(deadlines.status, "pending"),
        gte(deadlines.dueDate, startOfToday)
      )
    )
    .orderBy(asc(deadlines.dueDate))
    .limit(20)

  // Merge into a unified list
  type AgendaItem = {
    id: string
    title: string
    date: Date
    type: string
    subtitle: string | null
    location: string | null
    isDeadline: boolean
    completed: boolean
    color: string | null
  }

  const items: AgendaItem[] = [
    ...allEvents.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.startAt,
      type: e.type,
      subtitle: e.caseTitle,
      location: e.location,
      isDeadline: false,
      completed: e.completed,
      color: e.color,
    })),
    ...upcomingDeadlines.map((d) => ({
      id: `dl-${d.id}`,
      title: d.title,
      date: d.dueDate,
      type: "plazo" as const,
      subtitle: d.caseTitle,
      location: null,
      isDeadline: true,
      completed: d.status === "completed",
      color: null,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Group by date
  const grouped: Record<string, AgendaItem[]> = {}
  for (const item of items) {
    const key = new Date(item.date).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(item)
  }

  const eventTypeLabels: Record<string, string> = {
    vista: "Vista oral",
    juicio: "Juicio",
    reunion: "Reunión",
    llamada: "Llamada",
    plazo: "Plazo",
    declaracion: "Declaración",
    mediacion: "Mediación",
    otro: "Otro",
  }

  const eventTypeColors: Record<string, string> = {
    vista: "bg-red-50 text-red-600 ring-red-200",
    juicio: "bg-red-50 text-red-600 ring-red-200",
    reunion: "bg-blue-50 text-blue-600 ring-blue-200",
    llamada: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    plazo: "bg-amber-50 text-amber-600 ring-amber-200",
    declaracion: "bg-purple-50 text-purple-600 ring-purple-200",
    mediacion: "bg-teal-50 text-teal-600 ring-teal-200",
    otro: "bg-gray-50 text-gray-600 ring-gray-200",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {items.length} evento{items.length !== 1 ? "s" : ""} próximo
            {items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <AgendaClient />
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-muted-foreground">
          <p className="text-sm font-medium">Tu agenda está vacía</p>
          <p className="text-sm mt-1">
            Añade eventos como vistas, reuniones o llamadas.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([dateLabel, dayItems]) => (
            <div key={dateLabel}>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 capitalize">
                {dateLabel}
              </p>
              <div className="rounded-xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50 overflow-hidden">
                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 px-5 py-4 ${item.completed ? "opacity-50" : ""}`}
                  >
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ring-1 shrink-0 ${eventTypeColors[item.type] || eventTypeColors.otro}`}
                    >
                      {eventTypeLabels[item.type] || item.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${item.completed ? "line-through" : "text-foreground/90"}`}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(item.date).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {item.subtitle && ` · ${item.subtitle}`}
                        {item.location && ` · 📍 ${item.location}`}
                      </p>
                    </div>
                    {item.isDeadline && (
                      <span className="text-xs text-amber-600 font-semibold shrink-0">
                        Plazo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
