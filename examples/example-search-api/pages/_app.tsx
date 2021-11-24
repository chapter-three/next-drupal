import { AppProps } from "next/app"
import "tailwindcss/tailwind.css"

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
