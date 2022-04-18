import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { DrupalMenuLinkContent } from "next-drupal"
import classNames from "classnames"

import { Logo } from "components/logo"
import { LocaleSwitcher } from "components/locale-switcher"

export interface NavbarProps {
  menu: DrupalMenuLinkContent[]
}

export function Navbar({ menu }: NavbarProps) {
  const router = useRouter()
  return (
    <header className="border-b border-b-gray-200">
      <div className="container relative flex flex-wrap items-center justify-between px-4 py-6 mx-auto lg:py-10 lg:px-8">
        <Link href="/" passHref>
          <a className="flex justify-start w-32">
            <Logo />
          </a>
        </Link>
        <ul className="flex justify-center w-full mt-6 space-x-6 sm:mt-0 sm:w-auto md:space-x-6 lg:space-x-12">
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
        <div className="absolute flex justify-end sm:w-32 right-4 top-4 sm:static">
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  )
}
