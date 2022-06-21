import Link from "next/link"

import { NavLinks } from "types"
import { usePager } from "hooks/use-pager"

interface PagerProps {
  links: NavLinks
}

export function Pager({ links }: PagerProps) {
  const { prev, next } = usePager(links)

  return (
    <div className="flex items-center justify-between">
      {prev ? (
        <Link href={prev.href} passHref>
          <a className="flex items-center px-4 py-3 leading-none text-gray-600 border rounded-md hover:text-black">
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {prev.title}
          </a>
        </Link>
      ) : null}
      {next ? (
        <Link href={next.href} passHref>
          <a className="flex items-center px-4 py-3 ml-auto leading-none text-gray-600 border rounded-md hover:text-black">
            {next.title}
            <svg
              className="w-4 h-4 ml-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </Link>
      ) : null}
    </div>
  )
}
