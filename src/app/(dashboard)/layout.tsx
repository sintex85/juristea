import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { DashboardShell } from "@/components/dashboard/shell"
import { PoweredByBadge } from "@/components/powered-by-badge"
import type { UserWithSubscription } from "@/types"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  if (!user) redirect("/login")

  if (!user.onboardingCompleted) redirect("/onboarding")

  const userProps: UserWithSubscription = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    plan: user.plan,
    subscriptionStatus: null,
    stripeCustomerId: user.stripeCustomerId,
    onboardingCompleted: user.onboardingCompleted,
  }

  return (
    <DashboardShell user={userProps}>
      {children}
      {user.plan === "free" && (
        <PoweredByBadge
          appName={process.env.NEXT_PUBLIC_APP_NAME!}
          appUrl={process.env.NEXT_PUBLIC_APP_URL!}
        />
      )}
    </DashboardShell>
  )
}
