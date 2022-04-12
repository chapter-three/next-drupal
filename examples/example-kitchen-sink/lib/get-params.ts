import { DrupalJsonApiParams } from "drupal-jsonapi-params"

type ResourceType = "node--landing_page" | string

// A helper function to build params for a resource type.
export function getParams(resourceType: ResourceType) {
  const params = new DrupalJsonApiParams()

  if (resourceType === "node--landing_page") {
    params
      .addInclude(["field_sections"])
      .addFields("node--landing_page", [
        "title",
        "path",
        "status",
        "field_sections",
      ])
      .addFields("paragraph--view", ["field_view"])
      .addFields("paragraph--page_title", ["field_heading", "field_text"])
  }

  if (resourceType === "node--article") {
    params
      .addInclude(["field_image", "uid.user_picture"])
      .addFields(resourceType, [
        "title",
        "status",
        "path",
        "field_image",
        "body",
        "created",
        "uid",
        "metatag",
      ])
      .addFields("user--user", ["display_name", "user_picture"])
      .addFields("file--file", ["uri", "resourceIdObjMeta"])
  }

  return params.getQueryObject()
}
