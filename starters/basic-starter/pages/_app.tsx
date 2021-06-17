import { AppProps } from "next/app"
import "tailwindcss/tailwind.css"
import { Layout } from "@/components/layout"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
