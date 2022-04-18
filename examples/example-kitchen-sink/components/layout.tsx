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
    <div className="flex flex-col min-h-screen">
      <PreviewAlert />
      <Navbar menu={menus.main} />
      <main className="flex-1">{children}</main>
      <Footer menu={menus.footer} />
    </div>
  )
}
