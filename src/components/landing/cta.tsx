import Link from "next/link"

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#0C0A09] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(79,70,229,0.12),transparent_70%)]" />
      <div className="container relative text-center">
        <h2 className="text-3xl font-extrabold text-white md:text-4xl">
          Empieza a gestionar tu despacho hoy
        </h2>
        <p className="mt-4 text-white/40 max-w-md mx-auto">
          Plan gratuito. Sin tarjeta de crédito. 5 expedientes para empezar.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center justify-center h-12 px-8 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-[0_0_40px_rgba(79,70,229,0.4)]"
        >
          Crear cuenta gratis
        </Link>
      </div>
    </section>
  )
}
