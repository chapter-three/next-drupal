import Link from "next/link"
import { DrupalMenuLinkContent } from "next-drupal"

import { Logo } from "components/logo"

export interface NavbarProps {
  menu: DrupalMenuLinkContent[]
}

export function Navbar({ menu }: NavbarProps) {
  return (
    <header className="border-b border-b-gray-200">
      <div className="container flex items-center justify-between px-8 py-10 mx-auto">
        <Link href="/" passHref>
          <a className="flex justify-start w-32">
            <Logo />
          </a>
        </Link>
        <ul className="flex space-x-12">
          {menu.map((item) => (
            <li key={item.id}>
              <Link href={item.url} passHref>
                <a className="text-base font-medium transition-colors hover:text-primary">
                  {item.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex justify-end w-32">En</div>
      </div>
    </header>
  )
}
