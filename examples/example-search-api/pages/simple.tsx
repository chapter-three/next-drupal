import * as React from "react"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { DrupalNode } from "next-drupal"

function formatDate(input: string): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function SimplePage() {
  const [status, setStatus] = React.useState<"error" | "success" | "loading">()
  const [results, setResults] = React.useState<DrupalNode[]>([])

  async function handleSubmit(event) {
    event.preventDefault()

    setStatus("loading")

    const response = await fetch("/api/search/article", {
      method: "POST",
      body: JSON.stringify({
        params: {
          fields: {
            "node--article": "id,title,created,field_image",
          },
          include: "field_image",
          filter: {
            fulltext: event.target.keywords.value,
          },
        },
      }),
    })

    if (!response.ok) {
      return setStatus("error")
    }

    setStatus("success")

    const results = await response.json()

    setResults(results)
  }

  return (
    <>
      <Head>
        <title>Next.js for Drupal | Search API Example</title>
      </Head>
      <div className="container max-w-2xl px-6 py-10 mx-auto">
        <article className="prose lg:prose-xl">
          <h1>Next.js for Drupal</h1>
          <h2>Search API Example - Simple</h2>
          <p>
            A simple full text search implemented using Search API and JSON:API
            Search API.
          </p>
          <p>Use the form below to search for article nodes.</p>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="items-center gap-4 sm:grid sm:grid-cols-7">
              <input
                type="search"
                placeholder="Search articles..."
                name="keywords"
                required
                className="relative block w-full col-span-5 px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
              />
              <button
                type="submit"
                data-cy="btn-submit"
                className="flex justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm sm:col-span-2 sm:mt-0 hover:bg-black"
              >
                {status === "loading" ? "Please wait..." : "Search"}
              </button>
            </div>
          </form>
          {status === "error" ? (
            <div className="px-4 py-2 text-sm text-red-600 bg-red-100 border-red-200 rounded-md">
              An error occured. Please try again.
            </div>
          ) : null}
          {!results.length ? (
            <p className="text-sm" data-cy="search-no-results">
              No results found. Try searching for <strong>static</strong> or{" "}
              <strong>preview</strong>.
            </p>
          ) : (
            <div className="pt-4">
              <h3 className="mt-0" data-cy="search-results">
                Found {results.length} result(s).
              </h3>
              {results.map((node) => (
                <div key={node.id} className="pb-4 mb-4 border-b">
                  <article
                    className="grid-cols-3 gap-4 sm:grid"
                    data-cy="search-result"
                  >
                    {node.field_image?.uri && (
                      <div className="col-span-1 mb-4 sm:mb-0">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${node.field_image.uri.url}`}
                          width={200}
                          height={110}
                          layout="responsive"
                          objectFit="cover"
                        />
                      </div>
                    )}
                    <div className="col-span-2">
                      <h4 className="mt-0">{node.title}</h4>
                      <p className="mb-0">
                        <small>{formatDate(node.created)}</small>
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
          <p>
            <Link href="/" passHref>
              <a>Go back</a>
            </Link>
          </p>
        </article>
      </div>
    </>
  )
}
