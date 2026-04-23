import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { whatsappMessages, contacts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { sendWhatsAppMessage, formatPhoneNumber } from "@/lib/whatsapp"
import { z } from "zod"

const sendSchema = z.object({
  phone: z.string().min(1),
  message: z.string().min(1).max(4096),
  contactId: z.string().optional(),
  eventId: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const parsed = sendSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const phone = formatPhoneNumber(parsed.data.phone)

  // Save message to DB
  const [msg] = await db
    .insert(whatsappMessages)
    .values({
      userId: session.user.id,
      contactId: parsed.data.contactId || null,
      eventId: parsed.data.eventId || null,
      phone,
      message: parsed.data.message,
      direction: "outgoing",
      status: "pending",
    })
    .returning()

  // Send via WhatsApp API
  const result = await sendWhatsAppMessage(phone, parsed.data.message)

  // Update status
  await db
    .update(whatsappMessages)
    .set({
      status: result.success ? "sent" : "failed",
      sentAt: result.success ? new Date() : null,
    })
    .where(eq(whatsappMessages.id, msg.id))

  // Update last contacted
  if (result.success && parsed.data.contactId) {
    await db
      .update(contacts)
      .set({ lastContactedAt: new Date() })
      .where(eq(contacts.id, parsed.data.contactId))
  }

  if (!result.success) {
    return Response.json({ error: result.error || "Error al enviar" }, { status: 500 })
  }

  return Response.json({ success: true, messageId: result.messageId })
}
