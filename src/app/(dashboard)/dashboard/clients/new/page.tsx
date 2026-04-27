import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ClientForm } from "../client-form"

export default function NewClientPage() {
  return (
    <div className="max-w-[820px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <Link
        href="/dashboard/clients"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-[#6B6B6B] hover:text-[#0A0A0A] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a clientes
      </Link>

      <div className="jur-mono-label">NUEVO CLIENTE</div>
      <h1 className="jur-display text-[44px] sm:text-[52px] text-[#0A0A0A] mt-3">
        Da de alta un <em>cliente</em>.
      </h1>
      <p className="mt-3 text-[14.5px] text-[#6B6B6B] max-w-xl">
        Solo el nombre es obligatorio. El resto se puede completar más tarde
        desde la ficha del cliente.
      </p>

      <div className="mt-10 jur-card p-7">
        <ClientForm mode="create" />
      </div>
    </div>
  )
}
