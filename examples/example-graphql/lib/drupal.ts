import { DrupalClient } from "next-drupal"

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    auth: {
      clientId: process.env.DRUPAL_CLIENT_ID,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET,
    },
    previewSecret: process.env.DRUPAL_PREVIEW_SECRET,
  }
)

export const graphqlEndpoint = drupal.buildUrl("/graphql")

type QueryPayload = {
  query: string
  variables?: Record<string, string>
}

// This is a wrapper around drupal.fetch.
// Acts as a query helper.
export async function query(payload: QueryPayload) {
  const response = await drupal.fetch(graphqlEndpoint.toString(), {
    method: "POST",
    body: JSON.stringify(payload),
    withAuth: true, // Make authenticated requests using OAuth.
  })

  return await response.json()
}
