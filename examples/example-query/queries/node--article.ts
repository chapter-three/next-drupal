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
import { DrupalTranslatedPath } from "next-drupal"

export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(["field_image", "uid"])
}

type DataOpts = QueryOpts<{
  path: DrupalTranslatedPath
  id: string
}>

type NodeArticleData = {
  node: DrupalNodeArticle
  relatedArticles: ArticleRelated[]
}

export const data: QueryData<DataOpts, NodeArticleData> = async (opts) => {
  return {
    node: await drupal.getResourceFromContext<DrupalNodeArticle>(
      opts.path,
      opts.context,
      {
        params: params().getQueryObject(),
      }
    ),
    relatedArticles: await queries.getData("list--articles--related", {
      context: opts.context,
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
