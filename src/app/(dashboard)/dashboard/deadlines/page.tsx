import { ChevronRight } from "lucide-react"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { deadlines, cases } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"

const MONTHS_ES = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"]

type ChipTone = "clay" | "warn" | "gray"
type BadgeTone = "ok" | "warn" | "gray" | "clay"

function chipTone(days: number, status: string): ChipTone {
  if (status === "expired" || days < 0) return "clay"
  if (days <= 1) return "clay"
  if (days <= 5) return "warn"
  return "gray"
}

function statusBadge(status: string, days: number): { label: string; tone: BadgeTone } {
  if (status === "completed") return { label: "Completado", tone: "ok" }
  if (status === "expired" || days < 0) return { label: "Vencido", tone: "clay" }
  if (days === 0) return { label: "Hoy", tone: "clay" }
  if (days === 1) return { label: "Mañana", tone: "clay" }
  if (days <= 5) return { label: `${days} días`, tone: "warn" }
  return { label: `${days} días`, tone: "gray" }
}

export default async function DeadlinesPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const allDeadlines = await db
    .select({
      id: deadlines.id,
      title: deadlines.title,
      dueDate: deadlines.dueDate,
      status: deadlines.status,
      caseTitle: cases.title,
      caseNumber: cases.caseNumber,
    })
    .from(deadlines)
    .innerJoin(cases, eq(deadlines.caseId, cases.id))
    .where(eq(deadlines.userId, userId))
    .orderBy(asc(deadlines.dueDate))

  const now = new Date()
  function days(d: Date) {
    const a = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const b = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
  }

  const pending = allDeadlines.filter((d) => d.status === "pending")
  const critical = pending.filter((d) => days(new Date(d.dueDate)) <= 1).length
  const thisWeek = pending.filter((d) => {
    const n = days(new Date(d.dueDate))
    return n >= 0 && n <= 7
  }).length

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <div>
        <div className="jur-mono-label">PLAZOS PROCESALES</div>
        <h1 className="jur-display text-[48px] sm:text-[56px] text-[#0A0A0A] mt-3">
          Nunca más pierdas un <em>plazo</em>.
        </h1>
        <p className="mt-3 text-[14.5px] text-[#6B6B6B]">
          {pending.length} pendiente{pending.length !== 1 ? "s" : ""} ·{" "}
          <span className="text-[#B54534] font-medium">{critical} crítico{critical !== 1 ? "s" : ""}</span> ·{" "}
          <span>{thisWeek} esta semana</span>
        </p>
      </div>

      <div className="mt-8 jur-card p-7">
        {allDeadlines.length === 0 ? (
          <div className="p-10 text-center">
            <p className="jur-serif text-[22px] text-[#0A0A0A]">No hay plazos registrados.</p>
            <p className="mt-2 text-[14px] text-[#6B6B6B]">
              Los plazos aparecen automáticamente al dar de alta un expediente o subir un ZIP
              de LexNET.
            </p>
          </div>
        ) : (
          <ul>
            {allDeadlines.map((d, i) => {
              const due = new Date(d.dueDate)
              const n = days(due)
              const chip = chipTone(n, d.status)
              const badge = statusBadge(d.status, n)
              const isLast = i === allDeadlines.length - 1
              return (
                <li
                  key={d.id}
                  className={`jur-row-hover ${isLast ? "" : "jur-row-sep"} py-4 flex items-center gap-4`}
                >
                  <div className={`jur-date-chip is-${chip}`}>
                    <span className="m">{MONTHS_ES[due.getMonth()]}</span>
                    <span className="d">{String(due.getDate()).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] text-[#0A0A0A] font-semibold truncate">
                        {d.title}
                      </span>
                      <span className={`jur-badge jur-badge-${badge.tone}`}>{badge.label}</span>
                    </div>
                    <div className="jur-mono text-[11px] text-[#6B6B6B] mt-1 truncate">
                      {d.caseNumber ?? "EXP"} · {d.caseTitle}
                    </div>
                    <div className="text-[12.5px] text-[#6B6B6B] mt-0.5">
                      Vence el {due.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A0A0A0] shrink-0" />
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
