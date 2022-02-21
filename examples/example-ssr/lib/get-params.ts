import { DrupalJsonApiParams } from "drupal-jsonapi-params"

export function getParams(resourceType: string) {
  const apiParams = new DrupalJsonApiParams().addFilter(
    "field_site.meta.drupal_internal__target_id",
    process.env.DRUPAL_SITE_ID
  )

  if (resourceType === "node--article") {
    apiParams.addInclude(["field_image", "uid"])
  }

  return apiParams.getQueryObject()
}
