import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { createBillingPortalSession } from "@/lib/stripe/helpers"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  if (!user?.stripeCustomerId) {
    return new Response("No subscription found", { status: 400 })
  }

  const portalSession = await createBillingPortalSession(user.stripeCustomerId)
  return Response.json({ url: portalSession.url })
}
