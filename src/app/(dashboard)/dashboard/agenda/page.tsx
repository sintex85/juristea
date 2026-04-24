import { MapPin, Gavel, Phone, Users, FileText, CalendarClock } from "lucide-react"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { events, cases, deadlines } from "@/lib/db/schema"
import { eq, and, gte, asc } from "drizzle-orm"
import { AgendaClient } from "./agenda-client"

type BadgeTone = "ok" | "warn" | "gray" | "clay"

const typeMeta: Record<string, { label: string; tone: BadgeTone; Icon: typeof Gavel }> = {
  vista: { label: "Vista", tone: "clay", Icon: Gavel },
  juicio: { label: "Juicio", tone: "clay", Icon: Gavel },
  reunion: { label: "Reunión", tone: "gray", Icon: Users },
  llamada: { label: "Llamada", tone: "gray", Icon: Phone },
  plazo: { label: "Plazo", tone: "warn", Icon: CalendarClock },
  declaracion: { label: "Declaración", tone: "ok", Icon: Users },
  mediacion: { label: "Mediación", tone: "ok", Icon: Users },
  otro: { label: "Otro", tone: "gray", Icon: FileText },
}

export default async function AgendaPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

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
    .where(and(
      eq(deadlines.userId, userId),
      eq(deadlines.status, "pending"),
      gte(deadlines.dueDate, startOfToday)
    ))
    .orderBy(asc(deadlines.dueDate))
    .limit(20)

  type AgendaItem = {
    id: string
    title: string
    date: Date
    type: string
    subtitle: string | null
    location: string | null
    isDeadline: boolean
    completed: boolean
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
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const grouped: Record<string, AgendaItem[]> = {}
  for (const item of items) {
    const key = new Date(item.date).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    ;(grouped[key] ??= []).push(item)
  }

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="jur-mono-label">AGENDA</div>
          <h1 className="jur-display text-[48px] sm:text-[56px] text-[#0A0A0A] mt-3">
            Tus próximos <em>compromisos</em>.
          </h1>
          <p className="mt-3 text-[14.5px] text-[#6B6B6B]">
            {items.length} evento{items.length !== 1 ? "s" : ""} por venir ·{" "}
            {upcomingDeadlines.length} plazo{upcomingDeadlines.length !== 1 ? "s" : ""}
          </p>
        </div>
        <AgendaClient />
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="mt-8 jur-card p-14 text-center">
          <p className="jur-serif text-[22px] text-[#0A0A0A]">Tu agenda está vacía.</p>
          <p className="mt-2 text-[14px] text-[#6B6B6B]">
            Añade vistas, reuniones o llamadas para empezar a organizar la semana.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {Object.entries(grouped).map(([dateLabel, dayItems]) => (
            <div key={dateLabel}>
              <div className="jur-mono text-[11px] text-[#6B6B6B] uppercase tracking-wider mb-3 capitalize">
                {dateLabel}
              </div>
              <div className="jur-card overflow-hidden">
                <ul className="divide-y divide-[#EFEFEF]">
                  {dayItems.map((item) => {
                    const meta = typeMeta[item.type] ?? typeMeta.otro
                    const Icon = meta.Icon
                    return (
                      <li
                        key={item.id}
                        className={`flex items-center gap-4 px-6 py-4 jur-row-hover ${
                          item.completed ? "opacity-50" : ""
                        }`}
                      >
                        <div className="w-16 shrink-0">
                          <div className="jur-mono text-[14px] text-[#0A0A0A] font-medium leading-none">
                            {new Date(item.date).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Icon className="w-3.5 h-3.5 text-[#B54534]" />
                          <span className={`jur-badge jur-badge-${meta.tone}`}>{meta.label}</span>
                        </div>
                        <div className="flex-1 min-w-0 border-l border-[#E5E5E5] pl-4">
                          <div
                            className={`text-[14px] ${
                              item.completed ? "line-through text-[#A0A0A0]" : "text-[#0A0A0A]"
                            } font-medium truncate`}
                          >
                            {item.title}
                          </div>
                          <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-1 truncate flex items-center gap-2 flex-wrap">
                            {item.subtitle && <span>{item.subtitle}</span>}
                            {item.location && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {item.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
