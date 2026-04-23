import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notificationSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

const updateSchema = z.object({
  emailEnabled: z.boolean().optional(),
  slackWebhookUrl: z.string().url().nullable().optional(),
  telegramChatId: z.string().nullable().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const settings = await db
    .select()
    .from(notificationSettings)
    .where(eq(notificationSettings.userId, session.user.id))
    .then((r) => r[0])

  if (!settings) {
    // Return defaults
    return NextResponse.json({
      emailEnabled: true,
      slackWebhookUrl: null,
      telegramChatId: null,
    })
  }

  return NextResponse.json(settings)
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await db
    .select()
    .from(notificationSettings)
    .where(eq(notificationSettings.userId, session.user.id))
    .then((r) => r[0])

  if (existing) {
    const [updated] = await db
      .update(notificationSettings)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(notificationSettings.userId, session.user.id))
      .returning()
    return NextResponse.json(updated)
  }

  const [created] = await db
    .insert(notificationSettings)
    .values({
      userId: session.user.id,
      ...parsed.data,
    })
    .returning()

  return NextResponse.json(created, { status: 201 })
}
