import * as React from "react"
import { useRouter } from "next/router"

import { NavLink, NavLinks } from "types"

export function usePager(links: NavLinks): {
  prev?: NavLink
  current: NavLink
  next?: NavLink
} {
  const { asPath } = useRouter()

  const flattenedLinks = React.useMemo(() => flatten(links), [links])
  const activeIndex = React.useMemo(
    () =>
      flattenedLinks.findIndex(
        (link) => link.href.replace(/\/$/, "") === asPath
      ),
    [links, asPath]
  )

  return {
    prev: flattenedLinks[activeIndex - 1],
    current: flattenedLinks[activeIndex],
    next: flattenedLinks[activeIndex + 1],
  }
}

export function flatten(links: NavLinks) {
  return links
    .reduce((flat, link) => {
      return flat.concat(link.items ? flatten(link.items) : link)
    }, [])
    .filter((link) => !link.external)
}
