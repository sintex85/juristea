import { eq } from "drizzle-orm"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import { users, subscriptions } from "@/lib/db/schema"
import type Stripe from "stripe"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response("Invalid signature", { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id!
      const subscriptionId = session.subscription as string

      const sub = await stripe.subscriptions.retrieve(subscriptionId)

      await db.insert(subscriptions).values({
        userId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: sub.items.data[0].price.id,
        status: "active",
        currentPeriodStart: new Date((sub as any).current_period_start * 1000),
        currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
      })

      await db
        .update(users)
        .set({ plan: "pro", updatedAt: new Date() })
        .where(eq(users.id, userId))
      break
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      const status = sub.cancel_at_period_end ? "canceled" : "active"

      await db
        .update(subscriptions)
        .set({
          status,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          currentPeriodStart: new Date((sub as any).current_period_start * 1000),
          currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id))
      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription

      await db
        .update(subscriptions)
        .set({ status: "canceled", updatedAt: new Date() })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id))

      // Find user by stripe customer and downgrade
      const customerId =
        typeof sub.customer === "string" ? sub.customer : sub.customer.id
      await db
        .update(users)
        .set({ plan: "free", updatedAt: new Date() })
        .where(eq(users.stripeCustomerId, customerId))
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = (invoice as any).subscription as string
      if (subscriptionId) {
        await db
          .update(subscriptions)
          .set({ status: "past_due", updatedAt: new Date() })
          .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
      }
      break
    }
  }

  return new Response("OK", { status: 200 })
}
