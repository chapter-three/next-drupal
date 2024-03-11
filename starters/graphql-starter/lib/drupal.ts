import { NextDrupalGraphQL } from "./next-drupal-graphql"

const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string
const clientId = process.env.DRUPAL_CLIENT_ID as string
const clientSecret = process.env.DRUPAL_CLIENT_SECRET as string

export const drupal = new NextDrupalGraphQL(baseUrl, {
  auth: {
    clientId,
    clientSecret,
  },
  // debug: true,
})
