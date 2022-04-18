import config from "config"
import { Experiment_DrupalClient } from "next-drupal"

export const drupal = new Experiment_DrupalClient(config.drupalBaseUrl, {
  frontPage: "/foodieland",
  previewSecret: "secret",
  auth: {
    clientId: process.env.DRUPAL_CLIENT_ID,
    clientSecret: process.env.DRUPAL_CLIENT_SECRET,
  },
})
