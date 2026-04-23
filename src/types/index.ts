export type Plan = "free" | "pro"
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing"

export interface UserWithSubscription {
  id: string
  name: string | null
  email: string
  image: string | null
  plan: Plan
  subscriptionStatus: SubscriptionStatus | null
  stripeCustomerId: string | null
  onboardingCompleted: boolean
}
