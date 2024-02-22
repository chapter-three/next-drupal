import * as React from "react"
import Link from "next/link"
import { DrupalMenuLinkContent } from "next-drupal"
import classNames from "classnames"

import siteConfig from "site.config"
import { Logo } from "components/logo"
import { LocaleSwitcher } from "components/locale-switcher"
import { MenuMain } from "components/menu-main"
import { MenuUser } from "components/menu-user"
import { FormSearch } from "components/form--search"

export interface HeaderProps {
  menus: {
    main: DrupalMenuLinkContent[]
  }
}

export function Header({ menus }: HeaderProps) {
  const [showMenu, setShowMenu] = React.useState<Boolean>(false)

  return (
    <header className="bg-white">
      <div className="container">
        <div className="grid items-center justify-between grid-cols-3 py-4 border-b border-gray-lighter md:py-6">
          <div>
            <LocaleSwitcher />
          </div>
          <div className="flex justify-center">
            <FormSearch />
          </div>
          <div className="flex justify-end">
            <MenuUser />
          </div>
        </div>
      </div>
      <div className="container relative flex-wrap items-center justify-between py-6 md:flex lg:py-10">
        <Link href="/" passHref>
          <a className="flex justify-start">
            <Logo className="w-48 h-12 text-primary lg:h-16 lg:w-52" />
            <span className="sr-only">{siteConfig.name}</span>
          </a>
        </Link>
        <button
          className="absolute transition-all border border-transparent md:hidden right-4 top-8 hover:border-link"
          onClick={() => setShowMenu(!showMenu)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <div
          className={classNames(
            "max-h-0 transition-all overflow-hidden md:max-h-screen",
            {
              "max-h-screen": showMenu,
            }
          )}
        >
          <MenuMain items={menus.main} />
        </div>
      </div>
    </header>
  )
}
