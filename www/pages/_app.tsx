import Script from "next/script"
import { DefaultSeo } from "next-seo"
import { Analytics } from "@vercel/analytics/react"

import { site } from "config/site"

import "../styles/global.css"

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=GTM-KZRZTL6"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'GTM-KZRZTL6');
        `}
      </Script>
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
      <Analytics />
    </>
  )
}
