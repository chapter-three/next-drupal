import querystring from "querystring"

const {
  NEXT_PUBLIC_DRUPAL_BASE_URL,
  DRUPAL_CLIENT_ID,
  DRUPAL_CLIENT_SECRET,
} = process.env

const basic = Buffer.from(
  `${DRUPAL_CLIENT_ID}:${DRUPAL_CLIENT_SECRET}`
).toString("base64")

export async function getAccessToken(): Promise<{
  access_token: string
}> {
  const response = await fetch(`${NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "client_credentials",
    }),
  })

  return await response.json()
}
