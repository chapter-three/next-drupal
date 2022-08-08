import Link from "next/link"
import { MenuLink } from "types"

export interface MenuMainProps {
  menu: MenuLink[]
}

export function MenuMain({ menu }: MenuMainProps) {
  if (!menu?.length) {
    return null
  }

  return (
    <div className="flex space-x-8">
      {menu.map((item, index) => (
        <Link key={index} href={item.url} passHref>
          <a className="hover:underline">{item.text}</a>
        </Link>
      ))}
    </div>
  )
}
