/**
 * WhatsApp Business API integration
 *
 * Uses the official WhatsApp Cloud API (Meta Business).
 * Requires: WHATSAPP_TOKEN, WHATSAPP_PHONE_ID in env.
 *
 * Alternatively, can use third-party services like:
 * - Twilio WhatsApp API
 * - Vonage/Nexmo
 * - MessageBird
 *
 * For MVP: uses direct WhatsApp Cloud API.
 */

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID
const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0"

export interface WhatsAppMessage {
  to: string // Phone number with country code (e.g., "34612345678")
  message: string
  templateName?: string
  templateParams?: string[]
}

/** Format phone number to WhatsApp format (remove spaces, +, etc.) */
export function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, "")
  // Add Spain country code if not present
  if (cleaned.length === 9 && /^[67]/.test(cleaned)) {
    cleaned = "34" + cleaned
  }
  return cleaned
}

/** Send a text message via WhatsApp Cloud API */
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.warn("[WhatsApp] Token or Phone ID not configured")
    return { success: false, error: "WhatsApp not configured" }
  }

  const phone = formatPhoneNumber(to)

  try {
    const res = await fetch(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: { body: message },
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      console.error("[WhatsApp] API error:", data)
      return {
        success: false,
        error: data.error?.message || "WhatsApp API error",
      }
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    }
  } catch (error) {
    console.error("[WhatsApp] Send failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/** Send event reminder via WhatsApp */
export async function sendEventReminder(
  phone: string,
  eventTitle: string,
  eventDate: Date,
  location?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const dateStr = eventDate.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  let message = `📋 *Recordatorio — Juristea*\n\n`
  message += `*${eventTitle}*\n`
  message += `📅 ${dateStr}\n`
  if (location) message += `📍 ${location}\n`
  message += `\n_Enviado desde Juristea_`

  return sendWhatsAppMessage(phone, message)
}

/** Send deadline alert via WhatsApp */
export async function sendDeadlineAlert(
  phone: string,
  deadlineTitle: string,
  dueDate: Date,
  caseTitle?: string,
  daysRemaining?: number
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const dateStr = dueDate.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  let message = `⚠️ *Alerta de Plazo — Juristea*\n\n`
  message += `*${deadlineTitle}*\n`
  if (caseTitle) message += `📁 ${caseTitle}\n`
  message += `📅 Vence: ${dateStr}\n`
  if (daysRemaining !== undefined) {
    if (daysRemaining <= 0) {
      message += `🔴 *VENCIDO*\n`
    } else if (daysRemaining === 1) {
      message += `🟡 *Vence MAÑANA*\n`
    } else {
      message += `🟡 Quedan ${daysRemaining} días\n`
    }
  }
  message += `\n_Enviado desde Juristea_`

  return sendWhatsAppMessage(phone, message)
}
