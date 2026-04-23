import { Bot } from "grammy"

function createBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    console.warn("[Telegram] TELEGRAM_BOT_TOKEN not set, bot disabled")
    return null
  }
  return new Bot(token)
}

export const bot = createBot()

if (bot) {
  bot.command("start", (ctx) =>
    ctx.reply(
      `👋 Welcome to Wotxi!\n\nI'll send you real-time alerts when someone mentions your keywords on Reddit and Hacker News.\n\nYour Chat ID: <code>${ctx.chat.id}</code>\n\nCopy this ID and paste it in your Wotxi dashboard → Alerts → Telegram.`,
      { parse_mode: "HTML" }
    )
  )

  bot.command("chatid", (ctx) =>
    ctx.reply(`Your Chat ID: <code>${ctx.chat.id}</code>`, {
      parse_mode: "HTML",
    })
  )
}

export async function notifyChat(chatId: string | number, message: string) {
  if (!bot) {
    console.warn("[Telegram] Bot not initialized, skipping notification")
    return
  }
  await bot.api.sendMessage(chatId, message, { parse_mode: "HTML" })
}
