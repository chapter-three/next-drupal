import * as React from "react"
import { AppProps } from "next/app"
import { ThemeProvider } from "reflexjs"

import { LocaleProvider } from "@/components/locale-provider"
import { Layout } from "@/components/layout"
import theme from "../src/theme"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocaleProvider>
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </LocaleProvider>
  )
}
