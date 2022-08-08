import { createQueries } from "@next-drupal/query"

import * as MenuMain from "queries/menu--main"
import * as NodeArticle from "queries/node--article"
import * as NodeArticleTeaser from "queries/node--article--teaser"
import * as NodePage from "queries/node--page"
import * as NodeLandingPage from "queries/node--landing_page"
import * as MediaImage from "queries/media--image"
import * as ParagraphColumns from "queries/paragraph--columns"
import * as ParagraphImage from "queries/paragraph--image"
import * as ParagraphText from "queries/paragraph--text"
import * as ParagraphCard from "queries/paragraph--card"
import * as ListArticlesPublished from "queries/list--articles--published"
import * as ListArticlesRelated from "queries/list--articles--related"

export const queries = createQueries({
  // Menu
  "menu--main": MenuMain,

  // Content
  "node--article": NodeArticle,
  "node--article--teaser": NodeArticleTeaser,
  "node--page": NodePage,
  "node--landing_page": NodeLandingPage,

  // Media.
  "media--image": MediaImage,

  // Paragraphs.
  "paragraph--columns": ParagraphColumns,
  "paragraph--image": ParagraphImage,
  "paragraph--text": ParagraphText,
  "paragraph--card": ParagraphCard,

  // Collections.
  "list--articles--published": ListArticlesPublished,
  "list--articles--related": ListArticlesRelated,
})
