import * as React from "react"
import { LinkProps } from "next/link"

type PagerItemType = "page" | "previous" | "next"

export interface PagerItem {
  type: PagerItemType
  page: number
  display: string
  href: LinkProps["href"]
  isCurrent?: boolean
}

export interface usePaginationProps {
  total: number
  current: number
  href: (page: PagerItem["page"]) => LinkProps["href"]
  show?: number
}

export const usePagination = ({
  total,
  current,
  href,
  show = 9,
}: usePaginationProps): PagerItem[] => {
  return React.useMemo<PagerItem[]>((): PagerItem[] => {
    const pagerMiddle = Math.ceil(show / 2)
    const pagerCurrent = current + 1
    let pagerFirst = pagerCurrent - pagerMiddle + 1
    let pagerLast = pagerCurrent + show - pagerMiddle

    show = total < show ? total : show

    // Adjust start end end based on position.
    if (pagerLast > total) {
      pagerFirst = pagerFirst + (total - pagerLast)
      pagerLast = total
    }

    if (pagerFirst <= 0) {
      pagerFirst = 1
      pagerLast = pagerLast + (1 - pagerFirst)
    }

    const items: PagerItem[] = []

    if (current !== 0) {
      items.push({
        type: "previous",
        display: "Previous",
        page: current - 1,
        href: href(current - 1),
      })
    }

    items.push(
      ...Array.from(Array(show).keys()).map(
        (pageNumber: number): PagerItem | null => {
          const page = pageNumber + pagerFirst - 1
          return {
            type: "page",
            page,
            display: `${page + 1}`,
            isCurrent: page === current,
            href: href(page),
          }
        }
      )
    )

    if (current !== total - 1) {
      items.push({
        type: "next",
        display: "Next",
        page: current + 1,
        href: href(current + 1),
      })
    }

    return items
  }, [total, current])
}
