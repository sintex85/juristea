import { Upload, CalendarClock, Briefcase, Clock } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Sube notificaciones de LexNET",
    body: "Descarga el ZIP de LexNET y súbelo a Juristea. Extraemos los datos, identificamos el expediente y archivamos el PDF automáticamente.",
  },
  {
    icon: CalendarClock,
    title: "Plazos automáticos",
    body: "Calculamos los plazos procesales según el tipo de resolución (LEC/LECrim). Alertas escalonadas a 7, 3 y 1 día del vencimiento.",
  },
  {
    icon: Briefcase,
    title: "Expedientes organizados",
    body: "Cada caso con su cliente, juzgado, NIG, documentos y timeline completo. Todo conectado y accesible en un clic.",
  },
  {
    icon: Clock,
    title: "Control de tiempo",
    body: "Registra horas por expediente. Distingue tiempo facturable y no facturable. Genera informes para tus clientes.",
  },
]

export function Solution() {
  return (
    <section id="como-funciona" className="bg-[#0C0A09] py-20">
      <div className="container">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 text-center">Cómo funciona</p>
        <h2 className="text-2xl font-extrabold text-white text-center mt-3 mb-12">
          De LexNET a tu despacho en 4 pasos
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-white/8 bg-white/[0.02] p-6 hover:border-indigo-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 text-sm font-bold">
                  {i + 1}
                </span>
                <s.icon className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="font-bold text-white text-sm mb-2">{s.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
