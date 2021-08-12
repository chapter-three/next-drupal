import { AppProps } from "next/app"
import "tailwindcss/tailwind.css"
import Router from "next/router"
import { syncDrupalPreviewRoutes } from "next-drupal"
import { Layout } from "@/components/layout"

Router.events.on("routeChangeStart", function (path) {
  syncDrupalPreviewRoutes(path)
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
