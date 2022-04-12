import { PreviewAlert } from "components/preview-alert"
import { Navbar, NavbarProps } from "components/navbar"
import { Footer, FooterProps } from "./footer"

export interface LayoutProps {
  menus: {
    main: NavbarProps["menu"]
    footer: FooterProps["menu"]
  }
  children?: React.ReactNode
}

export function Layout({ menus, children }: LayoutProps) {
  return (
    <>
      <PreviewAlert />
      <Navbar menu={menus.main} />
      <main className="container py-10 mx-auto">{children}</main>
      <Footer menu={menus.footer} />
    </>
  )
}
