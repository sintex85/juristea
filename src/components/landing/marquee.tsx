import { Check } from "lucide-react"

const cities = [
  { name: "MADRID", em: false },
  { name: "Barcelona", em: true },
  { name: "VALENCIA", em: false },
  { name: "Sevilla", em: true },
  { name: "BILBAO", em: false },
  { name: "Zaragoza", em: true },
  { name: "MÁLAGA", em: false },
  { name: "A Coruña", em: true },
]

const compliance = ["LOPD", "RGPD", "ENS Medio", "Datos en UE"]

export function Marquee() {
  const loop = [...cities, ...cities]
  return (
    <section className="py-10 border-y border-[#E5E5E5] bg-white overflow-hidden">
      <div className="font-mono-j text-[11px] text-[#6B6B6B] text-center mb-6">
        — EN EJERCICIO POR TODA ESPAÑA —
      </div>
      <div
        className="marquee serif text-[34px] text-ink"
        style={{ letterSpacing: "0.08em" }}
      >
        {loop.map((c, i) => (
          <span key={i} className="flex items-center gap-12">
            {c.em ? <em>{c.name}</em> : <span>{c.name}</span>}
            <span className="text-[#B54534]">✦</span>
          </span>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 px-6">
        {compliance.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1.5 border border-[#E5E5E5] bg-white rounded-full px-3 py-1 text-[11.5px] text-[#1a1a1a]"
          >
            <Check className="w-3 h-3 text-[#10B981]" /> {c}
          </span>
        ))}
      </div>
    </section>
  )
}
