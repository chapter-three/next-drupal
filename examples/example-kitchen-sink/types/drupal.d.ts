/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface DrupalView {
  id: string
  display_id: string
  data: Record<string, any>[]
  meta: {
    count?: number
    [key: string]: any
  }
}

export interface DrupalMetatag {
  tag: string
  attributes: {
    content: string
    name: string
  }
}
