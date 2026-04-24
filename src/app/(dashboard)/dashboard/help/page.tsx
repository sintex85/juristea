import Link from "next/link"
import {
  Mail,
  MessageCircle,
  Phone,
  Book,
  Zap,
  ArrowRight,
  HelpCircle,
} from "lucide-react"

const FAQS = [
  {
    q: "¿Cómo subo las notificaciones de LexNET?",
    a: "Descarga el ZIP desde LexNET y súbelo en Notificaciones → Subir ZIP. Extraemos los PDF, asociamos expediente y calculamos plazos automáticamente. Lo normal son 30 segundos por ZIP.",
  },
  {
    q: "¿Cómo se calculan los plazos procesales?",
    a: "Usamos la LEC, LRJS y LJCA junto con el calendario laboral de tu provincia. Si una notificación dice \"20 días hábiles\", contamos desde el día siguiente a la recepción, saltando festivos locales y del CGPJ.",
  },
  {
    q: "¿Puedo vincular Telegram o WhatsApp?",
    a: "Sí. Ve a Ajustes → Notificaciones → Telegram y escanea el QR del bot @JuristeaBot. Para WhatsApp necesitas estar en el plan Despacho o superior.",
  },
  {
    q: "¿Los datos están seguros?",
    a: "Servidores en Frankfurt (UE), backups cifrados diarios, cifrado TLS 1.3 en tránsito y AES-256 en reposo. Cumplimos RGPD; nunca cedemos tus datos a terceros.",
  },
  {
    q: "¿Puedo exportar todo?",
    a: "Sí, cuando quieras. Ajustes → Zona peligrosa → Exportar datos. Recibes un ZIP con expedientes, clientes, notificaciones y facturas en formatos estándar.",
  },
  {
    q: "¿Cómo cancelo la suscripción?",
    a: "Facturación → Gestionar suscripción te lleva al portal de Stripe. Pausas, cambias plan o cancelas con un clic. Sin permanencia.",
  },
]

export default function HelpPage() {
  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <div>
        <div className="jur-mono-label">AYUDA</div>
        <h1 className="jur-display text-[48px] sm:text-[56px] text-[#0A0A0A] mt-3">
          ¿En qué te <em>echamos una mano</em>?
        </h1>
        <p className="mt-3 text-[14.5px] text-[#6B6B6B] max-w-2xl">
          Respuestas a lo más preguntado, documentación técnica y contacto directo con una
          persona. Sin tickets, sin bots.
        </p>
      </div>

      {/* Contact cards */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <ContactCard
          icon={<MessageCircle className="w-5 h-5" />}
          accent="bg-[#10B981]"
          label="WhatsApp"
          value="+34 960 73 02 39"
          meta="Respondemos personas, no bots"
          href="https://wa.me/34960730239"
        />
        <ContactCard
          icon={<Mail className="w-5 h-5" />}
          accent="bg-[#B54534]"
          label="Email"
          value="soporte@juristea.com"
          meta="Te contestamos en horas, no días"
          href="mailto:soporte@juristea.com"
        />
        <ContactCard
          icon={<Phone className="w-5 h-5" />}
          accent="bg-[#0A0A0A]"
          label="Teléfono"
          value="960 73 02 39"
          meta="L-V 9:00–19:00"
          href="tel:+34960730239"
        />
      </section>

      {/* FAQ */}
      <section className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-10">
        <div>
          <div className="jur-mono-label">PREGUNTAS</div>
          <h2 className="jur-serif text-[34px] text-[#0A0A0A] mt-3 leading-tight">
            Lo que más <em>nos preguntan</em>.
          </h2>
          <p className="mt-3 text-[13.5px] text-[#6B6B6B] leading-relaxed">
            ¿Algo que no encuentras aquí? Escríbenos por WhatsApp o email y te contestamos el
            mismo día.
          </p>
        </div>

        <div className="jur-card">
          <ul className="divide-y divide-[#EFEFEF]">
            {FAQS.map((f, i) => (
              <li key={i} className="px-6 py-5">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-4 h-4 text-[#B54534] mt-1 shrink-0" />
                  <div>
                    <div className="text-[15px] text-[#0A0A0A] font-medium">{f.q}</div>
                    <p className="mt-2 text-[13.5px] text-[#6B6B6B] leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Resources */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResourceCard
          icon={<Book className="w-4 h-4" />}
          title="Guía de inicio rápido"
          meta="5 minutos para configurar tu despacho"
          href="#"
        />
        <ResourceCard
          icon={<Zap className="w-4 h-4" />}
          title="Atajos de teclado"
          meta="⌘K buscar · N nuevo expediente · G ir a…"
          href="#"
        />
      </section>
    </div>
  )
}

function ContactCard({
  icon,
  accent,
  label,
  value,
  meta,
  href,
}: {
  icon: React.ReactNode
  accent: string
  label: string
  value: string
  meta: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="jur-card p-6 group transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
    >
      <div
        className={`w-10 h-10 rounded-md ${accent} text-white flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="jur-mono-label mt-4">{label.toUpperCase()}</div>
      <div className="mt-1 text-[17px] font-medium text-[#0A0A0A]">{value}</div>
      <div className="mt-1 text-[12.5px] text-[#6B6B6B]">{meta}</div>
      <div className="mt-5 flex items-center gap-1.5 text-[12.5px] font-medium text-[#B54534]">
        Abrir <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ResourceCard({
  icon,
  title,
  meta,
  href,
}: {
  icon: React.ReactNode
  title: string
  meta: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="jur-card p-5 flex items-center gap-4 group"
    >
      <div className="w-10 h-10 rounded-md bg-[#F9F9F9] text-[#0A0A0A] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] text-[#0A0A0A] font-medium">{title}</div>
        <div className="text-[12.5px] text-[#6B6B6B]">{meta}</div>
      </div>
      <ArrowRight className="w-4 h-4 text-[#A0A0A0] group-hover:text-[#0A0A0A] transition-colors" />
    </Link>
  )
}
