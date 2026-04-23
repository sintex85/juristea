export function StatusQuo() {
  return (
    <section className="py-28 lg:py-36">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-8 reveal">
            <div className="section-num">§ 01 — EL STATU QUO</div>
            <h2 className="h2-display text-[56px] sm:text-[84px] lg:text-[112px] text-ink mt-4">
              El software legal
              <br />
              se quedó en <em>2005</em>.
            </h2>
          </div>
          <div className="lg:col-span-4 reveal">
            <p className="text-[17px] text-[#6B6B6B]">
              Mientras tú usas Notion, Figma y Stripe en tu vida diaria, tu
              despacho sigue atascado en interfaces de hace veinte años. Es hora
              de actualizarse.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-5 reveal">
          <Card
            mockTopLine="winapp · 1998 · 14 menús anidados"
            headline={{ pre: "De interfaces de los 2000,", em: "a diseño 2026" }}
            mock={
              <>
                <div className="h-2.5 w-20 bg-[#E5E5E5] rounded-sm mb-2"></div>
                <div className="h-2.5 w-40 bg-[#E5E5E5] rounded-sm mb-2"></div>
                <div className="h-2.5 w-24 bg-[#E5E5E5] rounded-sm"></div>
              </>
            }
          />
          <Card
            mockTopLine="Manual · 340 páginas"
            mockBottomLine="20 horas de formación obligatoria"
            headline={{ pre: "De 20 horas de formación,", em: "a minuto uno" }}
            mock={
              <>
                <div className="mt-2 h-2.5 w-28 bg-[#E5E5E5] rounded-sm mb-2"></div>
                <div className="h-2.5 w-36 bg-[#E5E5E5] rounded-sm"></div>
              </>
            }
          />
          <Card
            mockTopLine="Contrato · permanencia 36 meses"
            mockBottomLine="cláusula 18.4 · penalización"
            headline={{ pre: "De contratos de 3 años,", em: "a mes a mes" }}
            mock={
              <>
                <div className="mt-2 h-2.5 w-32 bg-[#E5E5E5] rounded-sm mb-2"></div>
                <div className="h-2.5 w-24 bg-[#E5E5E5] rounded-sm"></div>
              </>
            }
          />
        </div>
      </div>
    </section>
  )
}

function Card({
  mockTopLine,
  mockBottomLine,
  headline,
  mock,
}: {
  mockTopLine: string
  mockBottomLine?: string
  headline: { pre: string; em: string }
  mock: React.ReactNode
}) {
  return (
    <div className="landing-card p-7">
      <div className="flex items-center justify-between mb-4 font-mono-j text-[10.5px] text-[#6B6B6B]">
        <span>ANTES · 2005</span>
        <span className="text-[#B54534]">→ AHORA · 2026</span>
      </div>
      <div className="bg-[#F2ECE1]/60 rounded-md p-4 mb-4 border border-[#EADFCC]/60">
        <div className="font-mono-j text-[11px] text-[#6B6B6B]">{mockTopLine}</div>
        {mock}
        {mockBottomLine && (
          <div className="mt-3 font-mono-j text-[11px] text-[#6B6B6B]">
            {mockBottomLine}
          </div>
        )}
      </div>
      <div className="serif text-[24px] text-ink tracking-tight">
        {headline.pre} <em>{headline.em}</em>.
      </div>
    </div>
  )
}
