import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { eq, asc } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { clients } from "@/lib/db/schema"
import { CaseForm } from "../case-form"

export default async function NewCasePage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null
  const { clientId } = await searchParams

  const allClients = await db
    .select({ id: clients.id, name: clients.name })
    .from(clients)
    .where(eq(clients.userId, session.user.id))
    .orderBy(asc(clients.name))

  const initial = clientId
    ? {
        title: "",
        clientId,
        caseNumber: "",
        nig: "",
        court: "",
        jurisdiction: "",
        description: "",
        status: "active" as const,
      }
    : undefined

  return (
    <div className="max-w-[820px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <Link
        href="/dashboard/cases"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-[#6B6B6B] hover:text-[#0A0A0A] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a expedientes
      </Link>

      <div className="jur-mono-label">NUEVO EXPEDIENTE</div>
      <h1 className="jur-display text-[44px] sm:text-[52px] text-[#0A0A0A] mt-3">
        Abre un <em>expediente</em>.
      </h1>
      <p className="mt-3 text-[14.5px] text-[#6B6B6B] max-w-xl">
        Solo el título y el cliente son obligatorios. Lo demás (nº de
        procedimiento, NIG, juzgado, jurisdicción) se puede completar luego
        desde la ficha.
      </p>

      <div className="mt-10 jur-card p-7">
        <CaseForm mode="create" clients={allClients} initial={initial} />
      </div>
    </div>
  )
}
