import Document, { Html, Main, NextScript, Head } from "next/document"

export default class extends Document {
  render() {
    return (
      <Html lang="en" className="font-sans antialiased bg-white">
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" type="image/png" href="/images/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
          />
          <script
            type="text/javascript"
            src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
