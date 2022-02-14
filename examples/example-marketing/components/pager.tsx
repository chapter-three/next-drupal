import classNames from "classnames"

import { usePagination, usePaginationProps } from "hooks/use-pagination"
import Link from "next/link"

export interface PagerProps extends React.HTMLAttributes<HTMLElement> {
  current: number
  total: number
  href: usePaginationProps["href"]
}

export function Pager({ current, total, href, ...props }: PagerProps) {
  const items = usePagination({
    current,
    total,
    href,
  })

  return (
    <nav role="navigation" aria-labelledby="pagination-heading" {...props}>
      <h4 className="sr-only">Pagination</h4>
      <ul className="flex items-center justify-center w-auto">
        {items.map((link, index) => (
          <li key={index}>
            {link.type === "previous" && (
              <Link href={link.href as string}>
                <a className="flex items-center justify-center w-12 h-12 hover:text-blue-500">
                  <span className="sr-only">Previous page</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </a>
              </Link>
            )}
            {link.type === "page" && (
              <Link href={link.href as string} passHref>
                <a
                  className={classNames(
                    "flex items-center justify-center w-12 h-12 hover:text-blue-500",
                    {
                      "text-gray-500": link.isCurrent,
                    }
                  )}
                >
                  {link.display}
                </a>
              </Link>
            )}
            {link.type === "next" && (
              <Link href={link.href as string}>
                <a className="flex items-center justify-center w-12 h-12 hover:text-blue-500">
                  <span className="sr-only">Next page</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
