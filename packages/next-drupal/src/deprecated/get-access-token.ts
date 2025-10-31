import { cache } from "./get-cache"
import type { AccessToken } from "../types"

const CACHE_KEY = "NEXT_DRUPAL_ACCESS_TOKEN"

/** @deprecated */
export async function getAccessToken(): Promise<AccessToken> {
  if (!process.env.DRUPAL_CLIENT_ID || !process.env.DRUPAL_CLIENT_SECRET) {
    return null
  }

  const cached = cache.get<AccessToken>(CACHE_KEY)
  if (cached?.access_token) {
    return cached
  }

  const basic = Buffer.from(
    `${process.env.DRUPAL_CLIENT_ID}:${process.env.DRUPAL_CLIENT_SECRET}`
  ).toString("base64")

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials`,
    }
  )

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const result: AccessToken = await response.json()

  cache.set(CACHE_KEY, result, result.expires_in)

  return result
}
