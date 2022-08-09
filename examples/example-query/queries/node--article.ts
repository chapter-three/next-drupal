import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from "next-drupal-query"

import { Article, ArticleRelated } from "types"
import { DrupalNodeArticle } from "types/drupal"
import { drupal } from "lib/drupal"
import { queries } from "queries"
import { absoluteUrl, formatDate } from "lib/utils"

export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(["field_image", "uid"])
}

type DataOpts = QueryOpts<{
  id: string
}>

type NodeArticleData = {
  node: DrupalNodeArticle
  relatedArticles: ArticleRelated[]
}

export const data: QueryData<DataOpts, NodeArticleData> = async (opts) => {
  return {
    node: await drupal.getResource<DrupalNodeArticle>(
      "node--article",
      opts?.id,
      {
        params: params().getQueryObject(),
      }
    ),
    relatedArticles: await queries.getData("list--articles--related", {
      excludeIds: [opts?.id],
      page: 0,
      limit: 3,
    }),
  }
}

export const formatter: QueryFormatter<NodeArticleData, Article> = ({
  node,
  relatedArticles,
}) => {
  return {
    type: "article",
    id: node.id,
    title: node.title,
    status: node.status,
    author: node.uid.display_name,
    date: formatDate(node.created),
    url: node.path.alias,
    image: {
      url: absoluteUrl(node.field_image.uri.url),
      alt: node.field_image.resourceIdObjMeta.alt,
    },
    body: node.body?.processed,
    relatedArticles,
  }
}
