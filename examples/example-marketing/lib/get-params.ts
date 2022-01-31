import { DrupalJsonApiParams } from "drupal-jsonapi-params"

export function getParams(resourceType: string) {
  const apiParams = new DrupalJsonApiParams().addFilter(
    "field_site.meta.drupal_internal__target_id",
    process.env.DRUPAL_SITE_ID
  )

  if (resourceType === "node--landing_page") {
    apiParams
      .addInclude([
        "field_sections",
        "field_sections.field_media.field_media_image",
        "field_sections.field_items",
        "field_sections.field_reusable_paragraph.paragraphs.field_items",
      ])
      .addFields("node--landing_page", [
        "title",
        "field_sections",
        "path",
        "status",
      ])
  }

  if (resourceType === "node--article") {
    apiParams.addInclude(["field_image", "uid"])
    apiParams.addFields(resourceType, [
      "title",
      "body",
      "uid",
      "created",
      "field_image",
      "status",
      "metatag",
    ])
  }

  return apiParams.getQueryObject()
}
