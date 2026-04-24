"use client"

import { useState } from "react"
import { ArrowUpRight, Check, Download, CreditCard } from "lucide-react"
import { useAuthStore } from "@/stores"

type BadgeTone = "ok" | "warn" | "gray" | "clay"

const PLANS = [
  {
    id: "free",
    label: "Gratis",
    price: 0,
    tagline: "Para probar el sistema.",
    features: ["Hasta 5 expedientes", "Avisos por email", "Sin integraciones"],
  },
  {
    id: "pro",
    label: "Despacho",
    price: 29,
    tagline: "El plan que usan la mayoría.",
    features: [
      "Expedientes ilimitados",
      "LexNET con cálculo automático de plazos",
      "Avisos por WhatsApp + Telegram",
      "Resumen con IA de notificaciones",
      "Soporte prioritario",
    ],
  },
  {
    id: "firma",
    label: "Firma",
    price: 89,
    tagline: "Despachos con varios letrados.",
    features: [
      "Todo lo del plan Despacho",
      "Hasta 5 usuarios incluidos",
      "Multi-despacho",
      "API + webhooks",
      "Onboarding asistido",
    ],
  },
]

export default function BillingPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const plan = useAuthStore((s) => s.plan) ?? "free"

  async function handleUpgrade() {
    setLoadingId("upgrade")
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoadingId(null)
    }
  }

  async function handleManage() {
    setLoadingId("manage")
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoadingId(null)
    }
  }

  const currentPlan = PLANS.find((p) => p.id === plan) ?? PLANS[0]

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <div>
        <div className="jur-mono-label">FACTURACIÓN</div>
        <h1 className="jur-display text-[48px] sm:text-[56px] text-[#0A0A0A] mt-3">
          Tu <em>plan</em> y tus facturas.
        </h1>
        <p className="mt-3 text-[14.5px] text-[#6B6B6B] max-w-2xl">
          Gestiona tu suscripción, revisa el histórico de facturas y cambia de plan cuando quieras.
          Sin permanencia.
        </p>
      </div>

      <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 jur-card p-7">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="jur-mono-label">PLAN ACTUAL</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="jur-serif text-[34px] text-[#0A0A0A]">
                  {currentPlan.label}
                </span>
                <span className="text-[14px] text-[#6B6B6B]">— {currentPlan.tagline}</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-[44px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">
                  {currentPlan.price}
                </span>
                <span className="text-[18px] text-[#0A0A0A] font-medium">€</span>
                <span className="text-[14px] text-[#6B6B6B] ml-1">/mes</span>
              </div>
            </div>
            {plan === "free" ? (
              <button
                onClick={handleUpgrade}
                disabled={loadingId === "upgrade"}
                className="jur-btn-solid"
              >
                <CreditCard className="w-3.5 h-3.5" />
                {loadingId === "upgrade" ? "Redirigiendo…" : "Pasar a Despacho"}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleManage}
                disabled={loadingId === "manage"}
                className="jur-btn-ghost"
              >
                {loadingId === "manage" ? "Abriendo…" : "Gestionar suscripción"}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <ul className="mt-7 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {currentPlan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[13.5px] text-[#0A0A0A]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#E6F5EE] text-[#10B981]">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="jur-card p-6">
          <div className="jur-mono-label">USO ESTE MES</div>
          <div className="mt-5 flex flex-col gap-5">
            <UsageRow label="Expedientes activos" value="12" limit={plan === "free" ? "5" : null} />
            <UsageRow label="Notificaciones LexNET" value="87" limit={null} />
            <UsageRow label="WhatsApp enviados" value="34" limit={plan === "free" ? "0" : null} />
            <UsageRow label="Almacenamiento" value="1,4 GB" limit={plan === "free" ? "500 MB" : "50 GB"} />
          </div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {PLANS.map((p) => {
          const isCurrent = p.id === plan
          const featured = p.id === "pro"
          return (
            <div
              key={p.id}
              className={`jur-card p-7 relative ${
                featured ? "border-2 border-[#B54534]" : ""
              }`}
            >
              {featured && !isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B54534] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  Recomendado
                </span>
              )}
              <div className="flex items-center justify-between">
                <div className="jur-mono-label">{p.label.toUpperCase()}</div>
                {isCurrent && (
                  <span className="jur-badge jur-badge-ok">Tu plan</span>
                )}
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[40px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">
                  {p.price}
                </span>
                <span className="text-[15px] text-[#0A0A0A] font-medium">€</span>
                <span className="text-[12.5px] text-[#6B6B6B] ml-1">/mes</span>
              </div>
              <p className="mt-2 text-[12.5px] text-[#6B6B6B]">{p.tagline}</p>
              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[#0A0A0A]">
                    <Check className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" strokeWidth={3} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {!isCurrent && p.id !== "free" && (
                <button
                  onClick={handleUpgrade}
                  disabled={loadingId !== null}
                  className={`mt-6 w-full rounded-md py-2.5 text-[13px] font-medium transition-colors ${
                    featured
                      ? "bg-[#B54534] text-white hover:bg-[#8A2F22]"
                      : "border border-[#E5E5E5] text-[#0A0A0A] hover:bg-[#F9F9F9]"
                  }`}
                >
                  {loadingId === "upgrade" ? "Redirigiendo…" : `Pasar a ${p.label}`}
                </button>
              )}
            </div>
          )
        })}
      </section>

      <section className="mt-10 jur-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-end justify-between">
          <h2 className="jur-serif text-[24px] text-[#0A0A0A]">Facturas</h2>
          <button
            onClick={handleManage}
            className="jur-btn-ghost"
          >
            Portal de cliente
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-10 text-center">
          <p className="jur-serif text-[20px] text-[#0A0A0A]">
            Las facturas se emiten automáticamente el primer día de cada mes.
          </p>
          <p className="mt-2 text-[13.5px] text-[#6B6B6B]">
            Puedes descargar cualquiera desde el portal de cliente de Stripe.
          </p>
          <button
            onClick={handleManage}
            disabled={loadingId !== null}
            className="mt-5 jur-btn-ghost"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar facturas
          </button>
        </div>
      </section>
    </div>
  )
}

function UsageRow({
  label,
  value,
  limit,
}: {
  label: string
  value: string
  limit: string | null
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[12.5px] text-[#6B6B6B]">{label}</span>
        <span className="text-[13.5px] text-[#0A0A0A] font-medium tabular-nums">
          {value}
          {limit && <span className="text-[#A0A0A0]"> / {limit}</span>}
        </span>
      </div>
    </div>
  )
}
