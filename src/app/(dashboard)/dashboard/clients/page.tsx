import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { clients } from "@/lib/db/schema"
import { eq, desc, sql } from "drizzle-orm"
import Link from "next/link"

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{allClients.length} cliente{allClients.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors"
        >
          + Nuevo cliente
        </Link>
      </div>

      {allClients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-muted-foreground">
          <p className="text-sm">No tienes clientes aún. Añade tu primer cliente.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Nombre</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Email</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">NIF</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Expedientes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allClients.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-4 font-semibold">{c.name}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{c.email || "—"}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden lg:table-cell font-mono text-xs">{c.nif || "—"}</td>
                  <td className="px-5 py-4 text-muted-foreground">{Number(c.caseCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
