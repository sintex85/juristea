"use client"

import { useActionState } from "react"
import { ArrowRight, Mail, Phone, Clock } from "lucide-react"
import {
  sendContactMessage,
  type ContactState,
} from "@/app/(marketing)/actions"

const initialState: ContactState = { status: "idle" }

export function Contact() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState
  )

  return (
    <section
      id="contacto"
      className="py-28 lg:py-36 border-t border-[#E5E5E5] bg-white"
    >
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-14">
          {/* Left column */}
          <div className="lg:col-span-5 reveal">
            <div className="section-num">§ 11 — CONTACTO</div>
            <h2 className="h2-display text-[56px] sm:text-[84px] text-ink mt-4">
              Hablemos.
            </h2>
            <p className="mt-6 text-[17px] text-[#6B6B6B] max-w-md">
              Respondemos en menos de 24 horas laborables. Si prefieres,
              llámanos o escríbenos directamente.
            </p>

            <div className="mt-10 space-y-6">
              <ContactRow
                icon={<Mail className="w-4 h-4" />}
                label="EMAIL"
                value="hola@juristea.com"
                href="mailto:hola@juristea.com"
              />
              <ContactRow
                icon={<Phone className="w-4 h-4" />}
                label="TELÉFONO"
                value="960 73 02 39"
                href="tel:+34960730239"
              />
              <ContactRow
                icon={<Clock className="w-4 h-4" />}
                label="HORARIO"
                value="Lunes a viernes · 9:00 – 19:00 CET"
              />
            </div>
          </div>

          {/* Right column: form */}
          <div className="lg:col-span-7 reveal">
            {state.status === "ok" ? (
              <SuccessPanel />
            ) : (
              <form
                action={formAction}
                className="rounded-[10px] border border-[#E5E5E5] bg-white p-8 lg:p-10"
              >
                <div className="font-mono-j text-[10.5px] text-[#6B6B6B] tracking-wider uppercase mb-6">
                  Formulario de contacto
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label="Nombre"
                    name="name"
                    required
                    placeholder="María González"
                    error={state.fieldErrors?.name}
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    required
                    placeholder="hola@tu-despacho.com"
                    error={state.fieldErrors?.email}
                  />
                  <Field
                    label="Teléfono"
                    name="phone"
                    type="tel"
                    placeholder="+34 600 000 000"
                    optional
                    error={state.fieldErrors?.phone}
                  />
                  <Field
                    label="Despacho"
                    name="firm"
                    placeholder="González & Asociados"
                    optional
                    error={state.fieldErrors?.firm}
                  />
                </div>

                <div className="mt-5">
                  <FieldLabel label="Mensaje" required />
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Cuéntanos qué necesitas. Si tienes un despacho actual, indícanos qué software usáis hoy para que preparemos la migración."
                    className="w-full mt-2 px-4 py-3 border border-[#E5E5E5] rounded-md text-[14px] text-ink placeholder:text-[#9A9A9A] focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors resize-y"
                  />
                  {state.fieldErrors?.message && (
                    <p className="mt-1.5 font-mono-j text-[11px] text-[#B54534]">
                      {state.fieldErrors.message}
                    </p>
                  )}
                </div>

                {state.status === "error" && state.error && !state.fieldErrors && (
                  <p className="mt-5 font-mono-j text-[11.5px] text-[#B54534]">
                    {state.error}
                  </p>
                )}

                <div className="mt-7 flex items-center justify-between gap-4 flex-wrap">
                  <p className="font-mono-j text-[10.5px] text-[#6B6B6B] max-w-sm">
                    Al enviar aceptas nuestra{" "}
                    <a
                      href="/privacy"
                      className="underline decoration-[#B54534] underline-offset-4"
                    >
                      política de privacidad
                    </a>
                    .
                  </p>
                  <button
                    type="submit"
                    disabled={pending}
                    className="btn-clay disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {pending ? "Enviando…" : "Enviar mensaje"}
                    <ArrowRight className="w-4 h-4 arr" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-start gap-4">
      <span className="w-9 h-9 rounded-md bg-ink text-white flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </span>
      <div>
        <div className="font-mono-j text-[10.5px] text-[#6B6B6B] tracking-widest">
          {label}
        </div>
        <div className="serif text-[22px] text-ink tracking-tight mt-0.5">
          {value}
        </div>
      </div>
    </div>
  )
  return href ? (
    <a href={href} className="block group hover:opacity-80 transition-opacity">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  )
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="font-mono-j text-[10.5px] text-[#6B6B6B] tracking-widest uppercase">
      {label}
      {required && <span className="text-[#B54534] ml-1">*</span>}
    </label>
  )
}

function Field({
  label,
  name,
  type = "text",
  required,
  optional,
  placeholder,
  error,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  optional?: boolean
  placeholder?: string
  error?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <FieldLabel label={label} required={required} />
        {optional && (
          <span className="font-mono-j text-[9.5px] text-[#9A9A9A] tracking-widest">
            OPCIONAL
          </span>
        )}
      </div>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full mt-2 px-4 py-3 border border-[#E5E5E5] rounded-md text-[14px] text-ink placeholder:text-[#9A9A9A] focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors"
      />
      {error && (
        <p className="mt-1.5 font-mono-j text-[11px] text-[#B54534]">{error}</p>
      )}
    </div>
  )
}

function SuccessPanel() {
  return (
    <div className="rounded-[10px] border border-[#E5E5E5] bg-[#F9F9F9]/50 p-8 lg:p-10 min-h-[420px] flex flex-col justify-center">
      <div className="font-mono-j text-[10.5px] text-[#10B981] tracking-widest">
        ✓ MENSAJE RECIBIDO
      </div>
      <h3 className="serif text-[40px] sm:text-[52px] text-ink mt-4 tracking-tight">
        Gracias, <em>te contestamos enseguida</em>.
      </h3>
      <p className="mt-5 text-[15.5px] text-[#6B6B6B] max-w-lg">
        Hemos recibido tu mensaje en{" "}
        <span className="text-ink">hola@juristea.com</span>. Te responderemos
        en menos de 24 horas laborables. Si es urgente, llámanos al{" "}
        <a
          href="tel:+34960730239"
          className="text-ink underline decoration-[#B54534] underline-offset-4"
        >
          960 73 02 39
        </a>
        .
      </p>
    </div>
  )
}
