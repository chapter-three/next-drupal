import classNames from "classnames"
import Link from "next/link"
import { useRouter } from "next/router"

import { NavLink } from "types"

export interface SidebarNavProps {
  items: NavLink[]
  onLinkClick?: () => void
}

export function SidebarNav({ items, onLinkClick }: SidebarNavProps) {
  return items.length ? (
    <div className="w-full -ml-2 pb-80">
      {items.map((item, index) => (
        <div key={index} className={classNames("pb-8")}>
          <h4 className="px-2 py-1 mb-1 text-sm font-medium rounded-md">
            {item.title}{" "}
            {item.badge && (
              <span className="p-1 text-xs font-normal bg-blue-200 rounded-md">
                {item.badge}
              </span>
            )}
          </h4>
          <SidebarNavItem items={item.items} onLinkClick={onLinkClick} />
        </div>
      ))}
    </div>
  ) : null
}

export function SidebarNavItem({ items, onLinkClick }: SidebarNavProps) {
  const { asPath } = useRouter()

  return items?.length ? (
    <div className="grid grid-flow-row text-sm auto-rows-max">
      {items.map((item, index) => (
        <Link key={index} href={item.href} passHref>
          <a
            className={classNames(
              "px-2 py-2 flex items-center w-full rounded-md hover:underline text-black",
              {
                "bg-blue-50": asPath === item.href,
              }
            )}
            onClick={onLinkClick}
            target={item.external && "_blank"}
            rel={item.external ? "noreferrer" : ""}
          >
            {item.title}{" "}
            {item.external && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            )}
          </a>
        </Link>
      ))}
    </div>
  ) : null
}
