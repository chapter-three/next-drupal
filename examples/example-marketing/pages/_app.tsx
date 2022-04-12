import * as React from "react"
import { AppProps } from "next/app"
import Router from "next/router"
import { QueryClient, QueryClientProvider } from "react-query"
import { Hydrate } from "react-query/hydration"
import NProgress from "nprogress"
import { syncDrupalPreviewRoutes } from "next-drupal"
import "nprogress/nprogress.css"

import "styles/globals.css"

Router.events.on("routeChangeStart", function (path) {
  syncDrupalPreviewRoutes(path)
  NProgress.start()
})
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

export default function App({ Component, pageProps }: AppProps) {
  const queryClientRef = React.useRef<QueryClient>()
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient()
  }
  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  )
}
