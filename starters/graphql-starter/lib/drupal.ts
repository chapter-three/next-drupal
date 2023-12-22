import { DrupalClient } from "next-drupal"

const baseUrl: string = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || ""
const clientId = process.env.DRUPAL_CLIENT_ID || ""
const clientSecret = process.env.DRUPAL_CLIENT_SECRET || ""
const previewSecret = process.env.DRUPAL_PREVIEW_SECRET

export const drupal = new DrupalClient(baseUrl, {
  auth: {
    clientId,
    clientSecret,
  },
  previewSecret,
})

export const graphqlEndpoint = drupal.buildUrl("/graphql")

type QueryPayload = {
  query: string
  variables?: Record<string, string>
}

type QueryJsonResponse<DataType> = {
  data?: DataType
  errors?: { message: string }[]
}

// This is a wrapper around drupal.fetch.
// Acts as a query helper.
export async function query<DataType>(payload: QueryPayload) {
  const response = await drupal.fetch(graphqlEndpoint.toString(), {
    method: "POST",
    body: JSON.stringify(payload),
    withAuth: true, // Make authenticated requests using OAuth.
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  if (!response?.ok) {
    throw new Error(response.statusText)
  }

  const { data, errors }: QueryJsonResponse<DataType> = await response.json()

  if (errors) {
    console.log(errors)
    throw new Error(errors?.map((e) => e.message).join("\n") ?? "unknown")
  }

  return data
}
