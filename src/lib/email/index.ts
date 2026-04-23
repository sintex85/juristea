import { Resend } from "resend"
import { WelcomeEmail } from "@/emails/welcome"
import { SubscriptionConfirmedEmail } from "@/emails/subscription-confirmed"

let _resend: Resend
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const appName = process.env.NEXT_PUBLIC_APP_NAME!
const appUrl = process.env.NEXT_PUBLIC_APP_URL!
const from = process.env.EMAIL_FROM!

export async function sendWelcomeEmail(to: string, name: string) {
  return getResend().emails.send({
    from,
    to,
    subject: `Welcome to ${appName}!`,
    react: WelcomeEmail({ name, appName, appUrl }),
  })
}

export async function sendSubscriptionEmail(
  to: string,
  name: string,
  planName: string
) {
  return getResend().emails.send({
    from,
    to,
    subject: `Your ${planName} plan is active`,
    react: SubscriptionConfirmedEmail({ name, appName, appUrl, planName }),
  })
}
