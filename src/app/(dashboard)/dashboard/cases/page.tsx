import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { cases, clients } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import Link from "next/link"

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
      createdAt: cases.createdAt,
    })
    .from(cases)
    .leftJoin(clients, eq(cases.clientId, clients.id))
    .where(eq(cases.userId, userId))
    .orderBy(desc(cases.updatedAt))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expedientes</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{allCases.length} expediente{allCases.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/cases/new"
          className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors"
        >
          + Nuevo expediente
        </Link>
      </div>

      {allCases.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-muted-foreground">
          <p className="text-sm">No tienes expedientes aún.</p>
          <p className="text-sm mt-1">Crea tu primer expediente para empezar a gestionar tu despacho.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Expediente</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Cliente</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Juzgado</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">N.º</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allCases.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/dashboard/cases/${c.id}`} className="font-semibold text-foreground hover:text-indigo-600 transition-colors">
                      {c.title}
                    </Link>
                    {c.jurisdiction && <span className="ml-2 text-xs text-muted-foreground">{c.jurisdiction}</span>}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{c.clientName}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{c.court || "—"}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden lg:table-cell font-mono text-xs">{c.caseNumber || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      c.status === "active" ? "bg-emerald-50 text-emerald-600" :
                      c.status === "archived" ? "bg-gray-50 text-gray-500" :
                      "bg-red-50 text-red-600"
                    }`}>
                      {c.status === "active" ? "Activo" : c.status === "archived" ? "Archivado" : "Cerrado"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
