const faqs = [
  {
    q: "¿Qué tipo de notificaciones puedo subir?",
    a: "Puedes subir los archivos ZIP que descargas de LexNET. Contienen el PDF de la resolución y un XML con los metadatos. Juristea extrae toda la información automáticamente.",
  },
  {
    q: "¿Cómo calcula Juristea los plazos procesales?",
    a: "Según la LEC y la LECrim. Contamos solo días hábiles (excluimos sábados, domingos, festivos y agosto para jurisdicción civil). Te alertamos a 7, 3 y 1 día del vencimiento.",
  },
  {
    q: "¿Es seguro subir documentos judiciales?",
    a: "Sí. Los datos se cifran en tránsito y en reposo. Nuestros servidores están en la UE. Cumplimos con el RGPD y la LOPDGDD. Nunca compartimos tus datos con terceros.",
  },
  {
    q: "¿Se integra directamente con LexNET?",
    a: "Actualmente la integración es por subida manual de ZIPs. Estamos desarrollando la integración directa vía API SOAP oficial del Ministerio de Justicia (proceso de homologación en curso).",
  },
  {
    q: "¿Puedo probarlo gratis?",
    a: "Sí. El plan Abogado Solo es gratuito e incluye 5 expedientes y 20 notificaciones al mes. Sin tarjeta de crédito. Puedes usar Juristea todo el tiempo que necesites.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="bg-[#0C0A09] py-20">
      <div className="container max-w-3xl">
        <h2 className="text-2xl font-extrabold text-white text-center mb-12">Preguntas frecuentes</h2>
        <div className="space-y-6">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border border-white/8 bg-white/[0.02] p-6">
              <h3 className="font-bold text-white text-sm">{f.q}</h3>
              <p className="mt-2 text-sm text-white/40 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
