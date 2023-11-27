import Document, { Html, Main, NextScript, Head } from "next/document"

export default class extends Document {
  render() {
    return (
      <Html lang="en" className="font-sans antialiased bg-white">
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" type="image/png" href="/images/favicon.ico" />
          <link
            rel="preconnect"
            href={`https://${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}-dsn.algolia.net`}
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
