const items = [
  {
    quote:
      "Pasé de perder 40 minutos diarios clasificando Lexnet a literalmente",
    quoteEm: "cero",
    quoteTail: ". Es una diferencia que se nota en la cuenta de resultados.",
    attribution: "MARÍA GONZÁLEZ · SOCIA · GONZÁLEZ & ASOCIADOS · MADRID",
  },
  {
    quote:
      "Por fin un software legal que no parece sacado de un museo. Mi equipo lo adoptó en",
    quoteEm: "dos días",
    quoteTail: ".",
    attribution: "JAVIER FERNÁNDEZ · PENALISTA · BARCELONA",
  },
  {
    quote: "La tranquilidad con los plazos",
    quoteEm: "no tiene precio",
    quoteTail: ". Juristea te cubre las espaldas.",
    attribution: "CARMEN ORTEGA · LETRADA · VALENCIA",
  },
]

export function Testimonials() {
  return (
    <section className="py-28 lg:py-36">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="section-num reveal">§ 09 — CLIENTES</div>
        <div className="mt-10 divide-y divide-[#E5E5E5]">
          {items.map((t, i) => (
            <figure
              key={i}
              className="py-14 reveal grid lg:grid-cols-12 gap-8 items-start"
            >
              <span
                className="lg:col-span-1 text-[120px] text-[#B54534] leading-[0.4] serif"
                aria-hidden
              >
                “
              </span>
              <div className="lg:col-span-11">
                <blockquote className="serif text-[36px] sm:text-[52px] text-ink leading-[1.05] tracking-tight">
                  {t.quote} <span className="serif-u">{t.quoteEm}</span>
                  {t.quoteTail}
                </blockquote>
                <figcaption className="mt-7 font-mono-j text-[12px] text-[#6B6B6B] tracking-wide">
                  {t.attribution}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
