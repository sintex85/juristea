import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { deadlines, activityLogs } from "@/lib/db/schema"
import { eq, and, lt, lte, gte } from "drizzle-orm"

export const maxDuration = 60

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()

    // Mark expired deadlines
    const expired = await db
      .update(deadlines)
      .set({ status: "expired" })
      .where(and(eq(deadlines.status, "pending"), lt(deadlines.dueDate, now)))
      .returning()

    // TODO: Send alerts for deadlines due within alertDays
    // This will be implemented when notification dispatching is set up

    await db.insert(activityLogs).values({
      action: "cron:deadline_check",
      details: `Marked ${expired.length} deadlines as expired`,
    })

    return NextResponse.json({ ok: true, expired: expired.length })
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error"
    console.error("[Cron] Failed:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
