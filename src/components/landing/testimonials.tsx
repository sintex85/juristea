const testimonials = [
  {
    name: "Elena Martínez",
    role: "Abogada laboralista, Madrid",
    quote: "Antes perdía media hora al día peleándome con LexNET. Ahora subo el ZIP y Juristea hace el resto. Los plazos se calculan solos y las alertas me dan tranquilidad.",
  },
  {
    name: "Carlos Ruiz",
    role: "Socio fundador, Ruiz & Asociados, Barcelona",
    quote: "La gestión de expedientes por fin tiene sentido. Mis 4 abogados usan Juristea cada día. El control de tiempo nos ha ayudado a facturar un 20% más.",
  },
]

export function Testimonials() {
  return (
    <section className="bg-[#0C0A09] py-20">
      <div className="container">
        <h2 className="text-2xl font-extrabold text-white text-center mb-12">Lo que dicen los abogados</h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl border border-white/8 bg-white/[0.02] p-6">
              <p className="text-sm text-white/50 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
