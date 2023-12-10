import Head from "next/head"
import Link from "next/link"

export default function IndexPage() {
  return (
    <>
      <Head>
        <title key="title">Next.js for Drupal | Search API Example</title>
      </Head>
      <div className="container mx-auto py-10 px-6 max-w-2xl">
        <article className="prose lg:prose-xl">
          <h1>Next.js for Drupal</h1>
          <h2>Search API Example</h2>
          <p>
            This is an example on how to implement Search API in Next.js for
            Drupal.
          </p>
          <h2>Simple</h2>
          <p>
            A simple full text search implemented using Search API and JSON:API
            Search API.
          </p>
          <p>
            <Link href="/simple" passHref>
              <a>See Example</a>
            </Link>
          </p>
          <h2>Advanced</h2>
          <p>
            A more advanced search implemented using Search API, Facets and
            JSON:API Search API.
          </p>
          <p>
            <Link href="/advanced" passHref>
              <a>See Example</a>
            </Link>
          </p>
          <h2>Paginated</h2>
          <p>
            A full text search implemented using Search API and JSON:API Search
            API.
          </p>
          <p>
            Pagination is implemented using <code>@tanstack/react-query</code>.
          </p>
          <p>
            <Link href="/paginated" passHref>
              <a>See Example</a>
            </Link>
          </p>
          <h2>Documentation</h2>
          See{" "}
          <a href="https://next-drupal.org/docs/search-api">
            https://next-drupal.org/docs/search-api
          </a>
        </article>
      </div>
    </>
  )
}
