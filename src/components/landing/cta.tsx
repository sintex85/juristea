import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

export function CTA() {
  return (
    <section className="bg-ink text-white relative overflow-hidden">
      <div className="absolute inset-0 noise pointer-events-none"></div>
      <div
        className="absolute -bottom-16 -right-10 serif leading-none text-white/5 select-none pointer-events-none text-[480px]"
        aria-hidden
      >
        J
      </div>
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 py-28 lg:py-40 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-end reveal">
          <div className="lg:col-span-8">
            <div className="font-mono-j text-[11px] text-[#9A9A9A] tracking-widest uppercase">
              — EMPIEZA HOY
            </div>
            <h2 className="display text-[60px] sm:text-[96px] lg:text-[140px] text-white mt-5">
              Dedica tu tiempo
              <br />a <em>defender</em>.
            </h2>
            <p className="mt-7 text-[18px] text-[#9A9A9A] max-w-lg">
              Del resto nos encargamos nosotros. 30 días gratis · migración
              incluida · sin tarjeta.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4 items-start lg:items-end">
            <Link href="/login" className="btn-clay">
              Empezar ahora <ArrowRight className="w-4 h-4 arr" />
            </Link>
            <a
              href="mailto:hola@juristea.com?subject=Demo%20Juristea"
              className="group inline-flex items-center gap-2 text-[14.5px] text-white"
            >
              Agendar demo de 20 min
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <a
              href="tel:+34960730239"
              className="font-mono-j text-[11px] text-[#9A9A9A] mt-2 hover:text-white transition-colors"
            >
              — o llámanos al 960 73 02 39
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
