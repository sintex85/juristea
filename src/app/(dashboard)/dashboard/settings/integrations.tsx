"use client"

import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { Calendar, MessageCircle, Send, ArrowRight, Check, AlertTriangle } from "lucide-react"

type IntegrationStatus = {
  googleCalendar: { connected: boolean; hasRefreshToken: boolean; scope: string | null }
  whatsapp: { configured: boolean }
  telegram: { connected: boolean }
}

export function IntegrationsCard() {
  const [status, setStatus] = useState<IntegrationStatus | null>(null)

  useEffect(() => {
    fetch("/api/integrations")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null))
  }, [])

  return (
    <section className="mt-6 jur-card p-7">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-md bg-[#F9F9F9] text-[#0A0A0A] flex items-center justify-center">
          <Send className="w-4 h-4" />
        </div>
        <h2 className="jur-serif text-[22px] text-[#0A0A0A]">Integraciones</h2>
      </div>

      <ul className="divide-y divide-[#EFEFEF]">
        {/* Google Calendar */}
        <IntegrationRow
          icon={<Calendar className="w-4 h-4" />}
          title="Google Calendar"
          meta={
            status?.googleCalendar.connected
              ? "Tus eventos se sincronizan al calendario principal"
              : "Conecta tu cuenta para sincronizar la agenda"
          }
          connected={status?.googleCalendar.connected ?? false}
          actionLabel={
            status?.googleCalendar.connected ? "Reconectar" : "Conectar"
          }
          onAction={() =>
            signIn("google", { callbackUrl: "/dashboard/settings" })
          }
        />

        {/* WhatsApp */}
        <IntegrationRow
          icon={<MessageCircle className="w-4 h-4" />}
          title="WhatsApp Cloud"
          meta={
            status?.whatsapp.configured
              ? "Envíos de recordatorios activos vía WhatsApp Business"
              : "Pendiente: añade WHATSAPP_TOKEN y WHATSAPP_PHONE_ID en Vercel"
          }
          connected={status?.whatsapp.configured ?? false}
          warningWhenOff
          actionLabel={status?.whatsapp.configured ? "Probar envío" : "Cómo configurar"}
          actionHref={
            status?.whatsapp.configured
              ? "/dashboard/contacts"
              : "https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
          }
        />

        {/* Telegram */}
        <IntegrationRow
          icon={<Send className="w-4 h-4" />}
          title="Telegram bot"
          meta={
            status?.telegram.connected
              ? "Avisos por Telegram activos"
              : "Sin vincular — abre @JuristeaBot en Telegram para enlazar"
          }
          connected={status?.telegram.connected ?? false}
          actionLabel="Abrir bot"
          actionHref="https://t.me/JuristeaBot"
        />
      </ul>

      <p className="mt-5 pt-5 border-t border-[#EFEFEF] text-[12.5px] text-[#6B6B6B]">
        Si conectas Google Calendar, sincronizamos cada evento que crees, edites o
        elimines en Juristea. La primera vez Google te pedirá permiso para acceder
        a tu calendario.
      </p>
    </section>
  )
}

function IntegrationRow({
  icon,
  title,
  meta,
  connected,
  warningWhenOff,
  actionLabel,
  onAction,
  actionHref,
}: {
  icon: React.ReactNode
  title: string
  meta: string
  connected: boolean
  warningWhenOff?: boolean
  actionLabel: string
  onAction?: () => void
  actionHref?: string
}) {
  const ActionEl = actionHref ? "a" : "button"
  return (
    <li className="py-4 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
          connected ? "bg-[#E6F5EE] text-[#0B6B4F]" : "bg-[#F9F9F9] text-[#6B6B6B]"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-[#0A0A0A] font-medium">{title}</span>
          {connected ? (
            <span className="jur-badge jur-badge-ok inline-flex items-center gap-1">
              <Check className="w-3 h-3" strokeWidth={3} /> Conectado
            </span>
          ) : warningWhenOff ? (
            <span className="jur-badge jur-badge-warn inline-flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Sin configurar
            </span>
          ) : (
            <span className="jur-badge jur-badge-gray">Desactivado</span>
          )}
        </div>
        <div className="text-[12.5px] text-[#6B6B6B] mt-0.5">{meta}</div>
      </div>
      <ActionEl
        href={actionHref}
        onClick={actionHref ? undefined : onAction}
        target={actionHref?.startsWith("http") ? "_blank" : undefined}
        rel={actionHref?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="jur-btn-ghost shrink-0"
      >
        {actionLabel} <ArrowRight className="w-3.5 h-3.5 arr" />
      </ActionEl>
    </li>
  )
}
