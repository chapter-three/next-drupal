import querystring from "querystring"

const basic = Buffer.from(
  `${process.env.DRUPAL_CLIENT_ID}:${process.env.DRUPAL_CLIENT_SECRET}`
).toString("base64")

export async function getAccessToken(): Promise<{
  access_token?: string
}> {
  if (!process.env.DRUPAL_CLIENT_ID || !process.env.DRUPAL_CLIENT_SECRET) {
    return {
      access_token: null,
    }
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: querystring.stringify({
        grant_type: "client_credentials",
      }),
    }
  )

  return await response.json()
}
