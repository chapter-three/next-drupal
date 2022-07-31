import { QueryParams } from "@next-drupal/query"

import { queries } from "queries"

export type NodeArticleTeaser = {
  id: string
  type: "node--article"
  title: string
  url?: string
  image: {
    url: string
    alt: string
  }
  date: string
}

export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude(["field_image"])
    .addFields("node--article", ["title", "path", "created", "field_image"])
}
