import Link from "next/link"
import { Plus, ArrowRight, Mail, Phone } from "lucide-react"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { clients } from "@/lib/db/schema"
import { eq, desc, sql } from "drizzle-orm"

export default async function ClientsPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const allClients = await db
    .select({
      id: clients.id,
      name: clients.name,
      email: clients.email,
      phone: clients.phone,
      nif: clients.nif,
      caseCount: sql<number>`(select count(*) from cases where cases.client_id = clients.id)`,
    })
    .from(clients)
    .where(eq(clients.userId, userId))
    .orderBy(desc(clients.createdAt))

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="jur-mono-label">CLIENTES</div>
          <h1 className="jur-display text-[48px] sm:text-[56px] text-[#0A0A0A] mt-3">
            Tus <em>clientes</em>.
          </h1>
          <p className="mt-3 text-[14.5px] text-[#6B6B6B]">
            {allClients.length} cliente{allClients.length !== 1 ? "s" : ""} en tu despacho
          </p>
        </div>
        <Link href="/dashboard/clients/new" className="jur-btn-solid">
          <Plus className="w-3.5 h-3.5" /> Nuevo cliente{" "}
          <ArrowRight className="w-3.5 h-3.5 arr" />
        </Link>
      </div>

      <div className="mt-8 jur-card overflow-hidden">
        {allClients.length === 0 ? (
          <div className="p-14 text-center">
            <p className="jur-serif text-[22px] text-[#0A0A0A]">
              Aún no hay clientes.
            </p>
            <p className="mt-2 text-[14px] text-[#6B6B6B]">
              Añade el primer cliente para poder abrir expedientes.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-3 px-6 py-3 jur-mono text-[10px] text-[#6B6B6B] tracking-wider uppercase border-b border-[#E5E5E5]">
              <div className="col-span-5">Nombre</div>
              <div className="col-span-4 hidden md:block">Contacto</div>
              <div className="col-span-2 hidden lg:block">NIF</div>
              <div className="col-span-1 text-right">Exp.</div>
            </div>
            <ul className="divide-y divide-[#EFEFEF]">
              {allClients.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/dashboard/clients/${c.id}`}
                    className="grid grid-cols-12 gap-3 px-6 py-4 jur-row-hover items-center"
                  >
                    <div className="col-span-5 min-w-0">
                      <div className="text-[14px] text-[#0A0A0A] font-medium truncate">
                        {c.name}
                      </div>
                    </div>
                    <div className="col-span-4 hidden md:flex items-center gap-3 text-[12.5px] text-[#6B6B6B] min-w-0">
                      {c.email && (
                        <span className="inline-flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{c.email}</span>
                        </span>
                      )}
                      {c.phone && (
                        <span className="inline-flex items-center gap-1 shrink-0">
                          <Phone className="w-3 h-3" />
                          {c.phone}
                        </span>
                      )}
                      {!c.email && !c.phone && <span className="text-[#A0A0A0]">—</span>}
                    </div>
                    <div className="col-span-2 hidden lg:block jur-mono text-[11.5px] text-[#0A0A0A]">
                      {c.nif ?? "—"}
                    </div>
                    <div className="col-span-1 flex justify-end text-[13px] text-[#0A0A0A] font-medium tabular-nums">
                      {Number(c.caseCount)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
