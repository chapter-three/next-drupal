import { DefaultSeo } from "next-seo"
import { ThemeProvider } from "reflexjs"

import theme from "../src/theme"

export default function App({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo
        openGraph={{
          title: "Next.js for Drupal",
          description:
            "Next.js + Drupal for Incremental Static Regeneration and Preview mode.",
          type: "website",
          url: "https://next-drupal.org",
          images: [
            {
              url: "https://next-drupal.org/images/meta.png",
              width: 800,
              height: 600,
            },
          ],
        }}
        twitter={{
          handle: "@arshadcn",
          site: "@arshadcn",
          cardType: "summary_large_image",
        }}
      />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
