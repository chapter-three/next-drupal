import * as React from "react"
import { DrupalMenuLinkContent } from "next-drupal"

import { Navbar } from "components/navbar"
import { Footer } from "components/footer"

export interface LayoutProps {
  menus: {
    main: DrupalMenuLinkContent[]
    footer: DrupalMenuLinkContent[]
  }
  children?: React.ReactNode
}

export function Layout({ menus, children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar links={menus.main} />
      <main className="flex-1">{children}</main>
      <Footer links={menus.footer} />
    </div>
  )
}
