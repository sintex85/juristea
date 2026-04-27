import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CalendarClock,
  Briefcase,
  FileText,
  Clock,
} from "lucide-react"
import { eq, and, desc, asc, sql, inArray } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  clients,
  cases,
  deadlines,
  documents,
  timeEntries,
  contacts as contactsTable,
} from "@/lib/db/schema"
import { ClientHeaderActions } from "./client-header-actions"

type BadgeTone = "ok" | "warn" | "gray" | "clay"

const statusInfo: Record<string, { label: string; tone: BadgeTone }> = {
  active: { label: "En trámite", tone: "ok" },
  archived: { label: "Archivado", tone: "gray" },
  closed: { label: "Cerrado", tone: "clay" },
}

const deadlineStatusInfo: Record<string, BadgeTone> = {
  pending: "warn",
  upcoming: "warn",
  expired: "clay",
  completed: "ok",
}

function formatTime(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null
  const { id } = await params

  const [client] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, id), eq(clients.userId, session.user.id)))

  if (!client) notFound()

  const allCases = await db
    .select({
      id: cases.id,
      title: cases.title,
      caseNumber: cases.caseNumber,
      court: cases.court,
      jurisdiction: cases.jurisdiction,
      status: cases.status,
      updatedAt: cases.updatedAt,
    })
    .from(cases)
    .where(and(eq(cases.clientId, client.id), eq(cases.userId, session.user.id)))
    .orderBy(desc(cases.updatedAt))

  const caseIds = allCases.map((c) => c.id)

  const [pendingDeadlines, allDocs, timeAgg, associatedContacts] = await Promise.all([
    caseIds.length
      ? db
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
              eq(deadlines.userId, session.user.id),
              inArray(deadlines.caseId, caseIds),
              eq(deadlines.status, "pending")
            )
          )
          .orderBy(asc(deadlines.dueDate))
          .limit(10)
      : [],
    caseIds.length
      ? db
          .select({
            id: documents.id,
            name: documents.name,
            fileUrl: documents.fileUrl,
            fileSize: documents.fileSize,
            mimeType: documents.mimeType,
            uploadedAt: documents.uploadedAt,
            caseTitle: cases.title,
            caseId: cases.id,
          })
          .from(documents)
          .innerJoin(cases, eq(documents.caseId, cases.id))
          .where(inArray(documents.caseId, caseIds))
          .orderBy(desc(documents.uploadedAt))
          .limit(40)
      : [],
    caseIds.length
      ? db
          .select({
            totalMinutes: sql<number>`coalesce(sum(${timeEntries.minutes}), 0)`,
            billableMinutes: sql<number>`coalesce(sum(case when ${timeEntries.billable} then ${timeEntries.minutes} else 0 end), 0)`,
            entries: sql<number>`count(*)`,
          })
          .from(timeEntries)
          .where(inArray(timeEntries.caseId, caseIds))
      : [{ totalMinutes: 0, billableMinutes: 0, entries: 0 }],
    db
      .select()
      .from(contactsTable)
      .where(
        and(
          eq(contactsTable.userId, session.user.id),
          eq(contactsTable.clientId, client.id)
        )
      )
      .limit(20),
  ])

  const totalMinutes = Number(timeAgg[0]?.totalMinutes ?? 0)
  const billableMinutes = Number(timeAgg[0]?.billableMinutes ?? 0)
  const totalEntries = Number(timeAgg[0]?.entries ?? 0)
  const activeCases = allCases.filter((c) => c.status === "active").length

  const initials = client.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <Link
        href="/dashboard/clients"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-[#6B6B6B] hover:text-[#0A0A0A] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a clientes
      </Link>

      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-[#0A0A0A] text-white text-[18px] font-medium flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="jur-mono-label">CLIENTE</div>
            <h1 className="jur-display text-[44px] sm:text-[52px] text-[#0A0A0A] mt-2 leading-[1.05]">
              {client.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#6B6B6B]">
              {client.email && (
                <a href={`mailto:${client.email}`} className="inline-flex items-center gap-1.5 hover:text-[#0A0A0A]">
                  <Mail className="w-3.5 h-3.5" />
                  {client.email}
                </a>
              )}
              {client.phone && (
                <a href={`tel:${client.phone}`} className="inline-flex items-center gap-1.5 hover:text-[#0A0A0A]">
                  <Phone className="w-3.5 h-3.5" />
                  {client.phone}
                </a>
              )}
              {client.nif && (
                <span className="jur-mono text-[12px] text-[#0A0A0A]">{client.nif}</span>
              )}
            </div>
            {client.address && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-[#6B6B6B]">
                <MapPin className="w-3.5 h-3.5" />
                {client.address}
              </div>
            )}
          </div>
        </div>

        <ClientHeaderActions client={client} />
      </div>

      {/* KPIs */}
      <section className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Expedientes" value={String(allCases.length)}>
          <span className="text-[#10B981] font-medium">{activeCases} activos</span>
        </Kpi>
        <Kpi label="Plazos pendientes" value={String(pendingDeadlines.length)}>
          <span>en próximos 30 días</span>
        </Kpi>
        <Kpi label="Horas dedicadas" value={formatTime(totalMinutes)}>
          <span>{totalEntries} entrada{totalEntries === 1 ? "" : "s"}</span>
        </Kpi>
        <Kpi label="Facturable" value={formatTime(billableMinutes)}>
          <span>{Math.round((billableMinutes / 60) * 120).toLocaleString("es-ES")} € · estimado 120 €/h</span>
        </Kpi>
      </section>

      {/* Two columns */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases */}
        <div className="lg:col-span-2 jur-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-end justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-[#B54534]" />
              <h2 className="jur-serif text-[24px] text-[#0A0A0A]">
                Expedientes <em>de {client.name.split(" ")[0]}</em>
              </h2>
            </div>
            <div className="jur-mono text-[11px] text-[#6B6B6B]">
              {allCases.length} total
            </div>
          </div>
          {allCases.length === 0 ? (
            <div className="p-10 text-center">
              <p className="jur-serif text-[20px] text-[#0A0A0A]">
                Aún no hay expedientes para este cliente.
              </p>
              <Link
                href={`/dashboard/cases/new?clientId=${client.id}`}
                className="inline-flex items-center mt-5 jur-btn-solid"
              >
                Abrir el primer expediente
                <ArrowRight className="w-3.5 h-3.5 arr" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#EFEFEF]">
              {allCases.map((c) => {
                const s = statusInfo[c.status] ?? { label: c.status, tone: "gray" as BadgeTone }
                return (
                  <li key={c.id}>
                    <Link
                      href={`/dashboard/cases/${c.id}`}
                      className="grid grid-cols-12 gap-3 px-6 py-4 jur-row-hover items-center"
                    >
                      <div className="col-span-7 min-w-0">
                        <div className="text-[14px] text-[#0A0A0A] font-medium truncate">
                          {c.title}
                        </div>
                        <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-0.5 truncate">
                          {c.caseNumber ?? "—"}
                          {c.court && <> · {c.court}</>}
                        </div>
                      </div>
                      <div className="col-span-3 text-[12.5px] text-[#6B6B6B] capitalize">
                        {c.jurisdiction ?? "—"}
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <span className={`jur-badge jur-badge-${s.tone}`}>{s.label}</span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Right: deadlines + notes */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="jur-card p-6">
            <div className="flex items-center gap-2 mb-1">
              <CalendarClock className="w-4 h-4 text-[#B54534]" />
              <h3 className="jur-serif text-[22px] text-[#0A0A0A]">
                Plazos <em>pendientes</em>
              </h3>
            </div>
            {pendingDeadlines.length === 0 ? (
              <p className="text-[13px] text-[#6B6B6B] mt-3">
                Sin plazos pendientes para este cliente.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-[#EFEFEF]">
                {pendingDeadlines.map((d) => {
                  const tone = deadlineStatusInfo[d.status] ?? "gray"
                  return (
                    <li key={d.id} className="py-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] text-[#0A0A0A] font-medium truncate">
                            {d.title}
                          </div>
                          <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-1 truncate">
                            {d.caseTitle} ·{" "}
                            {new Date(d.dueDate).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                        <span className={`jur-badge jur-badge-${tone}`}>{d.status}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="jur-card p-6">
            <div className="jur-mono-label">NOTAS INTERNAS</div>
            {client.notes ? (
              <p className="mt-3 text-[13.5px] text-[#0A0A0A] leading-relaxed whitespace-pre-wrap">
                {client.notes}
              </p>
            ) : (
              <p className="mt-3 text-[13px] text-[#A0A0A0] italic">
                Sin notas. Pulsa Editar para añadirlas.
              </p>
            )}
          </div>

          {associatedContacts.length > 0 && (
            <div className="jur-card p-6">
              <div className="jur-mono-label">CONTACTOS VINCULADOS</div>
              <ul className="mt-3 space-y-2">
                {associatedContacts.map((c) => (
                  <li key={c.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[13px] text-[#0A0A0A] font-medium truncate">{c.name}</div>
                      <div className="jur-mono text-[10.5px] text-[#6B6B6B] capitalize">{c.role}</div>
                    </div>
                    {c.phone && (
                      <a
                        href={`tel:${c.phone}`}
                        className="text-[12.5px] text-[#B54534] hover:underline shrink-0"
                      >
                        {c.phone}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Documents */}
      <section className="mt-10 jur-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-end justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-[#B54534]" />
            <h2 className="jur-serif text-[24px] text-[#0A0A0A]">
              Documentación <em>de los expedientes</em>
            </h2>
          </div>
          <div className="jur-mono text-[11px] text-[#6B6B6B]">
            {allDocs.length} documento{allDocs.length === 1 ? "" : "s"}
          </div>
        </div>
        {allDocs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="jur-serif text-[20px] text-[#0A0A0A]">
              No hay documentos subidos todavía.
            </p>
            <p className="mt-2 text-[13.5px] text-[#6B6B6B]">
              Adjunta documentación desde cada expediente y aparecerá agrupada aquí.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#EFEFEF]">
            {allDocs.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-4 px-6 py-3 jur-row-hover"
              >
                <FileText className="w-4 h-4 text-[#A0A0A0] shrink-0" />
                <div className="flex-1 min-w-0">
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13.5px] text-[#0A0A0A] font-medium hover:underline truncate block"
                  >
                    {d.name}
                  </a>
                  <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-0.5 truncate">
                    {d.caseTitle} ·{" "}
                    {new Date(d.uploadedAt).toLocaleDateString("es-ES")}
                    {d.fileSize && (
                      <> · {(d.fileSize / 1024).toFixed(0)} KB</>
                    )}
                  </div>
                </div>
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
      <section className="mt-10 jur-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-end justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#B54534]" />
            <h2 className="jur-serif text-[24px] text-[#0A0A0A]">
              Tiempo <em>dedicado</em>
            </h2>
          </div>
          <Link href="/dashboard/time" className="jur-btn-ghost">
            Ver todo el registro <ArrowRight className="w-3.5 h-3.5 arr" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 p-7">
          <div>
            <div className="jur-mono-label">TOTAL DEDICADO</div>
            <div className="mt-2 text-[40px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">
              {formatTime(totalMinutes)}
            </div>
            <div className="mt-2 text-[12.5px] text-[#6B6B6B]">
              {totalEntries} entrada{totalEntries === 1 ? "" : "s"} en {allCases.length} expediente
              {allCases.length === 1 ? "" : "s"}
            </div>
          </div>
          <div>
            <div className="jur-mono-label">FACTURABLE</div>
            <div className="mt-2 text-[40px] font-semibold tracking-[-0.02em] text-[#B54534] leading-none">
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
