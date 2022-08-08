import Link from "next/link"

import { PreviewAlert } from "components/preview-alert"
import { MenuMain, MenuMainProps } from "components/menu--main"

export interface LayoutProps {
  menu: MenuMainProps["menu"]
  children?: React.ReactNode
}

export function Layout({ menu, children }: LayoutProps) {
  return (
    <>
      <PreviewAlert />
      <header>
        <div className="container flex items-center justify-between max-w-4xl px-4 py-6 mx-auto">
          <Link href="/" passHref>
            <a className="text-2xl font-semibold no-underline">
              Next.js for Drupal
            </a>
          </Link>
          <MenuMain menu={menu} />
        </div>
      </header>
      <main className="container max-w-4xl px-4 py-10 mx-auto">{children}</main>
    </>
  )
}
