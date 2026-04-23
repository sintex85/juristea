const stats = [
  { value: "150.000+", label: "Abogados ejercientes en España" },
  { value: "3 días", label: "Para que LexNET te notifique automáticamente" },
  { value: "€80-200", label: "Lo que cobra la competencia al mes" },
  { value: "€0", label: "Empieza con Juristea gratis" },
]

export function Stats() {
  return (
    <section className="border-y border-white/8 bg-[#0C0A09] py-12">
      <div className="container grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl font-extrabold text-white">{s.value}</p>
            <p className="mt-1 text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
