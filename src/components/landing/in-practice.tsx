import Image from "next/image"

const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80&auto=format",
    alt: "Estatua de la Justicia con balanza",
    label: "CONFIDENCIALIDAD",
    caption: "Cada expediente, bajo llave digital.",
  },
  {
    src: "https://images.unsplash.com/photo-1453945619913-79ec89a82c51?w=1200&q=80&auto=format",
    alt: "Biblioteca jurídica con volúmenes antiguos",
    label: "CONTEXTO",
    caption: "Construido con la LEC, la LECrim y la LRJS cerca.",
  },
  {
    src: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&q=80&auto=format",
    alt: "Mano firmando un documento jurídico",
    label: "PRECISIÓN",
    caption: "Un documento firmado, un plazo que arranca.",
  },
]

export function InPractice() {
  return (
    <section className="py-20 lg:py-28 border-t border-[#EFEFEF] bg-[#F9F9F9]/40">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10 reveal">
          <div className="section-num">§ INT — EN LA PRÁCTICA</div>
          <span className="font-mono-j text-[11px] text-[#6B6B6B]">
            Tres detalles de un día cualquiera en el despacho.
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-5 reveal">
          {PHOTOS.map((p) => (
            <figure
              key={p.label}
              className="group relative overflow-hidden rounded-[10px] border border-[#E5E5E5] bg-white"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F2ECE1]">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover grayscale transition-transform duration-[800ms] ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-4 left-4 font-mono-j text-[10.5px] text-white/90 tracking-widest">
                  {p.label}
                </div>
              </div>
              <figcaption className="p-5 serif text-[18px] sm:text-[20px] text-ink tracking-tight">
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
