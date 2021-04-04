import { MdxNode } from "next-mdx"

declare global {
  interface Window {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    docsearch: any
  }
}

interface DocNextPrev {
  title: string
  url: string
}

export type Doc = MdxNode<{
  title: string
  excerpt?: string
  next?: DocNextPrev
  prev?: DocNextPrev
}>

export type Guide = MdxNode<{
  title?: string
  date?: string
  excerpt?: string
  author?: string
  image?: string
  caption?: string
  next?: DocNextPrev
  prev?: DocNextPrev
}>
