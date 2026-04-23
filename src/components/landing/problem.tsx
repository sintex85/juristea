function TimelineBlock({ label, bad, children }: { label: string; bad?: boolean; good?: boolean; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border p-6 ${bad ? "border-red-500/20 bg-red-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}>
      <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${bad ? "text-red-400" : "text-emerald-400"}`}>
        {label}
      </p>
      <div className="space-y-3 text-sm text-white/60">{children}</div>
    </div>
  )
}

function Row({ time, text, primary }: { time: string; text: string; primary?: boolean }) {
  return (
    <div className="flex gap-3">
      <span className="text-white/30 font-mono text-xs shrink-0 pt-0.5">{time}</span>
      <span className={primary ? "text-white font-medium" : ""}>{text}</span>
    </div>
  )
}

export function Problem() {
  return (
    <section className="bg-[#0C0A09] py-20">
      <div className="container">
        <h2 className="text-2xl font-extrabold text-white text-center mb-12">
          ¿Por qué necesitas <span className="text-indigo-400">Juristea</span>?
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <TimelineBlock label="Sin Juristea" bad>
            <Row time="09:00" text="Abres LexNET. Interfaz lenta, se cuelga." />
            <Row time="09:15" text="Anotas el plazo en un Excel. ¿O era en el calendario?" />
            <Row time="Día 18" text="Te das cuenta de que el plazo era de 20 días." />
            <Row time="Día 21" text="Plazo vencido. Responsabilidad profesional." />
          </TimelineBlock>
          <TimelineBlock label="Con Juristea" good>
            <Row time="09:00" text="Subes el ZIP de LexNET. 5 segundos." primary />
            <Row time="09:01" text="Juristea extrae datos y calcula plazos." primary />
            <Row time="Día 17" text="Alerta: 'Plazo en 3 días — Contestación demanda'." primary />
            <Row time="Día 19" text="Escrito presentado a tiempo. Caso controlado." primary />
          </TimelineBlock>
        </div>
      </div>
    </section>
  )
}
