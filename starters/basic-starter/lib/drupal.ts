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
