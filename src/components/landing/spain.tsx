import {
  Link2,
  Gavel,
  Receipt,
  MapPin,
  BookOpen,
  UserRound,
} from "lucide-react"

const items = [
  {
    icon: Link2,
    title: "Integración nativa con Lexnet",
    desc: "Conexión oficial, notificaciones automáticas.",
  },
  {
    icon: Gavel,
    title: "Todas las jurisdicciones",
    desc: "Civil, penal, social, contencioso, mercantil.",
  },
  {
    icon: Receipt,
    title: "Compatible con Verifactu",
    desc: "Facturación conforme a la AEAT.",
  },
  {
    icon: MapPin,
    title: "Festivos por partido judicial",
    desc: "Actualizados y aplicados en el cómputo.",
  },
  {
    icon: BookOpen,
    title: "Directrices CGAE",
    desc: "Diseñado con el Consejo General de la Abogacía.",
  },
  {
    icon: UserRound,
    title: "Portal seguro para clientes",
    desc: "Tu cliente sigue su asunto con discreción.",
  },
]

export function Spain() {
  return (
    <section className="py-28 lg:py-36">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10">
        <div className="max-w-3xl reveal">
          <div className="section-num">§ 07 — ESPAÑA</div>
          <h2 className="h2-display text-[56px] sm:text-[84px] text-ink mt-4">
            Hecho <em>específicamente</em>
            <br />
            para abogados en España.
          </h2>
          <p className="mt-5 text-[17px] text-[#6B6B6B] max-w-2xl">
            No es un software genérico traducido. Es una herramienta construida
            entendiendo cada peculiaridad del sistema judicial español.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4 reveal">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bento landing-card p-6">
              <div className="flex items-center gap-2.5 mb-2">
                <Icon className="w-4 h-4 text-[#B54534]" />
                <span className="serif text-[20px] text-ink">{title}</span>
              </div>
              <p className="text-[13.5px] text-[#6B6B6B]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
