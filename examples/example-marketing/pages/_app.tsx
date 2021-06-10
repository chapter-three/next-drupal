import * as React from "react"
import { AppProps } from "next/app"
import { ThemeProvider } from "reflexjs"
import { Layout } from "@/components/layout"
import theme from "../src/theme"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}
