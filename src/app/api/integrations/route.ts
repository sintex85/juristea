import { and, eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { accounts, notificationSettings } from "@/lib/db/schema"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  const google = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, session.user.id), eq(accounts.provider, "google")),
  })
  const notifs = await db.query.notificationSettings.findFirst({
    where: eq(notificationSettings.userId, session.user.id),
  })

  return Response.json({
    googleCalendar: {
      connected: Boolean(google?.access_token && google?.scope?.includes("calendar")),
      hasRefreshToken: Boolean(google?.refresh_token),
      scope: google?.scope ?? null,
    },
    whatsapp: {
      configured: Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID),
    },
    telegram: {
      connected: Boolean(notifs?.telegramChatId),
    },
  })
}
