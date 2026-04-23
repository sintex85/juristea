import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "¿Cómo garantizáis la confidencialidad de los expedientes?",
    a: "Datos cifrados con AES-256 en tránsito y en reposo. Accesos nominales con registro inmutable. Trabajamos bajo ENS nivel medio y alineados con ISO 27001.",
  },
  {
    q: "¿Puedo migrar mis datos desde Infolex, Sepin o Aranzadi?",
    a: "Sí. La migración asistida está incluida en todos los planes. Trasladamos expedientes, clientes, documentos y plazos por ti.",
  },
  {
    q: "¿Está homologado para trabajar con Lexnet?",
    a: "Utilizamos los canales oficiales de integración con Lexnet. Notificaciones recibidas y archivadas automáticamente, comunicaciones firmadas y trazadas.",
  },
  {
    q: "¿Cumple con la LOPD y el RGPD?",
    a: "Cumplimos íntegramente con LOPDGDD y RGPD. Servidores en la UE, Registro de Actividades de Tratamiento y DPO asignado.",
  },
  {
    q: "¿Puedo dar acceso a clientes y a procuradores?",
    a: "Sí. Cada expediente admite accesos nominativos con permisos granulares para clientes, procuradores o peritos.",
  },
  {
    q: "¿Hay permanencia o contratos largos?",
    a: "Ninguna. Suscripción mensual, cancelable cuando quieras. Tus datos siempre disponibles para descarga íntegra.",
  },
  {
    q: "¿Ofrecéis formación para mi equipo?",
    a: "Formación inicial incluida sin coste. Sesiones adaptadas a tu operativa y refuerzos cuando los necesites.",
  },
]

export function FAQ() {
  return (
    <section id="recursos" className="py-28 lg:py-36 border-t border-[#E5E5E5]">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 reveal">
            <div className="section-num">§ 10 — FAQ</div>
            <h2 className="h2-display text-[46px] sm:text-[64px] text-ink mt-4">
              Dudas que
              <br />
              te <em>estás</em>
              <br />
              haciendo.
            </h2>
            <p className="mt-6 text-[15px] text-[#6B6B6B]">
              ¿Algo más?{" "}
              <a
                href="mailto:hola@juristea.com"
                className="text-ink underline decoration-[#B54534] underline-offset-4 decoration-1"
              >
                Escríbenos →
              </a>
            </p>
          </div>
          <div className="lg:col-span-8 reveal">
            <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {faqs.map((f) => (
                <details key={f.q} className="faq-details group py-5">
                  <summary className="flex items-start justify-between gap-6 cursor-pointer">
                    <span className="serif text-[22px] text-ink tracking-tight">
                      {f.q}
                    </span>
                    <ChevronDown className="chev w-5 h-5 text-[#6B6B6B] shrink-0 mt-1" />
                  </summary>
                  <div className="pt-4 text-[14.5px] text-[#6B6B6B] leading-relaxed">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
