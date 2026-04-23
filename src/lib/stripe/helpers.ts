import { eq } from "drizzle-orm"
import { stripe } from "."
import { db } from "../db"
import { users } from "../db/schema"

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (user?.stripeCustomerId) return user.stripeCustomerId

  const customer = await stripe.customers.create({ email, metadata: { userId } })

  await db
    .update(users)
    .set({ stripeCustomerId: customer.id })
    .where(eq(users.id, userId))

  return customer.id
}

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string
) {
  const customerId = await getOrCreateStripeCustomer(userId, email)

  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    client_reference_id: userId,
  })
}

export async function createBillingPortalSession(stripeCustomerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  })
}
