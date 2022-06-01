import { JWT } from "next-auth/jwt"
import { AccessToken } from "next-drupal"
import { cache } from "./node-cache"

const JWT_CACHE_KEY = "NEXT_AUTH_JWT_TOKEN"

export async function getJWT(initialJWT: JWT): Promise<JWT> {
  const cachedJWT = cache.get<JWT>(JWT_CACHE_KEY)

  // We have nothing cached, return the initial token.
  if (!cachedJWT) {
    // Warm the cache with the initial token.
    cache.set(JWT_CACHE_KEY, initialJWT, initialJWT.accessToken.expires_in)

    return initialJWT
  }

  // We have a cached token, check the expiry date.
  if (Date.now() < cachedJWT.accessTokenExpires) {
    return cachedJWT
  }

  // The token has expired, fetch a new one.
  const newJWT = await refreshAccessToken(cachedJWT)

  // Persist this to cache.
  cache.set(JWT_CACHE_KEY, newJWT, newJWT.accessToken.expires_in)

  return newJWT
}

export async function clearJWT() {
  cache.del(JWT_CACHE_KEY)
}

// Helper to obtain a new access_token from a refresh token.
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const formData = new URLSearchParams()
    formData.append("grant_type", "refresh_token")
    formData.append("client_id", process.env.DRUPAL_CLIENT_ID)
    formData.append("client_secret", process.env.DRUPAL_CLIENT_SECRET)
    formData.append("refresh_token", token.accessToken.refresh_token)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/token`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    const data: AccessToken = await response.json()

    if (!response.ok) {
      throw data
    }

    return {
      ...token,
      accessToken: data,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
    }
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}
