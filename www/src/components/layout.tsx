import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

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
        title={`${title} - Next.js for Drupal`}
        description={description}
        canonical={`https://next-drupal.org${path}`}
        openGraph={{
          title,
          description,
          url: `https://next-drupal.org${path}`,
          images: [
            {
              url: "https://next-drupal.org/images/meta.png",
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
