import { Experiment_DrupalClient } from "next-drupal"

export const drupal = new Experiment_DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
)
