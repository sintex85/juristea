export function Showcase() {
  return (
    <section className="bg-[#0C0A09] py-20">
      <div className="container">
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 md:p-12">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-indigo-600/10 border border-indigo-500/20 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Expedientes</p>
              <p className="text-3xl font-extrabold text-white mt-2">12</p>
              <p className="text-xs text-white/40 mt-1">3 activos esta semana</p>
            </div>
            <div className="rounded-xl bg-amber-600/10 border border-amber-500/20 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Plazos próximos</p>
              <p className="text-3xl font-extrabold text-white mt-2">4</p>
              <p className="text-xs text-white/40 mt-1">2 vencen esta semana</p>
            </div>
            <div className="rounded-xl bg-emerald-600/10 border border-emerald-500/20 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Notificaciones</p>
              <p className="text-3xl font-extrabold text-white mt-2">8</p>
              <p className="text-xs text-white/40 mt-1">3 sin leer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
