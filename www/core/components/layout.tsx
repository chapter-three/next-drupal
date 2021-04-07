import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { Navbar } from "@/core/components/navbar"
import { Footer } from "@/core/components/footer"

import { site } from "@/config/site"

interface LayoutProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function Layout({
  title = "",
  description = "",
  children,
}: LayoutProps) {
  const { asPath: path } = useRouter()
  return (
    <>
      <NextSeo
        title={path === "/" ? site.name : `${title} - ${site.name}`}
        description={description}
        canonical={`${process.env.NEXT_PUBLIC_BASE_URL}${path}`}
        openGraph={{
          title,
          description,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}${path}`,
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/meta.jpg`,
              width: 800,
              height: 600,
            },
          ],
        }}
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
