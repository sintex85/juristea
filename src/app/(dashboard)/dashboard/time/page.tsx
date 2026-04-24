import { ArrowUpRight } from "lucide-react"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { timeEntries, cases } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

function formatTime(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

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
      caseNumber: cases.caseNumber,
    })
    .from(timeEntries)
    .innerJoin(cases, eq(timeEntries.caseId, cases.id))
    .where(eq(timeEntries.userId, userId))
    .orderBy(desc(timeEntries.date))

  const totalMinutes = entries.reduce((s, e) => s + e.minutes, 0)
  const billableMinutes = entries.filter((e) => e.billable).reduce((s, e) => s + e.minutes, 0)
  const now = new Date()
  const thisMonth = entries.filter((e) => {
    const d = new Date(e.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const thisMonthBillable = thisMonth
    .filter((e) => e.billable)
    .reduce((s, e) => s + e.minutes, 0)

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <div>
        <div className="jur-mono-label">HONORARIOS</div>
        <h1 className="jur-display text-[48px] sm:text-[56px] text-[#0A0A0A] mt-3">
          Cada hora <em>vale lo suyo</em>.
        </h1>
        <p className="mt-3 text-[14.5px] text-[#6B6B6B] max-w-2xl">
          Registra el tiempo dedicado a cada expediente y conviértelo en minutas con un par de clics.
        </p>
      </div>

      <section className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="jur-card p-6">
          <div className="jur-mono-label">HORAS TOTALES</div>
          <div className="mt-3 text-[40px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">
            {formatTime(totalMinutes)}
          </div>
          <div className="mt-2 text-[12.5px] text-[#6B6B6B]">
            {entries.length} entrada{entries.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="jur-card p-6">
          <div className="jur-mono-label">FACTURABLE</div>
          <div className="mt-3 text-[40px] font-semibold tracking-[-0.02em] text-[#B54534] leading-none">
            {formatTime(billableMinutes)}
          </div>
          <div className="mt-2 text-[12.5px] text-[#6B6B6B]">
            {totalMinutes ? Math.round((billableMinutes / totalMinutes) * 100) : 0}% del total
          </div>
        </div>
        <div className="jur-card p-6">
          <div className="jur-mono-label">ESTE MES</div>
          <div className="mt-3 text-[40px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">
            {formatTime(thisMonth.reduce((s, e) => s + e.minutes, 0))}
          </div>
          <div className="mt-2 text-[12.5px] text-[#10B981] font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> {formatTime(thisMonthBillable)} facturable
          </div>
        </div>
        <div className="jur-card p-6">
          <div className="jur-mono-label">ESTIMADO · 120 €/H</div>
          <div className="mt-3 text-[40px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">
            {Math.round((billableMinutes / 60) * 120).toLocaleString("es-ES")}
            <span className="text-[20px] ml-1">€</span>
          </div>
          <div className="mt-2 text-[12.5px] text-[#6B6B6B]">pendiente de facturar</div>
        </div>
      </section>

      <div className="mt-10 jur-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-end justify-between">
          <h2 className="jur-serif text-[24px] text-[#0A0A0A]">Registro de tiempo</h2>
          <div className="jur-mono text-[11px] text-[#6B6B6B]">
            {entries.length} línea{entries.length !== 1 ? "s" : ""}
          </div>
        </div>
        {entries.length === 0 ? (
          <div className="p-14 text-center">
            <p className="jur-serif text-[22px] text-[#0A0A0A]">No hay entradas todavía.</p>
            <p className="mt-2 text-[14px] text-[#6B6B6B]">
              Registra horas desde cualquier expediente para empezar.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#EFEFEF]">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center gap-4 px-6 py-4 jur-row-hover">
                <span className="jur-mono text-[12.5px] text-[#0A0A0A] font-medium tabular-nums shrink-0 w-20">
                  {formatTime(e.minutes)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-[#0A0A0A] font-medium truncate">
                    {e.description}
                  </div>
                  <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-1 truncate">
                    {e.caseNumber ?? "EXP"} · {e.caseTitle} ·{" "}
                    {new Date(e.date).toLocaleDateString("es-ES")}
                  </div>
                </div>
                <span
                  className={`jur-badge ${e.billable ? "jur-badge-ok" : "jur-badge-gray"} shrink-0`}
                >
                  {e.billable ? "Facturable" : "Interno"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
