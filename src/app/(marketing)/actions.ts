"use server"

import { z } from "zod"
import { getTransporter, getFrom, isEmailConfigured } from "@/lib/email/smtp"

const contactSchema = z.object({
  name: z.string().trim().min(2, "Introduce tu nombre").max(100),
  email: z.string().trim().email("Email no válido").max(200),
  phone: z.string().trim().max(40).optional(),
  firm: z.string().trim().max(120).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos algo más (mín. 10 caracteres)")
    .max(4000),
})

export type ContactState = {
  status: "idle" | "ok" | "error"
  error?: string
  fieldErrors?: Partial<Record<keyof z.infer<typeof contactSchema>, string>>
}

const INBOX = "hola@juristea.com"

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    firm: formData.get("firm") || undefined,
    message: formData.get("message"),
  })

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors
    const fieldErrors: ContactState["fieldErrors"] = {}
    for (const [k, v] of Object.entries(flat)) {
      if (v?.[0]) fieldErrors[k as keyof z.infer<typeof contactSchema>] = v[0]
    }
    return { status: "error", error: "Revisa el formulario", fieldErrors }
  }

  if (!isEmailConfigured()) {
    console.warn("[contact] SMTP not configured")
    return { status: "error", error: "Email no configurado en el servidor" }
  }

  const { name, email, phone, firm, message } = parsed.data
  const subject = `Contacto Juristea · ${name}`
  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;color:#0A0A0A;line-height:1.55">
      <h2 style="margin:0 0 12px;font-size:18px">Nuevo mensaje desde la landing</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#6B6B6B">Nombre</td><td style="padding:4px 0">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B6B6B">Email</td><td style="padding:4px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${phone ? `<tr><td style="padding:4px 12px 4px 0;color:#6B6B6B">Teléfono</td><td style="padding:4px 0">${escapeHtml(phone)}</td></tr>` : ""}
        ${firm ? `<tr><td style="padding:4px 12px 4px 0;color:#6B6B6B">Despacho</td><td style="padding:4px 0">${escapeHtml(firm)}</td></tr>` : ""}
      </table>
      <h3 style="margin:18px 0 6px;font-size:14px;color:#6B6B6B">Mensaje</h3>
      <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;margin:0;padding:12px;background:#F9F9F9;border-radius:6px">${escapeHtml(message)}</pre>
    </div>
  `
  const text =
    `Nuevo mensaje desde la landing de Juristea\n\n` +
    `Nombre: ${name}\nEmail: ${email}\n` +
    (phone ? `Teléfono: ${phone}\n` : "") +
    (firm ? `Despacho: ${firm}\n` : "") +
    `\nMensaje:\n${message}\n`

  try {
    await getTransporter()!.sendMail({
      from: getFrom()!,
      to: INBOX,
      replyTo: email,
      subject,
      html,
      text,
    })
    return { status: "ok" }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido"
    console.error("[contact] send failed:", msg)
    return { status: "error", error: "No pudimos enviarlo. Vuelve a intentarlo." }
  }
}
