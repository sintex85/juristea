import Link from "next/link"
import { eq } from "drizzle-orm"
import { ArrowRight, Mail, Bell, Shield, AlertTriangle } from "lucide-react"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, notificationSettings } from "@/lib/db/schema"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) return null
  const user = await db.query.users.findFirst({ where: eq(users.id, session.user.id) })
  if (!user) return null

  const notifs = await db.query.notificationSettings.findFirst({
    where: eq(notificationSettings.userId, session.user.id),
  })

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  const planLabel = user.plan === "pro" ? "Despacho" : "Gratis"

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <div>
        <div className="jur-mono-label">AJUSTES</div>
        <h1 className="jur-display text-[48px] sm:text-[56px] text-[#0A0A0A] mt-3">
          Tu <em>despacho</em>, a tu manera.
        </h1>
        <p className="mt-3 text-[14.5px] text-[#6B6B6B] max-w-2xl">
          Datos de la cuenta, preferencias de notificaciones e integraciones con LexNET,
          Telegram y WhatsApp.
        </p>
      </div>

      {/* ACCOUNT */}
      <section className="mt-10 jur-card p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-md bg-[#F6E9E5] text-[#B54534] flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <h2 className="jur-serif text-[22px] text-[#0A0A0A]">Cuenta</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#0A0A0A] text-white text-[16px] font-medium flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] text-[#0A0A0A] font-medium truncate">
              {user.name ?? "Sin nombre"}
            </div>
            <div className="text-[13px] text-[#6B6B6B] truncate">{user.email}</div>
          </div>
          <span className="jur-badge jur-badge-ok shrink-0">{planLabel}</span>
        </div>

        <dl className="mt-7 grid sm:grid-cols-2 gap-x-8 gap-y-5">
          <FieldRow label="Nombre completo" value={user.name ?? "—"} />
          <FieldRow label="Email" value={user.email} />
          <FieldRow
            label="Verificación"
            value={user.emailVerified ? "Email verificado" : "Pendiente"}
            muted={!user.emailVerified}
          />
          <FieldRow
            label="Alta en Juristea"
            value={new Date(user.createdAt).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
        </dl>

        <div className="mt-6 pt-5 border-t border-[#EFEFEF]">
          <Link href="/onboarding" className="jur-btn-ghost">
            Editar datos del despacho <ArrowRight className="w-3.5 h-3.5 arr" />
          </Link>
        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section className="mt-6 jur-card p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-md bg-[#F9F9F9] text-[#0A0A0A] flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <h2 className="jur-serif text-[22px] text-[#0A0A0A]">Notificaciones</h2>
        </div>

        <ul className="divide-y divide-[#EFEFEF]">
          <NotifRow
            label="Email"
            meta="Plazos críticos y resumen semanal"
            enabled={notifs?.emailEnabled ?? true}
          />
          <NotifRow
            label="Telegram"
            meta={notifs?.telegramChatId ? "Vinculado" : "Sin vincular — abre @JuristeaBot"}
            enabled={!!notifs?.telegramChatId}
          />
          <NotifRow
            label="WhatsApp"
            meta={user.plan === "free" ? "Disponible en el plan Despacho" : "Activo"}
            enabled={user.plan !== "free"}
            gated={user.plan === "free"}
          />
          <NotifRow
            label="Slack"
            meta={notifs?.slackWebhookUrl ? "Webhook configurado" : "Sin configurar"}
            enabled={!!notifs?.slackWebhookUrl}
          />
        </ul>
      </section>

      {/* SECURITY */}
      <section className="mt-6 jur-card p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-md bg-[#F9F9F9] text-[#0A0A0A] flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h2 className="jur-serif text-[22px] text-[#0A0A0A]">Seguridad y datos</h2>
        </div>

        <ul className="divide-y divide-[#EFEFEF]">
          <li className="py-3 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] text-[#0A0A0A] font-medium">Datos en Frankfurt (UE)</div>
              <div className="text-[12px] text-[#6B6B6B]">
                Cumplimiento RGPD · backups cifrados diarios
              </div>
            </div>
            <span className="jur-badge jur-badge-ok shrink-0">RGPD</span>
          </li>
          <li className="py-3 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] text-[#0A0A0A] font-medium">Cifrado en tránsito y reposo</div>
              <div className="text-[12px] text-[#6B6B6B]">TLS 1.3 · AES-256 en la base de datos</div>
            </div>
            <span className="jur-badge jur-badge-ok shrink-0">Activo</span>
          </li>
        </ul>
      </section>

      {/* DANGER */}
      <section className="mt-6 jur-card p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-md bg-[#F6E9E5] text-[#B54534] flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h2 className="jur-serif text-[22px] text-[#0A0A0A]">Zona peligrosa</h2>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] text-[#0A0A0A] font-medium">Exportar todos mis datos</div>
            <div className="text-[12.5px] text-[#6B6B6B]">
              Un ZIP con expedientes, clientes, facturas y notificaciones.
            </div>
          </div>
          <a
            href="mailto:soporte@juristea.com?subject=Exportar%20mis%20datos"
            className="rounded-md border border-[#E5E5E5] px-3 py-2 text-[12.5px] font-medium text-[#0A0A0A] hover:bg-[#F9F9F9] shrink-0"
          >
            Solicitar export
          </a>
        </div>

        <div className="mt-5 pt-5 border-t border-[#EFEFEF] flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] text-[#B54534] font-medium">Cerrar cuenta</div>
            <div className="text-[12.5px] text-[#6B6B6B]">
              Elimina permanentemente tu cuenta y todos los datos asociados.
            </div>
          </div>
          <a
            href="mailto:soporte@juristea.com?subject=Cerrar%20cuenta"
            className="rounded-md px-3 py-2 text-[12.5px] font-medium text-[#B54534] hover:bg-[#F6E9E5] shrink-0"
          >
            Solicitar cierre
          </a>
        </div>
      </section>
    </div>
  )
}

function FieldRow({
  label,
  value,
  muted,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div>
      <dt className="jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider">{label}</dt>
      <dd
        className={`mt-1 text-[14px] ${muted ? "text-[#A0A0A0] italic" : "text-[#0A0A0A]"}`}
      >
        {value}
      </dd>
    </div>
  )
}

function NotifRow({
  label,
  meta,
  enabled,
  gated,
}: {
  label: string
  meta: string
  enabled: boolean
  gated?: boolean
}) {
  return (
    <li className="py-3 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] text-[#0A0A0A] font-medium">{label}</div>
        <div className="text-[12px] text-[#6B6B6B]">{meta}</div>
      </div>
      {gated ? (
        <Link href="/dashboard/billing" className="jur-badge jur-badge-warn shrink-0">
          Actualizar plan
        </Link>
      ) : (
        <span className={`jur-badge ${enabled ? "jur-badge-ok" : "jur-badge-gray"} shrink-0`}>
          {enabled ? "Activo" : "Desactivado"}
        </span>
      )}
    </li>
  )
}
