import { Stethoscope } from "lucide-react"
import { DiagnosticsRunner } from "./runner"

export default function DiagnosticsPage() {
  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <div>
        <div className="jur-mono-label">DIAGNÓSTICO</div>
        <h1 className="jur-display text-[44px] sm:text-[52px] text-[#0A0A0A] mt-3">
          ¿Qué <em>funciona</em>?
        </h1>
        <p className="mt-3 text-[14.5px] text-[#6B6B6B] max-w-2xl">
          Estado en tiempo real de cada integración y servicio que usa Juristea.
          Donde sea posible, puedes lanzar una prueba real con un clic.
        </p>
      </div>

      <section className="mt-10 jur-card p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-md bg-[#F9F9F9] text-[#0A0A0A] flex items-center justify-center">
            <Stethoscope className="w-4 h-4" />
          </div>
          <h2 className="jur-serif text-[22px] text-[#0A0A0A]">Salud del sistema</h2>
        </div>

        <DiagnosticsRunner />
      </section>

      <section className="mt-6 jur-card p-7">
        <h2 className="jur-serif text-[20px] text-[#0A0A0A]">
          Pruebas que <em>tienes que hacer tú</em>
        </h2>
        <p className="mt-2 text-[13.5px] text-[#6B6B6B] max-w-2xl">
          Algunas cosas requieren clicar por la app — esto es lo que conviene
          comprobar a mano:
        </p>
        <ol className="mt-5 space-y-4 text-[13.5px] text-[#0A0A0A] list-decimal pl-5">
          <li>
            <b>Magic-link.</b> Cierra sesión, ve a <code className="jur-kbd">/login</code>{" "}
            con un email cualquiera y comprueba que llega el correo y entras al dashboard.
          </li>
          <li>
            <b>Google login + Calendar.</b> Tras añadir el scope de calendar en
            Google Cloud Console, vuelve a entrar con Google → te pedirá permiso →
            entra a Diagnóstico → "Probar Google Calendar". Verás un evento de prueba
            crearse y borrarse.
          </li>
          <li>
            <b>Crear cliente / expediente / plazo.</b> Da de alta uno de cada y
            verifica que aparece en su listado y en la home.
          </li>
          <li>
            <b>Subida LexNET.</b> En{" "}
            <code className="jur-kbd">/dashboard/notifications</code>, sube un ZIP
            real exportado de LexNET y comprueba que aparecen las notificaciones y
            los plazos calculados.
          </li>
          <li>
            <b>Stripe checkout.</b> En <code className="jur-kbd">/dashboard/billing</code>,
            pulsa "Pasar a Despacho" → debe redirigir a Stripe. Usa la tarjeta de
            test <code className="jur-kbd">4242 4242 4242 4242</code> con cualquier
            CVC y fecha futura.
          </li>
          <li>
            <b>WhatsApp.</b> Ve a un contacto con número de WhatsApp y pulsa el icono
            verde para enviar un mensaje. Si las env vars están, llega; si no, sale
            error.
          </li>
        </ol>
      </section>
    </div>
  )
}
