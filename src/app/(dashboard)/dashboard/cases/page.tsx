import Link from "next/link"
import { Plus, ArrowRight } from "lucide-react"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { cases, clients } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

type BadgeTone = "ok" | "warn" | "gray" | "clay"

const statusLabel: Record<string, { label: string; tone: BadgeTone }> = {
  active: { label: "Activo", tone: "ok" },
  archived: { label: "Archivado", tone: "gray" },
  closed: { label: "Cerrado", tone: "clay" },
}

export default async function CasesPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const allCases = await db
    .select({
      id: cases.id,
      title: cases.title,
      caseNumber: cases.caseNumber,
      court: cases.court,
      jurisdiction: cases.jurisdiction,
      status: cases.status,
      clientName: clients.name,
      updatedAt: cases.updatedAt,
    })
    .from(cases)
    .leftJoin(clients, eq(cases.clientId, clients.id))
    .where(eq(cases.userId, userId))
    .orderBy(desc(cases.updatedAt))

  const active = allCases.filter((c) => c.status === "active").length
  const archived = allCases.filter((c) => c.status === "archived").length
  const closed = allCases.filter((c) => c.status === "closed").length

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="jur-mono-label">EXPEDIENTES</div>
          <h1 className="jur-display text-[48px] sm:text-[56px] text-[#0A0A0A] mt-3">
            Todos los <em>expedientes</em>.
          </h1>
          <p className="mt-3 text-[14.5px] text-[#6B6B6B]">
            {allCases.length} expediente{allCases.length !== 1 ? "s" : ""} ·{" "}
            <span className="text-[#10B981]">{active} activos</span> ·{" "}
            <span>{archived} archivados</span> · <span>{closed} cerrados</span>
          </p>
        </div>
        <Link href="/dashboard/cases/new" className="jur-btn-solid">
          <Plus className="w-3.5 h-3.5" /> Nuevo expediente{" "}
          <ArrowRight className="w-3.5 h-3.5 arr" />
        </Link>
      </div>

      <div className="mt-8 jur-card overflow-hidden">
        {allCases.length === 0 ? (
          <div className="p-14 text-center">
            <p className="jur-serif text-[22px] text-[#0A0A0A]">
              Aún no hay expedientes.
            </p>
            <p className="mt-2 text-[14px] text-[#6B6B6B]">
              Empieza dando de alta el primero.
            </p>
            <Link
              href="/dashboard/cases/new"
              className="inline-flex mt-5 jur-btn-solid"
            >
              <Plus className="w-3.5 h-3.5" /> Crear expediente
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-3 px-6 py-3 jur-mono text-[10px] text-[#6B6B6B] tracking-wider uppercase border-b border-[#E5E5E5]">
              <div className="col-span-4">Expediente</div>
              <div className="col-span-3">Cliente</div>
              <div className="col-span-2 hidden md:block">Juzgado</div>
              <div className="col-span-2 hidden lg:block">Nº</div>
              <div className="col-span-1 text-right">Estado</div>
            </div>
            <ul className="divide-y divide-[#EFEFEF]">
              {allCases.map((c) => {
                const s = statusLabel[c.status] ?? { label: c.status, tone: "gray" as BadgeTone }
                return (
                  <li key={c.id}>
                    <Link
                      href={`/dashboard/cases/${c.id}`}
                      className="grid grid-cols-12 gap-3 px-6 py-4 jur-row-hover items-center"
                    >
                      <div className="col-span-4 min-w-0">
                        <div className="text-[14px] text-[#0A0A0A] font-medium truncate">
                          {c.title}
                        </div>
                        {c.jurisdiction && (
                          <div className="jur-mono text-[10.5px] text-[#A0A0A0] mt-0.5">
                            {c.jurisdiction}
                          </div>
                        )}
                      </div>
                      <div className="col-span-3 text-[13px] text-[#6B6B6B] truncate">
                        {c.clientName ?? "—"}
                      </div>
                      <div className="col-span-2 text-[12.5px] text-[#6B6B6B] hidden md:block truncate">
                        {c.court ?? "—"}
                      </div>
                      <div className="col-span-2 jur-mono text-[11.5px] text-[#0A0A0A] hidden lg:block">
                        {c.caseNumber ?? "—"}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <span className={`jur-badge jur-badge-${s.tone}`}>{s.label}</span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
