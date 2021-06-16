import * as React from "react"
import { Navbar } from "@/components/navbar"
import { site } from "@/config"
import { useMenu } from "next-drupal"
import { Footer } from "./footer"

interface LayoutProps {
  children?: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { tree: mainLinks } = useMenu("main")
  const { tree: footerLinks } = useMenu("footer")

  return (
    <div display="flex" flexDirection="column" minH="100vh">
      <Navbar links={mainLinks} />
      <main flex="1 0 auto">{children}</main>
      <Footer copyright={site.copyright} links={footerLinks} />
    </div>
  )
}
