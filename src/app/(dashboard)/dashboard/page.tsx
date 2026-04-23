import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { cases, deadlines, lexnetNotifications, users } from "@/lib/db/schema"
import { eq, and, gte, lte, sql } from "drizzle-orm"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const [user] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))

  const [caseCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(cases)
    .where(and(eq(cases.userId, userId), eq(cases.status, "active")))

  const now = new Date()
  const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const [upcomingDeadlines] = await db
    .select({ count: sql<number>`count(*)` })
    .from(deadlines)
    .where(
      and(
        eq(deadlines.userId, userId),
        eq(deadlines.status, "pending"),
        lte(deadlines.dueDate, in7days),
        gte(deadlines.dueDate, now)
      )
    )

  const [unreadCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(lexnetNotifications)
    .where(and(eq(lexnetNotifications.userId, userId), eq(lexnetNotifications.read, false)))

  const nextDeadlines = await db
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
    .where(and(eq(deadlines.userId, userId), eq(deadlines.status, "pending")))
    .orderBy(deadlines.dueDate)
    .limit(5)

  const firstName = session?.user?.name?.split(" ")[0] ?? ""

  function daysUntil(date: Date) {
    const diff = new Date(date).getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  function urgencyColor(days: number) {
    if (days <= 1) return "text-red-600 bg-red-50 ring-red-200"
    if (days <= 3) return "text-amber-600 bg-amber-50 ring-amber-200"
    return "text-emerald-600 bg-emerald-50 ring-emerald-200"
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold">
          Bienvenido{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Resumen de tu despacho
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Expedientes Activos</p>
          <p className="text-4xl font-extrabold mt-2 tabular-nums">{Number(caseCount.count)}</p>
          <Link href="/dashboard/cases" className="mt-2 block text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Ver expedientes →
          </Link>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">Plazos próximos (7d)</p>
          <p className="text-4xl font-extrabold mt-2 tabular-nums text-amber-700">{Number(upcomingDeadlines.count)}</p>
          <Link href="/dashboard/deadlines" className="mt-2 block text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors">
            Ver plazos →
          </Link>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-6 shadow-[0_0_20px_rgba(79,70,229,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Sin leer</p>
          <p className="text-4xl font-extrabold mt-2 tabular-nums text-indigo-700">{Number(unreadCount.count)}</p>
          <Link href="/dashboard/notifications" className="mt-2 block text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Ver notificaciones →
          </Link>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">Plazos Próximos</h2>
          <Link href="/dashboard/deadlines" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            Ver todos →
          </Link>
        </div>

        {nextDeadlines.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-muted-foreground">
            <p className="text-sm">No hay plazos pendientes. Crea un expediente para empezar.</p>
            <Link href="/dashboard/cases" className="text-indigo-600 hover:underline text-sm mt-2 inline-block font-medium">
              Crear expediente →
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50 overflow-hidden">
            {nextDeadlines.map((d) => {
              const days = daysUntil(d.dueDate)
              return (
                <div key={d.id} className="flex items-center gap-4 px-5 py-4">
                  <span className={`text-sm font-bold tabular-nums px-2 py-0.5 rounded-md ring-1 shrink-0 ${urgencyColor(days)}`}>
                    {days}d
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground/90 truncate">
                      {d.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {d.caseTitle}{d.caseNumber ? ` (${d.caseNumber})` : ""} · Vence {new Date(d.dueDate).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {user?.plan === "free" && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
          <p className="font-bold text-indigo-900">Pasa al plan Despacho</p>
          <p className="text-sm text-indigo-700 mt-1">
            Expedientes ilimitados, resúmenes con IA, control de tiempo y más.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center justify-center mt-4 h-9 px-5 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors"
          >
            Desde 29€/mes
          </Link>
        </div>
      )}
    </div>
  )
}
