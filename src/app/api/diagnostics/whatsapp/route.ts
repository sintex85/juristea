import { auth } from "@/lib/auth"
import { sendWhatsAppMessage } from "@/lib/whatsapp"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ ok: false, error: "No autorizado" }, { status: 401 })

  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_ID) {
    return Response.json(
      { ok: false, error: "Faltan WHATSAPP_TOKEN o WHATSAPP_PHONE_ID en Vercel" },
      { status: 400 }
    )
  }

  let phone = ""
  try {
    const body = await req.json()
    phone = (body.phone ?? "").toString()
  } catch {
    /* ignore */
  }
  if (!phone) {
    return Response.json(
      { ok: false, error: "Indica el teléfono al que enviar el test (ej. +34 600 000 000)" },
      { status: 400 }
    )
  }

  const result = await sendWhatsAppMessage(
    phone,
    "✅ Juristea — test de WhatsApp\n\nSi lees esto, la integración funciona."
  )

  if (!result.success) {
    return Response.json({ ok: false, error: result.error }, { status: 500 })
  }
  return Response.json({
    ok: true,
    message: `Mensaje enviado a ${phone}`,
    detail: `messageId ${result.messageId}`,
  })
}
