import { db } from "@/lib/db"
import { notificationSettings, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Resend } from "resend"
import { sendSlackWebhook } from "./slack"
import { notifyChat } from "@/lib/telegram/bot"

let _resend: Resend
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

interface StockAlert {
  productName: string
  competitor: string | null
  changeType: string
  previousPrice: string | null
  newPrice: string | null
  url: string
  importanceScore: number | null
}

interface AlertResult {
  email: boolean
  slack: boolean
  telegram: boolean
  errors: string[]
}

function changeTypeLabel(type: string): string {
  switch (type) {
    case "out_of_stock": return "Out of Stock"
    case "back_in_stock": return "Back in Stock"
    case "price_drop": return "Price Drop"
    case "price_increase": return "Price Increase"
    default: return type
  }
}

function changeTypeEmoji(type: string): string {
  switch (type) {
    case "out_of_stock": return "🔴"
    case "back_in_stock": return "🟢"
    case "price_drop": return "📉"
    case "price_increase": return "📈"
    default: return "📊"
  }
}

export async function dispatchAlerts(
  userId: string,
  changes: StockAlert[]
): Promise<AlertResult> {
  const result: AlertResult = { email: false, slack: false, telegram: false, errors: [] }

  if (changes.length === 0) return result

  const settings = await db
    .select()
    .from(notificationSettings)
    .where(eq(notificationSettings.userId, userId))
    .then((r) => r[0])

  const user = await db
    .select({ email: users.email, name: users.name, plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .then((r) => r[0])

  if (!user) {
    result.errors.push("User not found")
    return result
  }

  const isPro = user.plan === "pro"
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://stochek.com"

  // Email alert
  if (settings?.emailEnabled !== false && process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    const changeLines = changes
      .slice(0, 10)
      .map(
        (c) =>
          `<li><strong>${changeTypeEmoji(c.changeType)} ${changeTypeLabel(c.changeType)}</strong> — <a href="${c.url}">${c.productName}</a>${c.competitor ? ` (${c.competitor})` : ""}${c.previousPrice && c.newPrice ? ` — $${c.previousPrice} → $${c.newPrice}` : ""}${c.importanceScore ? ` (${c.importanceScore}% important)` : ""}</li>`
      )
      .join("")

    try {
      await getResend().emails.send({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `Stochek: ${changes.length} stock change${changes.length > 1 ? "s" : ""} detected`,
        html: `
          <h2>Stock changes detected</h2>
          <ul>${changeLines}</ul>
          ${changes.length > 10 ? `<p>...and ${changes.length - 10} more. <a href="${appUrl}/dashboard">View all</a></p>` : ""}
          <p><a href="${appUrl}/dashboard">Open Stochek Dashboard</a></p>
        `,
      })
      result.email = true
      console.log(`[Alert] Email sent to ${user.email} (${changes.length} changes)`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      result.errors.push(`Email failed: ${msg}`)
      console.error("[Alert] Email failed:", msg)
    }
  }

  // Slack webhook (pro only)
  if (isPro && settings?.slackWebhookUrl) {
    const text = changes
      .slice(0, 5)
      .map(
        (c) =>
          `${changeTypeEmoji(c.changeType)} *${changeTypeLabel(c.changeType)}* — <${c.url}|${c.productName}>${c.previousPrice && c.newPrice ? ` — $${c.previousPrice} → $${c.newPrice}` : ""}${c.importanceScore ? ` (${c.importanceScore}%)` : ""}`
      )
      .join("\n")

    try {
      await sendSlackWebhook(settings.slackWebhookUrl, {
        text: `📊 *Stochek* — ${changes.length} stock change${changes.length > 1 ? "s" : ""}:\n${text}`,
      })
      result.slack = true
      console.log(`[Alert] Slack sent for user ${userId}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      result.errors.push(`Slack failed: ${msg}`)
      console.error("[Alert] Slack failed:", msg)
    }
  }

  // Telegram (pro only)
  if (isPro && settings?.telegramChatId) {
    const text = changes
      .slice(0, 5)
      .map(
        (c) =>
          `${changeTypeEmoji(c.changeType)} <b>${changeTypeLabel(c.changeType)}</b> — <a href="${c.url}">${c.productName}</a>${c.previousPrice && c.newPrice ? ` — $${c.previousPrice} → $${c.newPrice}` : ""}${c.importanceScore ? ` (${c.importanceScore}%)` : ""}`
      )
      .join("\n\n")

    try {
      await notifyChat(
        settings.telegramChatId,
        `📊 <b>Stochek</b> — ${changes.length} stock change${changes.length > 1 ? "s" : ""}:\n\n${text}`
      )
      result.telegram = true
      console.log(`[Alert] Telegram sent to chat ${settings.telegramChatId}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      result.errors.push(`Telegram failed: ${msg}`)
      console.error("[Alert] Telegram failed:", msg)
    }
  }

  return result
}
