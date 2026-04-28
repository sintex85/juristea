import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth"

/**
 * Incremental OAuth: takes the already-signed-in user through Google's
 * consent screen JUST to add the calendar.events scope to their account.
 *
 * This bypasses NextAuth so the base sign-up flow can keep using only
 * non-sensitive scopes (openid email profile) and remain open to any
 * Google user without verification.
 */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const clientId = process.env.AUTH_GOOGLE_ID
  const baseUrl = process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL
  if (!clientId || !baseUrl) {
    redirect("/dashboard/settings?gcal=misconfigured")
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/google/calendar-callback`,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/calendar.events",
    ].join(" "),
    state: session.user.id,
  })

  redirect(`${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`)
}
