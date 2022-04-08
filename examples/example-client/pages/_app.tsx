import * as React from "react"
import { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "react-query"
import { Hydrate } from "react-query/hydration"

import "styles/globals.css"

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
