import config from "config"
import { Unstable_DrupalClient as DrupalClient } from "next-drupal"

export const drupal = new DrupalClient(config.drupalBaseUrl, {
  frontPage: "/foodieland",
  previewSecret: "secret",
  auth: {
    clientId: process.env.DRUPAL_CLIENT_ID,
    clientSecret: process.env.DRUPAL_CLIENT_SECRET,
  },
})
