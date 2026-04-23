import { auth } from "@/lib/auth"
import { createCheckoutSession } from "@/lib/stripe/helpers"
import { PLANS } from "@/lib/stripe/plans"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return new Response("Unauthorized", { status: 401 })
  }

  const checkoutSession = await createCheckoutSession(
    session.user.id,
    session.user.email,
    PLANS.pro.priceId
  )

  return Response.json({ url: checkoutSession.url })
}
