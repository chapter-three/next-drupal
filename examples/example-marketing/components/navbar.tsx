import React from "react"
import { useRouter } from "next/router"
import { DrupalMenuLinkContent } from "next-drupal"
import classNames from "classnames"

import { LocaleSwitcher } from "components/locale-switcher"
import Link from "next/link"

interface NavbarProps {
  links: DrupalMenuLinkContent[]
}

export function Navbar({ links, ...props }: NavbarProps) {
  const { locale } = useRouter()

  return (
    <header
      className="static top-0 z-50 flex-shrink-0 py-4 bg-white md:sticky"
      {...props}
    >
      <div className="container flex flex-col items-start justify-between px-6 mx-auto md:flex-row md:items-center">
        <Link href="/" locale={locale} passHref>
          <a className="text-lg font-bold">Marketing</a>
        </Link>
        {links ? <Menu items={links} /> : null}
        <div className="absolute flex justify-end md:static top-2 right-4">
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  )
}

function Menu({ items }: { items: DrupalMenuLinkContent[] }) {
  return (
    <ul
      className="grid grid-flow-col gap-4 mx-auto mt-6 md:mt-0 auto-cols-auto md:auto-rows-auto md:gap-8 lg:gap-12"
      data-cy="navbar-menu"
    >
      {items.map((item) => (
        <MenuLink link={item} key={item.id} />
      ))}
    </ul>
  )
}

function MenuLink({ link }: { link: DrupalMenuLinkContent }) {
  const { asPath } = useRouter()

  return (
    <li>
      <Link href={link.url} passHref>
        <a
          className={classNames(
            "py-4 hover:underline text-sm md:text-base",
            link.url === asPath ? "font-semibold" : "font-normal"
          )}
        >
          {link.title}
        </a>
      </Link>
    </li>
  )
}
