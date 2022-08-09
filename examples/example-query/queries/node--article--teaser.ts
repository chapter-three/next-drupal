import { QueryFormatter, QueryParams } from "next-drupal-query"

import { ArticleTeaser } from "types"
import { DrupalNodeArticle } from "types/drupal"
import { absoluteUrl, formatDate } from "lib/utils"
import { queries } from "queries"

export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude(["field_image"])
    .addFields("node--article", ["title", "path", "created", "field_image"])
}

export const formatter: QueryFormatter<DrupalNodeArticle, ArticleTeaser> = (
  node
) => {
  return {
    type: "article",
    id: node.id,
    title: node.title,
    url: node.path.alias,
    date: formatDate(node.created),
    image: {
      url: absoluteUrl(node.field_image.uri.url),
      alt: node.field_image.resourceIdObjMeta.alt,
    },
  }
}
