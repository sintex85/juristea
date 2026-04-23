import { webhookCallback } from "grammy"
import { bot } from "@/lib/telegram/bot"

export async function POST(request: Request) {
  if (!bot) {
    return new Response("Telegram bot not configured", { status: 503 })
  }

  const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token")
  if (
    process.env.TELEGRAM_WEBHOOK_SECRET &&
    secret !== process.env.TELEGRAM_WEBHOOK_SECRET
  ) {
    return new Response("Unauthorized", { status: 401 })
  }

  const handleUpdate = webhookCallback(bot, "std/http")
  return handleUpdate(request)
}
