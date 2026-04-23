import Image from "next/image"

const items = [
  {
    quote:
      "Pasé de perder 40 minutos diarios clasificando Lexnet a literalmente",
    quoteEm: "cero",
    quoteTail: ". Es una diferencia que se nota en la cuenta de resultados.",
    name: "MARÍA GONZÁLEZ",
    role: "SOCIA · GONZÁLEZ & ASOCIADOS · MADRID",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format",
  },
  {
    quote:
      "Por fin un software legal que no parece sacado de un museo. Mi equipo lo adoptó en",
    quoteEm: "dos días",
    quoteTail: ".",
    name: "JAVIER FERNÁNDEZ",
    role: "PENALISTA · BARCELONA",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&auto=format",
  },
  {
    quote: "La tranquilidad con los plazos",
    quoteEm: "no tiene precio",
    quoteTail: ". Juristea te cubre las espaldas.",
    name: "CARMEN ORTEGA",
    role: "LETRADA · VALENCIA",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format",
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
                <figcaption className="mt-7 flex items-center gap-4">
                  <span className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-[#E5E5E5] shrink-0">
                    <Image
                      src={t.photo}
                      alt={t.name}
                      fill
                      sizes="48px"
                      className="object-cover grayscale"
                    />
                  </span>
                  <span className="font-mono-j text-[12px] text-[#6B6B6B] tracking-wide">
                    <span className="text-ink">{t.name}</span>
                    <span className="mx-1">·</span>
                    {t.role}
                  </span>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
