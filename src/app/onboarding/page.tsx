"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const TOTAL_STEPS = 3

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function completeOnboarding() {
    setLoading(true)
    await fetch("/api/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-xs text-muted-foreground mb-2">
            Step {step} of {TOTAL_STEPS}
          </p>
          <div className="flex gap-1 mb-4">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <>
              <CardTitle>Welcome!</CardTitle>
              <CardDescription>
                Let&apos;s get you set up in under a minute.
              </CardDescription>
            </>
          )}
          {step === 2 && (
            <>
              <CardTitle>Tell us about you</CardTitle>
              <CardDescription>
                This helps us personalize your experience.
              </CardDescription>
            </>
          )}
          {step === 3 && (
            <>
              <CardTitle>You&apos;re all set!</CardTitle>
              <CardDescription>
                Everything is ready. Let&apos;s go.
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 && (
            <p className="text-sm text-muted-foreground">
              {process.env.NEXT_PUBLIC_APP_NAME} helps you [value prop]. In the
              next steps we&apos;ll configure your workspace.
            </p>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {step === 3 && (
            <p className="text-sm text-muted-foreground">
              Click below to start using {process.env.NEXT_PUBLIC_APP_NAME}.
            </p>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <div className="ml-auto">
              {step < TOTAL_STEPS ? (
                <Button onClick={() => setStep(step + 1)}>Continue</Button>
              ) : (
                <Button onClick={completeOnboarding} disabled={loading}>
                  {loading ? "Setting up..." : "Go to Dashboard"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
