import { site } from "config/site"
import { DefaultSeo } from "next-seo"

import "../styles/global.css"

export default function App({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo
        openGraph={{
          title: site.name,
          description: site.description,
          type: "website",
          url: process.env.NEXT_PUBLIC_BASE_URL,
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/meta.jpg`,
              width: 800,
              height: 600,
            },
          ],
        }}
        twitter={{
          handle: `@${site.social.twitter}`,
          site: `@${site.social.twitter}`,
          cardType: "summary_large_image",
        }}
      />
      <Component {...pageProps} />
    </>
  )
}
