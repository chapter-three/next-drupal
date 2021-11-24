import * as React from "react"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import {
  DrupalNode,
  getSearchIndexFromContext,
  deserialize,
  JsonApiSearchApiResponse,
  DrupalSearchApiFacet,
} from "next-drupal"
import { GetStaticPropsResult } from "next"

const params = {
  fields: {
    "node--property_listing":
      "id,title,field_status,field_images,field_location",
  },
  filter: {},
  include: "field_images.field_media_image,field_location",
}

interface AdvancedPageProps {
  nodes: DrupalNode[]
  facets: DrupalSearchApiFacet[]
}

export default function AdvancedPage({
  nodes,
  facets: initialFacets,
}: AdvancedPageProps) {
  const [status, setStatus] = React.useState<"error" | "success" | "loading">()
  const [results, setResults] = React.useState<DrupalNode[]>(nodes)
  const [facets, setFacets] =
    React.useState<DrupalSearchApiFacet[]>(initialFacets)

  async function handleSubmit(event) {
    event.preventDefault()

    for (const filter of ["fulltext", "field_location", "field_status"]) {
      if (event.target[filter]?.value != "") {
        params["filter"][filter] = event.target[filter]?.value
      }
    }

    setStatus("loading")
    const response = await fetch("/api/search/property", {
      method: "POST",
      body: JSON.stringify({
        deserialize: false,
        params,
      }),
    })

    if (!response.ok) {
      return setStatus("error")
    }

    setStatus("success")

    const json = await response.json()
    const results = deserialize(json) as DrupalNode[]

    setResults(results)

    if (results?.length) {
      setFacets(json.meta.facets)
    }
  }

  return (
    <>
      <Head>
        <title>Next.js for Drupal | Search API Example</title>
      </Head>
      <div className="container mx-auto py-10 px-6 max-w-2xl">
        <article className="prose lg:prose-xl">
          <h1>Next.js for Drupal</h1>
          <h2>Search API Example - Advanced</h2>
          <p>
            A more advanced search implemented using Search API, Facets and
            JSON:API Search API.
          </p>
          <p>Use the form below to search for property listing.</p>
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="search"
              placeholder="Search properties (min 4 characters)..."
              name="fulltext"
              className="col-span-5 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
            />
            <div className="grid md:grid-cols-2 gap-4 py-4">
              {facets.map((facet) => (
                <div key={facet.id} className="border p-4 rounded-md">
                  <h3 className="text-base mt-0 mb-2">{facet.label}</h3>
                  <div className="grid grid-flow-row gap-2">
                    <label
                      htmlFor={`${facet.id}--any`}
                      className="flex items-center text-base"
                    >
                      <input
                        type="radio"
                        id={`${facet.id}--any`}
                        name={facet.path}
                        className="mr-2"
                        value=""
                        defaultChecked
                      />
                      Any
                    </label>
                    {facet.terms.map((term) => (
                      <label
                        key={term.url}
                        htmlFor={`${facet.id}--${term.values.value}`}
                        className="flex items-center text-sm"
                      >
                        <input
                          type="radio"
                          id={`${facet.id}--${term.values.value}`}
                          name={facet.path}
                          value={term.values.value}
                          className="mr-2"
                          defaultChecked={term.values.active}
                        />
                        {term.values.label}{" "}
                        <span className="flex ml-2 text-xs bg-gray-200 w-5 h-5 items-center justify-center rounded-full">
                          {term.values.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="flex w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-black"
            >
              {status === "loading" ? "Please wait..." : "Search"}
            </button>
          </form>
          {status === "error" ? (
            <div className="border-red-200 bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm">
              An error occured. Please try again.
            </div>
          ) : null}
          {!results.length ? (
            <p className="text-sm">No results found.</p>
          ) : (
            <div className="pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                {results.map((node) => (
                  <div key={node.id}>
                    <article className="grid grid-cols-3 gap-4">
                      {node.field_images?.[0]?.field_media_image.uri && (
                        <div className="col-span-1 rounded-md overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${node.field_images?.[0]?.field_media_image.uri.url}`}
                            width={200}
                            height={200}
                            layout="responsive"
                            objectFit="cover"
                          />
                        </div>
                      )}
                      <div className="col-span-2">
                        <h4 className="mt-0 text-base">{node.title}</h4>
                        <p className="m-0 text-base">For {node.field_status}</p>
                        <p className="m-0 text-base">
                          {node.field_location.name}
                        </p>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
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

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<AdvancedPageProps>> {
  const results = await getSearchIndexFromContext<JsonApiSearchApiResponse>(
    "property",
    context,
    {
      deserialize: false,
      params,
    }
  )

  return {
    props: {
      nodes: deserialize(results) as DrupalNode[],
      facets: results.meta.facets,
    },
  }
}
