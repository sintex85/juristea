import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CalendarClock,
  Inbox,
  Calendar,
  Clock,
  FileText,
  User,
  Scale,
  Hash,
} from "lucide-react"
import { eq, and, desc, asc, sql } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  cases,
  clients,
  deadlines,
  events as eventsTable,
  lexnetNotifications,
  documents,
  timeEntries,
} from "@/lib/db/schema"
import { CaseHeaderActions } from "./case-header-actions"

type BadgeTone = "ok" | "warn" | "gray" | "clay"

const MONTHS_ES = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"]

const statusInfo: Record<string, { label: string; tone: BadgeTone }> = {
  active:   { label: "En trámite", tone: "ok" },
  archived: { label: "Archivado",  tone: "gray" },
  closed:   { label: "Cerrado",    tone: "clay" },
}

function chipTone(days: number): "clay" | "warn" | "gray" {
  if (days <= 1) return "clay"
  if (days <= 5) return "warn"
  return "gray"
}

function formatTime(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null
  const { id } = await params
  const userId = session.user.id

  const [row] = await db
    .select({
      id: cases.id,
      title: cases.title,
      caseNumber: cases.caseNumber,
      nig: cases.nig,
      court: cases.court,
      jurisdiction: cases.jurisdiction,
      status: cases.status,
      description: cases.description,
      createdAt: cases.createdAt,
      updatedAt: cases.updatedAt,
      clientId: cases.clientId,
      clientName: clients.name,
      clientEmail: clients.email,
      clientPhone: clients.phone,
    })
    .from(cases)
    .leftJoin(clients, eq(cases.clientId, clients.id))
    .where(and(eq(cases.id, id), eq(cases.userId, userId)))

  if (!row) notFound()

  // Query each related entity individually so a failure tells us exactly which.
  async function safe<T>(name: string, q: () => Promise<T>, fallback: T): Promise<T> {
    try {
      return await q()
    } catch (err) {
      console.error(`[case ${row!.id}] query "${name}" failed`, err)
      return fallback
    }
  }

  const caseDeadlines = await safe(
    "deadlines",
    () =>
      db
        .select({
          id: deadlines.id,
          title: deadlines.title,
          dueDate: deadlines.dueDate,
          status: deadlines.status,
        })
        .from(deadlines)
        .where(and(eq(deadlines.caseId, row.id), eq(deadlines.userId, userId)))
        .orderBy(asc(deadlines.dueDate)),
    [] as { id: string; title: string; dueDate: Date; status: string }[]
  )

  const caseEvents = await safe(
    "events",
    () =>
      db
        .select({
          id: eventsTable.id,
          title: eventsTable.title,
          type: eventsTable.type,
          startAt: eventsTable.startAt,
          endAt: eventsTable.endAt,
          location: eventsTable.location,
          completed: eventsTable.completed,
        })
        .from(eventsTable)
        .where(and(eq(eventsTable.caseId, row.id), eq(eventsTable.userId, userId)))
        .orderBy(asc(eventsTable.startAt)),
    [] as {
      id: string
      title: string
      type: string
      startAt: Date
      endAt: Date | null
      location: string | null
      completed: boolean
    }[]
  )

  const caseLexnet = await safe(
    "lexnet",
    () =>
      db
        .select({
          id: lexnetNotifications.id,
          subject: lexnetNotifications.subject,
          sender: lexnetNotifications.sender,
          type: lexnetNotifications.type,
          receivedAt: lexnetNotifications.receivedAt,
          read: lexnetNotifications.read,
        })
        .from(lexnetNotifications)
        .where(
          and(
            eq(lexnetNotifications.caseId, row.id),
            eq(lexnetNotifications.userId, userId)
          )
        )
        .orderBy(desc(lexnetNotifications.receivedAt))
        .limit(20),
    [] as {
      id: string
      subject: string
      sender: string | null
      type: string
      receivedAt: Date
      read: boolean
    }[]
  )

  const caseDocs = await safe(
    "documents",
    () =>
      db
        .select({
          id: documents.id,
          name: documents.name,
          fileUrl: documents.fileUrl,
          fileSize: documents.fileSize,
          mimeType: documents.mimeType,
          uploadedAt: documents.uploadedAt,
        })
        .from(documents)
        .where(eq(documents.caseId, row.id))
        .orderBy(desc(documents.uploadedAt))
        .limit(20),
    [] as {
      id: string
      name: string
      fileUrl: string
      fileSize: number | null
      mimeType: string | null
      uploadedAt: Date
    }[]
  )

  const timeAgg = await safe(
    "time-aggregate",
    () =>
      db
        .select({
          totalMinutes: sql<number>`coalesce(sum(${timeEntries.minutes}), 0)`,
          billableMinutes: sql<number>`coalesce(sum(case when ${timeEntries.billable} then ${timeEntries.minutes} else 0 end), 0)`,
          entries: sql<number>`count(*)`,
        })
        .from(timeEntries)
        .where(eq(timeEntries.caseId, row.id)),
    [{ totalMinutes: 0, billableMinutes: 0, entries: 0 }]
  )

  const now = new Date()
  function daysUntil(d: Date) {
    const a = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const b = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
  }

  const pendingDeadlines = caseDeadlines.filter((d) => d.status === "pending")
  const totalMinutes = Number(timeAgg[0]?.totalMinutes ?? 0)
  const billableMinutes = Number(timeAgg[0]?.billableMinutes ?? 0)
  const totalEntries = Number(timeAgg[0]?.entries ?? 0)

  const s = statusInfo[row.status] ?? { label: row.status, tone: "gray" as BadgeTone }

  const clientForEdit = {
    id: row.id,
    title: row.title,
    clientId: row.clientId ?? "",
    caseNumber: row.caseNumber,
    nig: row.nig,
    court: row.court,
    jurisdiction: row.jurisdiction,
    description: row.description,
    status: row.status,
  }

  // For the edit modal: pull all clients
  const allClients = await db
    .select({ id: clients.id, name: clients.name })
    .from(clients)
    .where(eq(clients.userId, userId))
    .orderBy(asc(clients.name))

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <Link
        href="/dashboard/cases"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-[#6B6B6B] hover:text-[#0A0A0A] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a expedientes
      </Link>

      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="jur-mono-label">EXPEDIENTE</div>
            <span className={`jur-badge jur-badge-${s.tone}`}>{s.label}</span>
          </div>
          <h1 className="jur-display text-[40px] sm:text-[48px] text-[#0A0A0A] mt-3 leading-[1.05]">
            {row.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#6B6B6B]">
            {row.clientId && row.clientName && (
              <Link
                href={`/dashboard/clients/${row.clientId}`}
                className="inline-flex items-center gap-1.5 hover:text-[#0A0A0A]"
              >
                <User className="w-3.5 h-3.5" />
                {row.clientName}
              </Link>
            )}
            {row.jurisdiction && (
              <span className="inline-flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span className="capitalize">{row.jurisdiction}</span>
              </span>
            )}
            {row.caseNumber && (
              <span className="inline-flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                <span className="jur-mono text-[12px] text-[#0A0A0A]">{row.caseNumber}</span>
              </span>
            )}
            {row.court && <span>{row.court}</span>}
            {row.nig && (
              <span className="jur-mono text-[11.5px] text-[#6B6B6B]">NIG {row.nig}</span>
            )}
          </div>
        </div>

        <CaseHeaderActions caseRow={clientForEdit} clients={allClients} />
      </div>

      {/* KPIs */}
      <section className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Plazos" value={String(pendingDeadlines.length)}>
          <span>{caseDeadlines.length} totales</span>
        </Kpi>
        <Kpi label="Notificaciones" value={String(caseLexnet.length)}>
          <span>{caseLexnet.filter((n) => !n.read).length} sin leer</span>
        </Kpi>
        <Kpi label="Tiempo dedicado" value={formatTime(totalMinutes)}>
          <span>{totalEntries} entrada{totalEntries === 1 ? "" : "s"}</span>
        </Kpi>
        <Kpi label="Facturable" value={formatTime(billableMinutes)}>
          <span>{Math.round((billableMinutes / 60) * 120).toLocaleString("es-ES")} € · est. 120 €/h</span>
        </Kpi>
      </section>

      {/* Two columns: deadlines + lexnet */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="jur-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarClock className="w-4 h-4 text-[#B54534]" />
              <h2 className="jur-serif text-[22px] text-[#0A0A0A]">Plazos</h2>
            </div>
            <Link href="/dashboard/deadlines" className="jur-btn-ghost">
              Ver todos <ArrowRight className="w-3.5 h-3.5 arr" />
            </Link>
          </div>
          {caseDeadlines.length === 0 ? (
            <div className="p-10 text-center">
              <p className="jur-serif text-[20px] text-[#0A0A0A]">Sin plazos registrados.</p>
              <p className="mt-2 text-[13px] text-[#6B6B6B]">
                Se crearán automáticamente al subir notificaciones de LexNET.
              </p>
            </div>
          ) : (
            <ul>
              {caseDeadlines.map((d, i) => {
                const due = new Date(d.dueDate)
                const days = daysUntil(due)
                const chip = d.status === "completed" ? "gray" : chipTone(days)
                const isLast = i === caseDeadlines.length - 1
                return (
                  <li key={d.id} className={`px-6 py-3 jur-row-hover ${isLast ? "" : "jur-row-sep"} flex items-center gap-4`}>
                    <div className={`jur-date-chip is-${chip}`}>
                      <span className="m">{MONTHS_ES[due.getMonth()]}</span>
                      <span className="d">{String(due.getDate()).padStart(2,"0")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] text-[#0A0A0A] font-medium truncate">{d.title}</div>
                      <div className="text-[11.5px] text-[#6B6B6B] mt-0.5">
                        {d.status === "completed"
                          ? "Completado"
                          : days <= 0
                          ? "Vencido"
                          : days === 0
                          ? "Hoy"
                          : days === 1
                          ? "Mañana"
                          : `${days} días`}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#A0A0A0]" />
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="jur-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Inbox className="w-4 h-4 text-[#B54534]" />
              <h2 className="jur-serif text-[22px] text-[#0A0A0A]">Notificaciones LexNET</h2>
            </div>
            <Link href="/dashboard/notifications" className="jur-btn-ghost">
              Ver todas <ArrowRight className="w-3.5 h-3.5 arr" />
            </Link>
          </div>
          {caseLexnet.length === 0 ? (
            <div className="p-10 text-center">
              <p className="jur-serif text-[20px] text-[#0A0A0A]">Aún no hay notificaciones.</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#EFEFEF]">
              {caseLexnet.map((n) => (
                <li key={n.id} className="px-6 py-3 flex items-center gap-3 jur-row-hover">
                  {!n.read && <span className="jur-urg-dot bg-[#B54534] shrink-0" />}
                  {n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#E5E5E5] shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] text-[#0A0A0A] font-medium truncate">{n.subject}</div>
                    <div className="jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider mt-0.5 truncate">
                      {n.sender ?? "REMITENTE DESCONOCIDO"}
                    </div>
                  </div>
                  {n.type && (
                    <span className="jur-badge jur-badge-gray capitalize shrink-0">{n.type}</span>
                  )}
                  <span className="jur-mono text-[11px] text-[#6B6B6B] shrink-0">
                    {new Date(n.receivedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Events + description */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 jur-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center gap-3">
            <Calendar className="w-4 h-4 text-[#B54534]" />
            <h2 className="jur-serif text-[22px] text-[#0A0A0A]">Eventos</h2>
          </div>
          {caseEvents.length === 0 ? (
            <div className="p-10 text-center">
              <p className="jur-serif text-[20px] text-[#0A0A0A]">Sin eventos registrados.</p>
              <p className="mt-2 text-[13px] text-[#6B6B6B]">
                Crea vistas, reuniones o llamadas desde la agenda.
              </p>
              <Link href="/dashboard/agenda" className="mt-5 inline-flex jur-btn-solid">
                Ir a la agenda
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#EFEFEF]">
              {caseEvents.map((e) => (
                <li key={e.id} className="px-6 py-3 flex items-center gap-4 jur-row-hover">
                  <div className="w-20 shrink-0">
                    <div className="jur-mono text-[12.5px] text-[#0A0A0A] font-medium">
                      {new Date(e.startAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                    </div>
                    <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-0.5">
                      {new Date(e.startAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[13.5px] font-medium truncate ${e.completed ? "line-through text-[#A0A0A0]" : "text-[#0A0A0A]"}`}>
                      {e.title}
                    </div>
                    <div className="text-[11.5px] text-[#6B6B6B] capitalize">
                      {e.type}
                      {e.location && <> · {e.location}</>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="jur-card p-6">
          <div className="jur-mono-label">DESCRIPCIÓN</div>
          {row.description ? (
            <p className="mt-3 text-[13.5px] text-[#0A0A0A] leading-relaxed whitespace-pre-wrap">
              {row.description}
            </p>
          ) : (
            <p className="mt-3 text-[13px] text-[#A0A0A0] italic">
              Sin descripción. Pulsa Editar para añadirla.
            </p>
          )}
          <div className="mt-5 pt-5 border-t border-[#EFEFEF] text-[12px] text-[#6B6B6B]">
            <div>Abierto el {new Date(row.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</div>
            <div>Última actividad {new Date(row.updatedAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="mt-6 jur-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-[#B54534]" />
            <h2 className="jur-serif text-[22px] text-[#0A0A0A]">Documentación</h2>
          </div>
          <div className="jur-mono text-[11px] text-[#6B6B6B]">
            {caseDocs.length} documento{caseDocs.length === 1 ? "" : "s"}
          </div>
        </div>
        {caseDocs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="jur-serif text-[20px] text-[#0A0A0A]">No hay documentos subidos.</p>
            <p className="mt-2 text-[13px] text-[#6B6B6B]">
              Adjunta archivos al expediente desde la integración LexNET o subiendo manualmente.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#EFEFEF]">
            {caseDocs.map((d) => (
              <li key={d.id} className="flex items-center gap-4 px-6 py-3 jur-row-hover">
                <FileText className="w-4 h-4 text-[#A0A0A0] shrink-0" />
                <a
                  href={d.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-0 hover:underline"
                >
                  <div className="text-[13.5px] text-[#0A0A0A] font-medium truncate">{d.name}</div>
                  <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-0.5">
                    {new Date(d.uploadedAt).toLocaleDateString("es-ES")}
                    {d.fileSize && <> · {(d.fileSize / 1024).toFixed(0)} KB</>}
                  </div>
                </a>
                {d.mimeType && (
                  <span className="jur-badge jur-badge-gray uppercase shrink-0">
                    {d.mimeType.split("/")[1] ?? "doc"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Time block */}
      <section className="mt-6 jur-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#B54534]" />
            <h2 className="jur-serif text-[22px] text-[#0A0A0A]">Tiempo</h2>
          </div>
          <Link href="/dashboard/time" className="jur-btn-ghost">
            Registro completo <ArrowRight className="w-3.5 h-3.5 arr" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 p-7">
          <div>
            <div className="jur-mono-label">DEDICADO</div>
            <div className="mt-2 text-[36px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">
              {formatTime(totalMinutes)}
            </div>
            <div className="mt-2 text-[12.5px] text-[#6B6B6B]">{totalEntries} entradas</div>
          </div>
          <div>
            <div className="jur-mono-label">FACTURABLE</div>
            <div className="mt-2 text-[36px] font-semibold tracking-[-0.02em] text-[#B54534] leading-none">
              {formatTime(billableMinutes)}
            </div>
            <div className="mt-2 text-[12.5px] text-[#6B6B6B]">
              {totalMinutes ? Math.round((billableMinutes / totalMinutes) * 100) : 0}% del total
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Kpi({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children?: React.ReactNode
}) {
  return (
    <div className="jur-card p-6">
      <div className="jur-mono-label">{label.toUpperCase()}</div>
      <div className="mt-3 text-[36px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">
        {value}
      </div>
      {children && <div className="mt-3 text-[12.5px] text-[#6B6B6B]">{children}</div>}
    </div>
  )
}
