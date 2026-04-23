import { render } from "@react-email/render"
import { WelcomeEmail } from "@/emails/welcome"
import { SubscriptionConfirmedEmail } from "@/emails/subscription-confirmed"
import { getTransporter, getFrom } from "./smtp"

const appName = process.env.NEXT_PUBLIC_APP_NAME!
const appUrl = process.env.NEXT_PUBLIC_APP_URL!

async function sendReactEmail(
  to: string,
  subject: string,
  component: React.ReactElement
) {
  const transporter = getTransporter()
  const from = getFrom()
  if (!transporter || !from) {
    console.warn("[email] SMTP not configured; skipping send")
    return null
  }
  const html = await render(component)
  const text = await render(component, { plainText: true })
  return transporter.sendMail({ from, to, subject, html, text })
}

export async function sendWelcomeEmail(to: string, name: string) {
  return sendReactEmail(
    to,
    `Welcome to ${appName}!`,
    WelcomeEmail({ name, appName, appUrl })
  )
}

export async function sendSubscriptionEmail(
  to: string,
  name: string,
  planName: string
) {
  return sendReactEmail(
    to,
    `Your ${planName} plan is active`,
    SubscriptionConfirmedEmail({ name, appName, appUrl, planName })
  )
}
