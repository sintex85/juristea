"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/stores"

export default function BillingPage() {
  const [loading, setLoading] = useState(false)
  const plan = useAuthStore((s) => s.plan)

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch("/api/stripe/checkout", { method: "POST" })
    const { url } = await res.json()
    window.location.href = url
  }

  async function handleManage() {
    setLoading(true)
    const res = await fetch("/api/stripe/portal", { method: "POST" })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium capitalize">{plan} Plan</p>

          {plan === "free" ? (
            <Button onClick={handleUpgrade} disabled={loading}>
              {loading ? "Redirecting..." : "Upgrade to Pro — $29/mo"}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleManage} disabled={loading}>
              {loading ? "Redirecting..." : "Manage subscription"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
