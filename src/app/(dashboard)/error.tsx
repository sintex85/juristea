"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[dashboard] render error", error)
  }, [error])

  return (
    <div className="max-w-[820px] w-full mx-auto px-6 lg:px-12 py-16">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-[#6B6B6B] hover:text-[#0A0A0A] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver al inicio
      </Link>

      <div className="jur-mono-label">ERROR</div>
      <h1 className="jur-display text-[40px] sm:text-[48px] text-[#0A0A0A] mt-3">
        Algo se ha <em>roto</em> aquí.
      </h1>
      <p className="mt-3 text-[14.5px] text-[#6B6B6B] max-w-2xl">
        El servidor ha tirado un error al renderizar esta página. El detalle está
        abajo — si te aparece esto en producción, copiámelo y lo arreglamos.
      </p>

      <div className="mt-8 jur-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#F6E9E5]">
          <div className="jur-mono-label">DETALLE</div>
          <p className="mt-1 text-[14px] text-[#8A2F22] font-medium">
            {error.message || "Sin mensaje"}
          </p>
        </div>
        {error.digest && (
          <div className="px-6 py-3 border-b border-[#EFEFEF] jur-mono text-[11px] text-[#6B6B6B]">
            Digest: <span className="text-[#0A0A0A]">{error.digest}</span>
          </div>
        )}
        {error.stack && (
          <pre className="px-6 py-4 jur-mono text-[11px] text-[#6B6B6B] overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {error.stack}
          </pre>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="jur-btn-solid"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reintentar
        </button>
        <Link href="/dashboard" className="jur-btn-ghost">
          Ir al inicio
        </Link>
      </div>
    </div>
  )
}
