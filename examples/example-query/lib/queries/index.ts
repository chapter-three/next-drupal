import { createQueries } from "@next-drupal/query"

import * as NodeArticle from "lib/queries/node--article"
import * as NodeArticleTeaser from "lib/queries/node--article--teaser"
import * as NodePage from "lib/queries/node--page"
import * as ArticlesPublished from "lib/queries/articles--published"

export const queries = createQueries({
  "node--article": NodeArticle,
  "node--article--teaser": NodeArticleTeaser,
  "node--page": NodePage,
  "articles--published": ArticlesPublished,
})
