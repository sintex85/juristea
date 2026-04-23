import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0C0A09] pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.15),transparent_70%)]" />
      <div className="container relative">
        <div className="flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 w-fit mb-8">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-indigo-300">Integración con LexNET</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl max-w-3xl leading-[1.08]">
          Gestiona tu despacho.{" "}
          <span className="text-indigo-400">Controla tus plazos.</span>
        </h1>
        <p className="mt-6 text-lg text-white/50 max-w-xl leading-relaxed">
          Juristea centraliza expedientes, notificaciones de LexNET y plazos procesales en una sola plataforma. Para abogados que no quieren perder ni un plazo.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-11 px-7 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-[0_0_30px_rgba(79,70,229,0.4)]"
          >
            Empieza gratis
          </Link>
          <Link
            href="#como-funciona"
            className="inline-flex items-center justify-center h-11 px-7 rounded-lg border border-white/10 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            Ver cómo funciona
          </Link>
        </div>
      </div>
    </section>
  )
}
