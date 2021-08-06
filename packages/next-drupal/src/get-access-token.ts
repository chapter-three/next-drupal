import { AccessToken } from "./types"

export async function getAccessToken(): Promise<AccessToken> {
  if (!process.env.DRUPAL_CLIENT_ID || !process.env.DRUPAL_CLIENT_SECRET) {
    return null
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

  return await response.json()
}
