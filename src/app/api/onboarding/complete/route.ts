import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { name } = await request.json()

  await db
    .update(users)
    .set({
      onboardingCompleted: true,
      name: name || undefined,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id))

  return Response.json({ ok: true })
}
