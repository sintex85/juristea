import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { deadlines, cases } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"

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

  function daysUntil(date: Date) {
    return Math.ceil((new Date(date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  function statusBadge(status: string, days: number) {
    if (status === "completed") return "bg-emerald-50 text-emerald-600"
    if (status === "expired" || days < 0) return "bg-red-50 text-red-600"
    if (days <= 3) return "bg-amber-50 text-amber-600"
    return "bg-gray-50 text-gray-600"
  }

  function statusLabel(status: string, days: number) {
    if (status === "completed") return "Completado"
    if (status === "expired" || days < 0) return "Vencido"
    if (days === 0) return "Hoy"
    if (days === 1) return "Mañana"
    return `${days} días`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plazos Procesales</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{allDeadlines.length} plazo{allDeadlines.length !== 1 ? "s" : ""}</p>
      </div>

      {allDeadlines.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-muted-foreground">
          <p className="text-sm">No hay plazos registrados.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50 overflow-hidden">
          {allDeadlines.map((d) => {
            const days = daysUntil(d.dueDate)
            return (
              <div key={d.id} className="flex items-center gap-4 px-5 py-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md shrink-0 ${statusBadge(d.status, days)}`}>
                  {statusLabel(d.status, days)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground/90 truncate">{d.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {d.caseTitle}{d.caseNumber ? ` (${d.caseNumber})` : ""} · {new Date(d.dueDate).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
