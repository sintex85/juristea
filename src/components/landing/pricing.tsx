"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, User, Users, Building, Check } from "lucide-react"

type Plan = {
  icon: typeof User
  label: string
  priceMonthly: number
  priceYearly: number
  blurb: string
  features: string[]
  cta: string
  emphasis?: "outline" | "dark" | "outline"
  badge?: string
}

const PLANS: Plan[] = [
  {
    icon: User,
    label: "LETRADO",
    priceMonthly: 49,
    priceYearly: 490,
    blurb: "Para abogados autónomos.",
    features: [
      "1 abogado",
      "Expedientes ilimitados",
      "Integración Lexnet",
      "Facturación Verifactu",
      "Soporte por email",
    ],
    cta: "Empezar",
    emphasis: "outline",
  },
  {
    icon: Users,
    label: "DESPACHO",
    priceMonthly: 149,
    priceYearly: 1490,
    blurb: "Para despachos de hasta 5 personas.",
    features: [
      "Hasta 5 usuarios",
      "Todo lo de Letrado",
      "Portal del cliente",
      "Control avanzado de plazos",
      "Firma digital integrada",
      "Soporte prioritario",
    ],
    cta: "Empezar",
    emphasis: "dark",
    badge: "MÁS ELEGIDO",
  },
  {
    icon: Building,
    label: "DESPACHO PLUS",
    priceMonthly: 299,
    priceYearly: 2990,
    blurb: "Para despachos consolidados.",
    features: [
      "Hasta 15 usuarios",
      "Todo lo de Despacho",
      "API y webhooks",
      "Multi-sede",
      "Informes personalizados",
      "Soporte telefónico dedicado",
    ],
    cta: "Empezar",
    emphasis: "outline",
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section
      id="precios"
      className="py-28 lg:py-36 border-y border-[#E5E5E5] bg-[#F9F9F9]/50"
    >
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-12 reveal">
          <div className="lg:col-span-8">
            <div className="section-num">§ 08 — PRECIOS</div>
            <h2 className="h2-display text-[56px] sm:text-[84px] text-ink mt-4">
              Precios <em>transparentes</em>.
              <br />
              Sin asteriscos.
            </h2>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="inline-flex items-center gap-3 font-mono-j text-[12px]">
              <span className={annual ? "text-[#6B6B6B]" : "text-ink"}>MENSUAL</span>
              <button
                type="button"
                onClick={() => setAnnual((v) => !v)}
                className="relative w-11 h-6 bg-ink rounded-full"
                aria-label="Cambiar periodo de facturación"
              >
                <span
                  className="pricing-toggle-thumb absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white"
                  style={{ transform: annual ? "translateX(20px)" : "translateX(0)" }}
                ></span>
              </button>
              <span className={annual ? "text-ink" : "text-[#6B6B6B]"}>
                ANUAL <span className="ml-1 text-[#B54534]">– 2 MESES</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 reveal">
          {PLANS.map((p) => (
            <PlanCard key={p.label} plan={p} annual={annual} />
          ))}
        </div>

        <p className="text-center mt-10 font-mono-j text-[12px] text-[#6B6B6B]">
          ¿Despacho más grande?{" "}
          <a
            href="mailto:hola@juristea.com"
            className="text-ink underline decoration-[#B54534] decoration-1 underline-offset-4"
          >
            → Contáctanos
          </a>
        </p>
      </div>
    </section>
  )
}

function PlanCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const Icon = plan.icon
  const price = annual ? plan.priceYearly : plan.priceMonthly
  const suffix = annual ? "€/año" : "€/mes"
  const isDark = plan.emphasis === "dark"

  return (
    <div
      className={
        isDark
          ? "landing-card bg-ink! border-ink! text-white p-8 flex flex-col relative -mt-4"
          : "landing-card p-8 flex flex-col"
      }
      style={isDark ? { background: "#0A0A0A", borderColor: "#0A0A0A" } : undefined}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-6 font-mono-j text-[10px] bg-[#B54534] text-white tracking-wider rounded px-2 py-1">
          {plan.badge}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div
          className="mono-label"
          style={isDark ? { color: "#9A9A9A" } : undefined}
        >
          {plan.label}
        </div>
        <Icon
          className={isDark ? "w-4 h-4 text-[#9A9A9A]" : "w-4 h-4 text-[#6B6B6B]"}
        />
      </div>
      <div className="mt-5 flex items-baseline gap-1.5">
        <span
          className={
            isDark
              ? "serif text-[64px] leading-none tracking-tight"
              : "serif text-[64px] leading-none text-ink tracking-tight"
          }
        >
          {price}
        </span>
        <span className={isDark ? "text-[14px] text-[#9A9A9A]" : "text-[14px] text-[#6B6B6B]"}>
          {suffix}
        </span>
      </div>
      <p className={isDark ? "text-[13px] text-[#9A9A9A] mt-2" : "text-[13px] text-[#6B6B6B] mt-2"}>
        {plan.blurb}
      </p>
      <ul
        className={
          isDark
            ? "mt-7 space-y-3 text-[13.5px] flex-1"
            : "mt-7 space-y-3 text-[13.5px] text-[#1a1a1a] flex-1"
        }
      >
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2.5">
            <Check className="w-4 h-4 text-[#B54534] mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
      {isDark ? (
        <Link href="/login" className="mt-8 w-full btn-clay justify-center">
          {plan.cta} <ArrowRight className="w-4 h-4 arr" />
        </Link>
      ) : (
        <Link
          href="/login"
          className="mt-8 w-full border border-[#E5E5E5] hover:border-ink transition text-ink py-3 rounded-md text-[14px] font-medium text-center"
        >
          {plan.cta}
        </Link>
      )}
    </div>
  )
}
