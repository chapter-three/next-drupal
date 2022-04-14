import Link from "next/link"
import { DrupalMenuLinkContent } from "next-drupal"
import classNames from "classnames"

import { Logo } from "components/logo"
import { useRouter } from "next/router"

export interface NavbarProps {
  menu: DrupalMenuLinkContent[]
}

export function Navbar({ menu }: NavbarProps) {
  const router = useRouter()
  return (
    <header className="border-b border-b-gray-200">
      <div className="container flex items-center justify-between px-4 py-6 mx-auto lg:py-10 lg:px-8">
        <Link href="/" passHref>
          <a className="flex justify-start w-32">
            <Logo />
          </a>
        </Link>
        <ul className="hidden space-x-12 lg:flex">
          {menu.map((item) => {
            const isActive =
              router.asPath === item.url ||
              (item.url !== "/" ? router.asPath.indexOf(item.url) === 0 : false)

            return (
              <li key={item.id}>
                <Link href={item.url} passHref>
                  <a
                    className={classNames(
                      "text-base font-medium transition-colors hover:text-primary",
                      {
                        "text-primary": isActive,
                      }
                    )}
                  >
                    {item.title}
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="flex justify-end w-32">En</div>
      </div>
    </header>
  )
}
