import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { timeEntries, cases } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export default async function TimePage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const entries = await db
    .select({
      id: timeEntries.id,
      description: timeEntries.description,
      minutes: timeEntries.minutes,
      date: timeEntries.date,
      billable: timeEntries.billable,
      caseTitle: cases.title,
    })
    .from(timeEntries)
    .innerJoin(cases, eq(timeEntries.caseId, cases.id))
    .where(eq(timeEntries.userId, userId))
    .orderBy(desc(timeEntries.date))

  const totalMinutes = entries.reduce((sum, e) => sum + e.minutes, 0)
  const billableMinutes = entries.filter((e) => e.billable).reduce((sum, e) => sum + e.minutes, 0)

  function formatTime(mins: number) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m}m`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Control de Tiempo</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Total: {formatTime(totalMinutes)} · Facturable: {formatTime(billableMinutes)}
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-muted-foreground">
          <p className="text-sm">No hay entradas de tiempo. Registra horas desde un expediente.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50 overflow-hidden">
          {entries.map((e) => (
            <div key={e.id} className="flex items-center gap-4 px-5 py-4">
              <span className="text-sm font-bold tabular-nums text-foreground/80 shrink-0 w-16">
                {formatTime(e.minutes)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground/90 truncate">{e.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {e.caseTitle} · {new Date(e.date).toLocaleDateString("es-ES")}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${e.billable ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-500"}`}>
                {e.billable ? "Facturable" : "No facturable"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
