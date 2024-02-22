import { revalidatePath } from "next/cache"
import type { NextRequest } from "next/server"

async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get("slug")
  const secret = searchParams.get("secret")

  // Validate secret.
  if (secret !== process.env.DRUPAL_REVALIDATE_SECRET) {
    return new Response("Invalid secret.", { status: 401 })
  }

  // Validate slug.
  if (!slug) {
    return new Response("Invalid slug.", { status: 400 })
  }

  try {
    revalidatePath(slug)

    return new Response("Revalidated.")
  } catch (error) {
    return new Response((error as Error).message, { status: 500 })
  }
}

export { handler as GET, handler as POST }
