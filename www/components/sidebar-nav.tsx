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
    <div className="-ml-2 pb-80">
      {items.map((item, index) => (
        <div key={index} className={classNames("pb-8")}>
          <h4 className="px-2 py-1 mb-1 text-sm font-medium rounded-md">
            {item.title}
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
    <div className="grid grid-flow-row gap-1 text-sm auto-rows-max">
      {items.map((item, index) => (
        <Link key={index} href={item.href} passHref>
          <a
            className={classNames(
              "px-2 py-1 rounded-md hover:text-black",
              asPath === item.href ? "text-black bg-blue-50" : "text-gray-700"
            )}
            onClick={onLinkClick}
            target={item.external && "_blank"}
            rel={item.external ? "noreferrer" : ""}
          >
            {item.title}
          </a>
        </Link>
      ))}
    </div>
  ) : null
}
