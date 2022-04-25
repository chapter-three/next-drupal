import { DrupalView } from "next-drupal"

interface Image {
  url: string
  width?: string
  height?: string
  alt?: string
  title?: string
}

export interface Author {
  id: string
  name: string
  picture: Image
}

export interface RecipeCategory {
  id: string
  name: string
  icon?: string
  url: string
}

export interface Recipe {
  id: string
  url: string
  name: string
  date: string
  prepTime?: string
  cookTime?: string
  image: Image
  categories?: RecipeCategory[]
  author?: Author
  body?: string
  nutritions?: Nutrition[]
  nutritionCaption?: string
}

export interface Nutrition {
  title: string
  value: string
}

export interface Post {
  id: string
  url: string
  date: string
  title: string
  body?: string
  author?: Author
  image?: Image
}

export interface PageHeader {
  id: string
  type: "page_header"
  heading: string
  text?: string
}

export interface PageView {
  id: string
  type: "view"
  view: DrupalView
}

export interface PageFeature {
  type: "feature"
  id: string
  heading: string
  text?: string
  image?: Image
  link: {
    title: string
    href: string
  }
}

export interface PageVideo {
  type: "video"
  id: string
  video: string
}

export type PageSection = PageHeader | PageView | PageFeature | PageVideo

export interface LandingPage {
  sections: PageSection[]
}
