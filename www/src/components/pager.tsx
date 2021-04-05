import Link from "next/link"
import { Icon } from "reflexjs"
import { usePager } from "src/hooks/use-pager"

import { NavLinks } from "types"

interface PagerProps {
  links: NavLinks
}

export function Pager({ links }: PagerProps) {
  const { prev, next } = usePager(links)

  return (
    <div
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      py="10"
    >
      {prev ? (
        <Link href={prev.url} passHref>
          <a variant="button.link">
            <Icon name="chevron-left" size="5" mr="2" />
            {prev.title}
          </a>
        </Link>
      ) : null}
      {next ? (
        <Link href={next.url} passHref>
          <a variant="button.link" ml="auto">
            {next.title} <Icon name="chevron-right" size="5" ml="2" />
          </a>
        </Link>
      ) : null}
    </div>
  )
}
