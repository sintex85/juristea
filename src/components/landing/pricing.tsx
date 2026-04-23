import Link from "next/link"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Abogado Solo",
    price: "0",
    description: "Para empezar a organizar tu despacho",
    features: [
      "5 expedientes",
      "20 notificaciones/mes",
      "Cálculo de plazos",
      "Alertas por email",
      "Soporte por email",
    ],
    cta: "Empieza gratis",
    highlight: false,
  },
  {
    name: "Despacho",
    price: "29",
    description: "Para despachos profesionales",
    features: [
      "Expedientes ilimitados",
      "Notificaciones ilimitadas",
      "Resúmenes con IA",
      "Email + Telegram",
      "Control de tiempo",
      "Exportar facturación",
      "Sin branding Juristea",
    ],
    cta: "Empezar prueba",
    highlight: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-[#0C0A09] py-20">
      <div className="container">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 text-center">Precios</p>
        <h2 className="text-2xl font-extrabold text-white text-center mt-3 mb-4">
          Simple y transparente
        </h2>
        <p className="text-center text-sm text-white/40 mb-12">Sin sorpresas. Cancela cuando quieras.</p>

        <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-8 ${
                p.highlight
                  ? "border-indigo-500/40 bg-indigo-500/5 shadow-[0_0_40px_rgba(79,70,229,0.12)]"
                  : "border-white/8 bg-white/[0.02]"
              }`}
            >
              <p className="font-bold text-white text-lg">{p.name}</p>
              <p className="text-sm text-white/40 mt-1">{p.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{p.price}€</span>
                <span className="text-sm text-white/40">/mes</span>
              </div>
              <Link
                href="/login"
                className={`mt-6 flex items-center justify-center h-10 rounded-lg text-sm font-bold transition-colors ${
                  p.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "bg-white/8 text-white hover:bg-white/12"
                }`}
              >
                {p.cta}
              </Link>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
