import { auth } from "@/lib/auth"
import { getUploadUrl } from "@/lib/r2"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { filename } = await request.json()
  const key = `${session.user.id}/${Date.now()}-${filename}`
  const url = await getUploadUrl(key)

  return Response.json({ url, key })
}
