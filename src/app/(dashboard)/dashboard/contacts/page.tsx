import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { contacts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { ContactActions } from "./contact-actions"

const roleLabels: Record<string, string> = {
  cliente: "Cliente",
  contrario: "Contrario",
  procurador: "Procurador",
  perito: "Perito",
  testigo: "Testigo",
  notario: "Notario",
  mediador: "Mediador",
  otro: "Otro",
}

const roleColors: Record<string, string> = {
  cliente: "bg-indigo-50 text-indigo-600",
  contrario: "bg-red-50 text-red-600",
  procurador: "bg-emerald-50 text-emerald-600",
  perito: "bg-purple-50 text-purple-600",
  testigo: "bg-amber-50 text-amber-600",
  notario: "bg-blue-50 text-blue-600",
  mediador: "bg-teal-50 text-teal-600",
  otro: "bg-gray-50 text-gray-600",
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contactos</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {allContacts.length} contacto{allContacts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ContactActions mode="add" />
      </div>

      {allContacts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-muted-foreground">
          <p className="text-sm font-medium">No tienes contactos aún</p>
          <p className="text-sm mt-1">
            Añade procuradores, peritos, testigos y otros contactos profesionales.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50 overflow-hidden">
          {allContacts.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground/90 truncate">
                    {c.name}
                  </p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${roleColors[c.role] || roleColors.otro}`}>
                    {roleLabels[c.role] || c.role}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {c.email && `${c.email} · `}
                  {c.phone && `📞 ${c.phone}`}
                  {c.whatsapp && ` · 💬 ${c.whatsapp}`}
                  {c.company && ` · ${c.company}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {c.whatsapp && (
                  <ContactActions mode="whatsapp" contactId={c.id} phone={c.whatsapp} name={c.name} />
                )}
                {c.phone && !c.whatsapp && (
                  <a
                    href={`tel:${c.phone}`}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground"
                    title="Llamar"
                  >
                    📞
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
