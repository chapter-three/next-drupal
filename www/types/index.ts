import { MdxNode } from "next-mdx"

declare global {
  interface Window {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    docsearch: any
  }
}

export interface MdxComponents {
  [name: string]: React.ReactNode
}

export type Doc = MdxNode<{
  title: string
  excerpt?: string
}>

export type Guide = MdxNode<{
  title?: string
  date?: string
  excerpt?: string
  author?: string
  image?: string
  caption?: string
}>

export type Tutorial = MdxNode<{
  title: string
  excerpt?: string
  weight?: number
  group?: string
  video?: string
}>

export type Feature = MdxNode<{
  title: string
  excerpt?: string
  weight?: number
}>

export type NavLink = {
  title: string
  external?: boolean
  activePathNames?: string[]
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export type NavLinks = NavLink[]

export interface SiteConfig {
  name: string
  description?: string
  copyright?: string
  links: NavLinks
  social: {
    github?: string
    twitter?: string
  }
}

export interface DocsConfig {
  links: NavLinks
}
