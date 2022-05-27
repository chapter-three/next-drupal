import { Meta, MetaProps } from "components/meta"
import { PreviewAlert } from "components/preview-alert"
import { Header, HeaderProps } from "components/header"
import { Footer, FooterProps } from "components/footer"
import { TailwindIndicator } from "components/tailwind-indicator"

export interface LayoutProps extends HeaderProps, FooterProps {
  meta?: MetaProps
  menus: HeaderProps["menus"] & FooterProps["menus"]
  children?: React.ReactNode
}

export function Layout({ meta, menus, blocks, children }: LayoutProps) {
  return (
    <>
      <Meta {...meta} />
      <div className="flex flex-col min-h-screen">
        <PreviewAlert />
        <Header menus={{ main: menus.main }} />
        <main className="flex-1 pb-10 bg-body">{children}</main>
        <Footer menus={{ footer: menus.footer }} blocks={blocks} />
      </div>
      <TailwindIndicator />
    </>
  )
}
