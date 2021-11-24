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
      <div className="container mx-auto py-10 px-6 max-w-2xl">
        <article className="prose lg:prose-xl">
          <h1>Next.js for Drupal</h1>
          <h2>Search API Example - Simple</h2>
          <p>
            A simple full text search implemented using Search API and JSON:API
            Search API.
          </p>
          <p>Use the form below to search for article nodes.</p>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="sm:grid sm:grid-cols-7 items-center gap-4">
              <input
                type="search"
                placeholder="Search articles..."
                name="keywords"
                required
                className="col-span-5 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
              />
              <button
                type="submit"
                className="sm:col-span-2 mt-4 sm:mt-0 flex w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-black"
              >
                {status === "loading" ? "Please wait..." : "Search"}
              </button>
            </div>
          </form>
          {status === "error" ? (
            <div className="border-red-200 bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm">
              An error occured. Please try again.
            </div>
          ) : null}
          {!results.length ? (
            <p className="text-sm">
              No results found. Try searching for <strong>static</strong> or{" "}
              <strong>preview</strong>.
            </p>
          ) : (
            <div className="pt-4">
              <h3 className="mt-0">Found {results.length} result(s).</h3>
              {results.map((node) => (
                <div key={node.id} className="border-b pb-4 mb-4">
                  <article className="sm:grid grid-cols-3 gap-4">
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
