import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Gavel,
  Phone,
  User,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { eq, and, gte, lte, sql, desc } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { cases, deadlines, lexnetNotifications } from "@/lib/db/schema"

type ChipTone = "clay" | "warn" | "gray"
type BadgeTone = "ok" | "warn" | "gray" | "clay"

const MONTHS_ES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
const DAYS_ES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]

function greetingFor(hour: number) {
  if (hour >= 6 && hour < 14) return "Buenos días"
  if (hour >= 14 && hour < 21) return "Buenas tardes"
  return "Buenas noches"
}

function daysUntil(target: Date, from: Date) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const b = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

function chipToneFor(days: number): ChipTone {
  if (days <= 1) return "clay"
  if (days <= 5) return "warn"
  return "gray"
}

function badgeToneForArea(area: string | null | undefined): BadgeTone {
  switch ((area ?? "").toLowerCase()) {
    case "civil": return "clay"
    case "penal": return "gray"
    case "social": return "ok"
    case "mercantil": return "warn"
    case "contencioso": return "gray"
    default: return "gray"
  }
}

function dayLabel(days: number, target: Date) {
  if (days === 0) return "HOY"
  if (days === 1) return "MAÑANA"
  return `${days} días`
}

function timeHint(days: number, target: Date) {
  const dow = DAYS_ES[target.getDay()]
  if (days === 0) return "14:30 cierre"
  if (days === 1) return "1 día"
  return dow
}

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const now = new Date()
  const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const in15days = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)

  const [activeCases, thisWeekDeadlines, unreadLexnet, nextDeadlines, recentCases] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(cases)
        .where(and(eq(cases.userId, userId), eq(cases.status, "active"))),
      db.select({ count: sql<number>`count(*)` })
        .from(deadlines)
        .where(and(
          eq(deadlines.userId, userId),
          eq(deadlines.status, "pending"),
          gte(deadlines.dueDate, now),
          lte(deadlines.dueDate, in7days),
        )),
      db.select({ count: sql<number>`count(*)` })
        .from(lexnetNotifications)
        .where(and(eq(lexnetNotifications.userId, userId), eq(lexnetNotifications.read, false))),
      db.select({
        id: deadlines.id,
        title: deadlines.title,
        dueDate: deadlines.dueDate,
        caseTitle: cases.title,
        caseNumber: cases.caseNumber,
        caseArea: cases.jurisdiction,
      })
        .from(deadlines)
        .innerJoin(cases, eq(deadlines.caseId, cases.id))
        .where(and(
          eq(deadlines.userId, userId),
          eq(deadlines.status, "pending"),
          lte(deadlines.dueDate, in15days),
        ))
        .orderBy(deadlines.dueDate)
        .limit(7),
      db.select({
        id: cases.id,
        caseNumber: cases.caseNumber,
        title: cases.title,
        area: cases.jurisdiction,
        updatedAt: cases.updatedAt,
        status: cases.status,
      })
        .from(cases)
        .where(eq(cases.userId, userId))
        .orderBy(desc(cases.updatedAt))
        .limit(6),
    ])

  const firstName = session.user?.name?.split(" ")[0] ?? "bienvenid@"
  const greeting = greetingFor(now.getHours())

  const activeCount = Number(activeCases[0]?.count ?? 0)
  const deadlineCount = Number(thisWeekDeadlines[0]?.count ?? 0)
  const lexnetCount = Number(unreadLexnet[0]?.count ?? 0)

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      {/* EDITORIAL HEADER */}
      <section>
        <span className="jur-pill">
          <span className="dot" />
          <span className="jur-mono">TODO EN ORDEN</span>
          <span className="text-[#6B6B6B]">· Última sync Lexnet hace 4 min</span>
        </span>
        <h1 className="jur-display text-[56px] sm:text-[72px] text-[#0A0A0A] mt-5">
          {greeting}, <em>{firstName}</em>.
        </h1>
        <p className="mt-4 text-[15.5px] text-[#6B6B6B] max-w-2xl leading-relaxed">
          Hoy tienes{" "}
          <span className="text-[#0A0A0A] font-medium">
            {deadlineCount} plazo{deadlineCount === 1 ? "" : "s"} esta semana
          </span>
          ,{" "}
          <span className="text-[#0A0A0A] font-medium">
            {lexnetCount} notificaci{lexnetCount === 1 ? "ón" : "ones"} sin clasificar
          </span>{" "}
          y{" "}
          <span className="text-[#0A0A0A] font-medium">
            {activeCount} expediente{activeCount === 1 ? "" : "s"} activo{activeCount === 1 ? "" : "s"}
          </span>
          .
        </p>
      </section>

      {/* KPIs */}
      <section className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Expedientes activos" value={activeCount}>
          <div className="text-[12.5px] text-[#6B6B6B] flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-[#10B981] font-medium">3 este mes</span>
            <span className="text-[#A0A0A0]">·</span>
            <span>12 cerrados</span>
          </div>
        </KpiCard>
        <KpiCard label="Plazos esta semana" value={deadlineCount}>
          <div className="text-[12.5px] text-[#6B6B6B] flex items-center gap-1.5">
            <span className="jur-urg-dot bg-[#B54534]" />
            <span className="text-[#B54534] font-medium">
              {Math.min(3, deadlineCount)} crítico{Math.min(3, deadlineCount) === 1 ? "" : "s"}
            </span>
            <span className="text-[#A0A0A0]">·</span>
            <span>{Math.max(0, deadlineCount - 3)} normales</span>
          </div>
        </KpiCard>
        <KpiCard label="Lexnet sin clasificar" value={lexnetCount}>
          <Link href="/dashboard/notifications" className="jur-btn-ghost clay text-[12.5px]">
            Clasificar <ArrowRight className="w-3.5 h-3.5 arr" />
          </Link>
        </KpiCard>
        <KpiCard label="Por facturar" value="8.450" suffix="€">
          <div className="text-[12.5px] text-[#6B6B6B]">en 14 minutas pendientes</div>
        </KpiCard>
      </section>

      {/* 2/3 + 1/3 */}
      <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plazos */}
        <div className="lg:col-span-2 jur-card p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="jur-serif text-[30px] text-[#0A0A0A]">
                Plazos <em>próximos</em>
              </h2>
              <p className="mt-1 text-[13px] text-[#6B6B6B]">
                Los próximos 15 días · ordenados por urgencia
              </p>
            </div>
            <Link href="/dashboard/deadlines" className="jur-btn-ghost">
              Ver calendario <ArrowRight className="w-3.5 h-3.5 arr" />
            </Link>
          </div>

          <ul className="mt-5">
            {nextDeadlines.length === 0 && (
              <li className="py-10 text-center text-[13px] text-[#6B6B6B]">
                No hay plazos en los próximos 15 días.
              </li>
            )}
            {nextDeadlines.map((d, i) => {
              const due = new Date(d.dueDate)
              const days = daysUntil(due, now)
              const chip = chipToneFor(days)
              const tone = badgeToneForArea(d.caseArea)
              const isLast = i === nextDeadlines.length - 1
              return (
                <li
                  key={d.id}
                  className={`jur-row-hover ${isLast ? "" : "jur-row-sep"} py-4 flex items-center gap-4 cursor-pointer`}
                >
                  <div className={`jur-date-chip is-${chip}`}>
                    <span className="m">{MONTHS_ES[due.getMonth()]}</span>
                    <span className="d">{String(due.getDate()).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] text-[#0A0A0A] font-semibold truncate">
                        {d.title}
                      </span>
                      {d.caseArea && (
                        <Badge tone={tone}>{capitalize(d.caseArea)}</Badge>
                      )}
                    </div>
                    <div className="jur-mono text-[11px] text-[#6B6B6B] mt-1 truncate">
                      {d.caseNumber ?? "EXP"} · {d.caseTitle}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className={`text-[15px] font-semibold tracking-tight ${chip === "clay" ? "text-[#B54534]" : "text-[#0A0A0A]"}`}>
                        {dayLabel(days, due)}
                      </div>
                      <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-0.5">
                        {timeHint(days, due)}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#A0A0A0]" />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Right rail */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Lexnet */}
          <div className="jur-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h3 className="jur-serif text-[26px] text-[#0A0A0A]">Lexnet</h3>
                <Badge tone="clay">{lexnetCount} sin clasificar</Badge>
              </div>
            </div>
            <p className="mt-0.5 text-[12.5px] text-[#6B6B6B]">
              Últimas notificaciones recibidas
            </p>

            <ul className="mt-4 divide-y divide-[#EFEFEF]">
              <LexnetItem source="JUZGADO 1ª INST. Nº 4 MADRID" title="Diligencia de ordenación" time="hace 23 min" urgent />
              <LexnetItem source="AUDIENCIA PROV. MADRID · SEC. 4" title="Auto resolviendo recurso" time="hace 1 h 12 min" urgent />
              <LexnetItem source="JUZG. SOCIAL Nº 14 MADRID" title="Citación a vista oral" time="hace 3 h" />
              <LexnetItem source="JUZG. MERCANTIL Nº 6 MADRID" title="Traslado de demanda" time="hoy · 08:14" />
              <LexnetItem source="TSJ MADRID · SALA CONT.-ADMIN." title="Providencia sobre prueba" time="ayer · 17:42" />
            </ul>

            <Link href="/dashboard/notifications" className="jur-btn-ghost mt-4">
              Clasificar todas <ArrowRight className="w-3.5 h-3.5 arr" />
            </Link>
          </div>

          {/* Agenda */}
          <div className="jur-card p-6">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="jur-serif text-[26px] text-[#0A0A0A]">Agenda</h3>
                <div className="jur-mono text-[11px] text-[#6B6B6B] mt-0.5">
                  {DAYS_ES[now.getDay()].toUpperCase()}, {now.getDate()} {MONTHS_ES[now.getMonth()].toLowerCase()}
                </div>
              </div>
              <div className="jur-mono text-[11px] text-[#6B6B6B]">4 eventos</div>
            </div>

            <ul className="mt-5 space-y-4">
              <AgendaItem time="10:00" duration="90 min" title="Vista oral" meta="EXP-2026-0198 · Juzg. Penal nº 3" icon={<Gavel className="w-3.5 h-3.5 text-[#B54534]" />} />
              <AgendaItem time="12:30" duration="45 min" title="Reunión cliente" meta="Carlos Méndez · despacho" icon={<User className="w-3.5 h-3.5 text-[#1a1a1a]" />} />
              <AgendaItem time="16:00" duration="20 min" title="Llamada procurador" meta="Sra. Ortega" icon={<Phone className="w-3.5 h-3.5 text-[#1a1a1a]" />} />
              <AgendaItem time="18:30" duration="60 min" title="Revisión dictamen pericial" meta="EXP-2026-0247 · en solitario" icon={<FileText className="w-3.5 h-3.5 text-[#1a1a1a]" />} />
            </ul>

            <Link href="/dashboard/agenda" className="jur-btn-ghost mt-5">
              Ver agenda <ArrowRight className="w-3.5 h-3.5 arr" />
            </Link>
          </div>
        </div>
      </section>

      {/* BOTTOM ROW */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expedientes recientes */}
        <div className="jur-card p-7">
          <div className="flex items-end justify-between gap-4">
            <h3 className="jur-serif text-[28px] text-[#0A0A0A]">Expedientes recientes</h3>
            <Link href="/dashboard/cases" className="jur-btn-ghost">
              Ver todos <ArrowRight className="w-3.5 h-3.5 arr" />
            </Link>
          </div>

          <div className="mt-5">
            <div className="grid grid-cols-12 gap-3 pb-2 jur-mono text-[10px] text-[#6B6B6B] tracking-wider uppercase border-b border-[#E5E5E5]">
              <div className="col-span-3">Nº</div>
              <div className="col-span-4">Cliente</div>
              <div className="col-span-2">Jurisd.</div>
              <div className="col-span-2">Actividad</div>
              <div className="col-span-1 text-right">Estado</div>
            </div>

            <div className="divide-y divide-[#EFEFEF]">
              {recentCases.length === 0 && (
                <div className="py-8 text-center text-[13px] text-[#6B6B6B]">
                  Aún no hay expedientes.{" "}
                  <Link href="/dashboard/cases" className="text-[#B54534] font-medium">
                    Crear el primero →
                  </Link>
                </div>
              )}
              {recentCases.map((c) => (
                <div
                  key={c.id}
                  className="grid grid-cols-12 gap-3 py-3 jur-row-hover cursor-pointer items-center"
                >
                  <div className="col-span-3 jur-mono text-[11.5px] text-[#0A0A0A]">
                    {c.caseNumber ?? "—"}
                  </div>
                  <div className="col-span-4 text-[13px] text-[#0A0A0A] truncate">{c.title}</div>
                  <div className="col-span-2 text-[12.5px] text-[#6B6B6B]">
                    {c.area ? capitalize(c.area) : "—"}
                  </div>
                  <div className="col-span-2 text-[12.5px] text-[#6B6B6B]">
                    {relativeTime(c.updatedAt, now)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Badge tone={c.status === "active" ? "ok" : "gray"}>
                      {c.status === "active" ? "En trámite" : capitalize(c.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Facturación */}
        <div className="jur-card p-7">
          <div className="flex items-end justify-between gap-4">
            <h3 className="jur-serif text-[28px] text-[#0A0A0A]">
              Facturación <em>del mes</em>
            </h3>
            <div className="jur-mono text-[11px] text-[#6B6B6B]">
              {MONTHS_ES[now.getMonth()]} {now.getFullYear()}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <div className="jur-mono-label">FACTURADO</div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-[40px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">
                  14.820
                </span>
                <span className="text-[16px] text-[#0A0A0A] font-medium">€</span>
              </div>
              <div className="mt-2 text-[12px] text-[#10B981] font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +18% vs marzo
              </div>
            </div>
            <div>
              <div className="jur-mono-label">PENDIENTE DE COBRO</div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-[40px] font-semibold tracking-[-0.02em] text-[#B54534] leading-none">
                  8.450
                </span>
                <span className="text-[16px] text-[#B54534] font-medium">€</span>
              </div>
              <div className="mt-2 text-[12px] text-[#6B6B6B]">14 minutas · media 32 días</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider mb-1.5">
              <span>Objetivo mensual · 20.000 €</span>
              <span>74%</span>
            </div>
            <div className="jur-bar">
              <span style={{ width: "74%" }} />
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#EFEFEF]">
            <div className="jur-mono-label mb-3">ÚLTIMAS MINUTAS</div>
            <ul className="divide-y divide-[#EFEFEF]">
              <MinuteRow icon={<CheckCircle2 className="w-4 h-4 text-[#10B981]" />} id="MIN-2026-0082" client="Ruiz Martínez" meta="pagada hoy" amount="2.400 €" badge={{ tone: "ok", label: "Pagada" }} />
              <MinuteRow icon={<Clock className="w-4 h-4 text-[#F59E0B]" />} id="MIN-2026-0081" client="Constructora Levante" meta="vence en 15 días" amount="3.800 €" badge={{ tone: "warn", label: "15 días" }} />
              <MinuteRow icon={<AlertCircle className="w-4 h-4 text-[#B54534]" />} id="MIN-2026-0080" client="García & Cía" meta="vencida hace 3 días" amount="1.850 €" badge={{ tone: "clay", label: "Vencida" }} />
            </ul>
          </div>

          <Link href="/dashboard/billing" className="jur-btn-ghost mt-5">
            Gestionar minutas <ArrowRight className="w-3.5 h-3.5 arr" />
          </Link>
        </div>
      </section>

      <footer className="mt-16 pt-6 border-t border-[#E5E5E5] flex items-center justify-between jur-mono text-[10.5px] text-[#A0A0A0] uppercase tracking-wider">
        <span>Juristea · v26.1 · Madrid</span>
        <span>servidores en Frankfurt, DE</span>
      </footer>
    </div>
  )
}

function KpiCard({
  label,
  value,
  suffix,
  children,
}: {
  label: string
  value: number | string
  suffix?: string
  children?: React.ReactNode
}) {
  return (
    <div className="jur-card p-6">
      <div className="jur-mono-label">{label.toUpperCase()}</div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[44px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">
          {value}
        </span>
        {suffix && <span className="text-[18px] text-[#0A0A0A] font-medium">{suffix}</span>}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  const cls =
    tone === "ok" ? "jur-badge-ok" :
    tone === "warn" ? "jur-badge-warn" :
    tone === "clay" ? "jur-badge-clay" :
    "jur-badge-gray"
  return <span className={`jur-badge ${cls}`}>{children}</span>
}

function LexnetItem({
  source,
  title,
  time,
  urgent,
}: {
  source: string
  title: string
  time: string
  urgent?: boolean
}) {
  return (
    <li className="py-3">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="jur-mono text-[10px] text-[#6B6B6B] tracking-wider uppercase truncate">
            {source}
          </div>
          <div className="text-[13px] text-[#0A0A0A] font-medium mt-0.5 truncate">{title}</div>
          <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-1">{time}</div>
        </div>
        {urgent && <span className="jur-urg-dot bg-[#B54534] mt-1.5 shrink-0" />}
      </div>
    </li>
  )
}

function AgendaItem({
  time,
  duration,
  title,
  meta,
  icon,
}: {
  time: string
  duration: string
  title: string
  meta: string
  icon: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="w-12 shrink-0">
        <div className="jur-mono text-[14px] text-[#0A0A0A] font-medium leading-none">{time}</div>
        <div className="jur-mono text-[10px] text-[#6B6B6B] mt-1">{duration}</div>
      </div>
      <div className="flex-1 min-w-0 border-l border-[#E5E5E5] pl-4">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[13.5px] text-[#0A0A0A] font-medium">{title}</span>
        </div>
        <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-1 truncate">{meta}</div>
      </div>
    </li>
  )
}

function MinuteRow({
  icon,
  id,
  client,
  meta,
  amount,
  badge,
}: {
  icon: React.ReactNode
  id: string
  client: string
  meta: string
  amount: string
  badge: { tone: BadgeTone; label: string }
}) {
  return (
    <li className="py-3 flex items-center gap-3 jur-row-hover cursor-pointer">
      <span className="shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="jur-mono text-[11px] text-[#0A0A0A]">{id}</span>
          <span className="text-[13px] text-[#0A0A0A] truncate">· {client}</span>
        </div>
        <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-0.5">{meta}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[13.5px] text-[#0A0A0A] font-medium">{amount}</div>
        <Badge tone={badge.tone}>{badge.label}</Badge>
      </div>
    </li>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function relativeTime(at: Date, now: Date) {
  const diff = now.getTime() - new Date(at).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return "ahora"
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return "ayer"
  return `${days} días`
}
