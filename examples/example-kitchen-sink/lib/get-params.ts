import { DrupalJsonApiParams } from "drupal-jsonapi-params"

// A helper function to build params for a resource type.
export function getParams(name: string) {
  const params = new DrupalJsonApiParams()

  if (name === "node--landing_page") {
    params
      .addInclude([
        "field_sections.field_media.field_media_image,field_sections.field_media.field_media_video_file",
      ])
      .addFields("node--landing_page", [
        "title",
        "path",
        "status",
        "field_sections",
      ])
      .addFields("paragraph--view", ["field_view"])
      .addFields("paragraph--page_header", ["field_heading", "field_text"])
      .addFields("paragraph--feature", [
        "field_heading",
        "field_text",
        "field_link",
        "field_media",
      ])
      .addFields("file--file", ["uri", "resourceIdObjMeta"])
  }

  if (name === "node--article") {
    params
      .addInclude(["field_image", "uid.user_picture"])
      .addFields("node--article", [
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
      .addFields("media--image", ["field_media_image"])
      .addFields("file--file", ["uri", "resourceIdObjMeta"])
  }

  if (name === "node--recipe") {
    params
      .addInclude([
        "field_images.field_media_image",
        "uid.user_picture",
        "field_categories",
      ])
      .addFields("node--recipe", [
        "title",
        "status",
        "path",
        "field_categories",
        "field_nutrition",
        "field_cook_time",
        "field_prep_time",
        "body",
        "created",
        "uid",
        "metatag",
        "field_images",
      ])
      .addFields("user--user", ["display_name", "user_picture"])
      .addFields("media--image", ["field_media_image"])
      .addFields("file--file", ["uri", "resourceIdObjMeta"])
      .addFields("taxonomy_term--recipe_category", ["name", "path"])
  }

  if (name === "recipes--all") {
    params
      .addInclude([
        "field_images.field_media_image",
        "uid.user_picture",
        "field_categories",
      ])
      .addFields("node--recipe", [
        "title",
        "path",
        "field_categories",
        "field_cook_time",
        "field_images",
        "uid",
      ])
      .addFields("user--user", ["display_name", "user_picture"])
      .addFields("media--image", ["field_media_image"])
      .addFields("file--file", ["uri", "resourceIdObjMeta"])
      .addFields("taxonomy_term--recipe_category", ["name", "path"])
  }

  return params.getQueryObject()
}
