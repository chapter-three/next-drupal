import { QueryParams } from "@next-drupal/query"
import { queries } from "lib/queries"

export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude(["field_image", "uid"])
    .addFields("node--article", [
      "title",
      "path",
      "status",
      "uid",
      "created",
      "field_image",
    ])
}
