import { Mail, Phone, Building2, MessageCircle } from "lucide-react"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { contacts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { ContactActions } from "./contact-actions"

type BadgeTone = "ok" | "warn" | "gray" | "clay"

const roles: Record<string, { label: string; tone: BadgeTone }> = {
  cliente: { label: "Cliente", tone: "gray" },
  contrario: { label: "Contrario", tone: "clay" },
  procurador: { label: "Procurador", tone: "ok" },
  perito: { label: "Perito", tone: "warn" },
  testigo: { label: "Testigo", tone: "warn" },
  notario: { label: "Notario", tone: "gray" },
  mediador: { label: "Mediador", tone: "ok" },
  otro: { label: "Otro", tone: "gray" },
}

export default async function ContactsPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const allContacts = await db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(desc(contacts.updatedAt))

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="jur-mono-label">CONTACTOS</div>
          <h1 className="jur-display text-[48px] sm:text-[56px] text-[#0A0A0A] mt-3">
            Tu <em>agenda profesional</em>.
          </h1>
          <p className="mt-3 text-[14.5px] text-[#6B6B6B]">
            {allContacts.length} contacto{allContacts.length !== 1 ? "s" : ""} · procuradores, peritos,
            notarios, contrarios…
          </p>
        </div>
        <ContactActions mode="add" />
      </div>

      <div className="mt-8 jur-card overflow-hidden">
        {allContacts.length === 0 ? (
          <div className="p-14 text-center">
            <p className="jur-serif text-[22px] text-[#0A0A0A]">Aún no hay contactos.</p>
            <p className="mt-2 text-[14px] text-[#6B6B6B] max-w-md mx-auto">
              Guarda aquí procuradores, peritos, notarios y contrarios. Los tendrás a mano desde
              cualquier expediente.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#EFEFEF]">
            {allContacts.map((c) => {
              const role = roles[c.role] ?? { label: c.role, tone: "gray" as BadgeTone }
              return (
                <li
                  key={c.id}
                  className="flex items-center gap-4 px-6 py-4 jur-row-hover"
                >
                  <span
                    className={`jur-badge jur-badge-${role.tone} shrink-0 min-w-[88px] justify-center`}
                  >
                    {role.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] text-[#0A0A0A] font-medium truncate">
                      {c.name}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 jur-mono text-[11px] text-[#6B6B6B]">
                      {c.company && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {c.company}
                        </span>
                      )}
                      {c.email && (
                        <span className="inline-flex items-center gap-1 truncate max-w-[240px]">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{c.email}</span>
                        </span>
                      )}
                      {c.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {c.phone}
                        </span>
                      )}
                      {c.whatsapp && (
                        <span className="inline-flex items-center gap-1 text-[#10B981]">
                          <MessageCircle className="w-3 h-3" />
                          {c.whatsapp}
                        </span>
                      )}
                    </div>
                  </div>
                  {c.whatsapp && (
                    <ContactActions
                      mode="whatsapp"
                      contactId={c.id}
                      phone={c.whatsapp}
                      name={c.name}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
