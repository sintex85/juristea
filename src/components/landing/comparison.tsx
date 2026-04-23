import { Check, X, Minus } from "lucide-react"

const products = [
  {
    name: "Juristea",
    highlight: true,
    rows: {
      price: "Desde 0 EUR/mes",
      ui: true,
      ai: true,
      deadlines: true,
      lexnet: "Upload (API en desarrollo)",
      mobile: true,
    },
  },
  {
    name: "Sudespacho",
    rows: {
      price: "Desde 89 EUR/mes",
      ui: false,
      ai: false,
      deadlines: false,
      lexnet: "API SOAP",
      mobile: false,
    },
  },
  {
    name: "Infolex",
    rows: {
      price: "Desde 120 EUR/mes",
      ui: false,
      ai: false,
      deadlines: false,
      lexnet: "API SOAP",
      mobile: false,
    },
  },
]

const labels: Record<string, string> = {
  price: "Precio",
  ui: "Interfaz moderna",
  ai: "Resúmenes con IA",
  deadlines: "Plazos automáticos",
  lexnet: "Integración LexNET",
  mobile: "Responsive / móvil",
}

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm text-white/60">{value}</span>
  return value ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-white/20" />
}

export function Comparison() {
  return (
    <section className="bg-[#0C0A09] py-20">
      <div className="container">
        <h2 className="text-2xl font-extrabold text-white text-center mb-12">
          Juristea vs la competencia
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 pr-6 text-white/40 font-medium" />
                {products.map((p) => (
                  <th key={p.name} className={`py-3 px-4 font-bold ${p.highlight ? "text-indigo-400" : "text-white/60"}`}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(labels).map((key) => (
                <tr key={key} className="border-b border-white/5">
                  <td className="py-3 pr-6 text-white/40">{labels[key]}</td>
                  {products.map((p) => (
                    <td key={p.name} className="py-3 px-4">
                      <Cell value={(p.rows as Record<string, boolean | string>)[key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
