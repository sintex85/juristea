type SlackBlock = Record<string, unknown>

interface SlackMessage {
  text: string
  blocks?: SlackBlock[]
}

export async function sendSlackWebhook(
  webhookUrl: string,
  message: SlackMessage
) {
  if (!webhookUrl.startsWith("https://hooks.slack.com/")) {
    console.error("[Slack] Invalid webhook URL format")
    return
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
      signal: controller.signal,
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      console.error(`[Slack] Webhook failed: ${res.status} — ${body}`)
    }
  } finally {
    clearTimeout(timeout)
  }
}
