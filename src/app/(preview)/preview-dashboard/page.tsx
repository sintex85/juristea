// Temporary preview — NOT auth-guarded. Delete after UI review.
import { DashboardShell } from "@/components/dashboard/shell"
import { MockHomeContent } from "./mock-content"

export default function PreviewDashboardPage() {
  return (
    <DashboardShell
      user={{
        id: "preview",
        name: "María González",
        email: "maria@preview.test",
        image: null,
        plan: "pro",
        subscriptionStatus: "active",
        stripeCustomerId: null,
        onboardingCompleted: true,
      }}
    >
      <MockHomeContent />
    </DashboardShell>
  )
}
