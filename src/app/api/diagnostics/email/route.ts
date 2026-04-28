import { eq } from "drizzle-orm"
import { createTransport } from "nodemailer"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ ok: false, error: "No autorizado" }, { status: 401 })

  const me = await db.query.users.findFirst({ where: eq(users.id, session.user.id) })
  if (!me?.email) return Response.json({ ok: false, error: "No tienes email" }, { status: 400 })

  const port = Number(process.env.SMTP_PORT || 587)
  try {
    const transport = createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
      },
    })

    await transport.verify()
    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: me.email,
      subject: "Juristea · test SMTP",
      text:
        "Esto es un test de tu configuración SMTP en Juristea.\n\n" +
        "Si lo recibes, la integración de email funciona.\n\n" +
        new Date().toISOString(),
    })

    return Response.json({
      ok: true,
      message: `Enviado a ${me.email}`,
      detail: `messageId ${info.messageId} · ${info.response}`,
    })
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 }
    )
  }
}
