import { fieldColumnTypes } from "./drupal"

export type MenuLink = {
  url: string
  text: string
}

export type Resource = LandingPage | Article | Page

export type Page = {
  type: "page"
  id: string
  title: string
  content: string
}

export type LandingPage = {
  type: "landing-page"
  id: string
  title: string
  sections: Section[]
}

export type Article = {
  id: string
  type: "article"
  status: boolean
  url: string
  title: string
  author: string
  date: string
  image: {
    url: string
    alt: string
  }
  body: string
  relatedArticles: ArticleRelated[]
}

export type ArticleTeaser = Pick<
  Article,
  "type" | "id" | "title" | "image" | "date" | "url"
>

export type ArticleRelated = Pick<Article, "id" | "type" | "title"> & {
  url: string
}

export type Section = SectionColumns | SectionImage | SectionText | SectionCard

export type SectionType = Section["type"]

export type SectionColumns = {
  type: "section--columns"
  id: string
  heading: string
  columns: keyof typeof fieldColumnTypes
  sections: Section[]
}

export type SectionImage = {
  type: "section--image"
  id: string
  image: MediaImage
}

export type SectionText = {
  type: "section--text"
  id: string
  text: string
}

export type SectionCard = {
  type: "section--card"
  id: string
  heading: string
  image: MediaImage
  text: string
}

export type MediaImage = {
  type: "media--image"
  id: string
  url: string
  alt: string
  width?: number
  height?: number
}
