import { getAccessToken } from "../query/get-access-token"
import type { AccessToken } from "../types"

export async function buildHeaders({
  accessToken,
  headers = {
    "Content-Type": "application/json",
  },
}: {
  accessToken?: AccessToken
  headers?: RequestInit["headers"]
} = {}): Promise<RequestInit["headers"]> {
  // This allows an access_token (preferrably long-lived) to be set directly on the env.
  // This reduces the number of OAuth call to the Drupal server.
  // Intentionally marked as unstable for now.
  if (process.env.UNSTABLE_DRUPAL_ACCESS_TOKEN) {
    headers[
      "Authorization"
    ] = `Bearer ${process.env.UNSTABLE_DRUPAL_ACCESS_TOKEN}`

    return headers
  }

  const token = accessToken || (await getAccessToken())
  if (token) {
    headers["Authorization"] = `Bearer ${token.access_token}`
  }

  return headers
}
