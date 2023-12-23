import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"

import { usePaginatedSearch } from "../hooks/use-paginated-search"

function formatDate(input: string): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function PaginatedPage() {
  const router = useRouter()
  const { data, hasNextPage, isFetching, fetchNextPage, isError } =
    usePaginatedSearch()

  function onSubmit(event) {
    event.preventDefault()

    router.push({
      pathname: "/paginated",
      query: `keywords=${event.target.keywords.value}`,
    })
  }

  return (
    <>
      <Head>
        <title>Next.js for Drupal | Search API Example</title>
      </Head>
      <div className="container max-w-2xl px-6 py-10 mx-auto">
        <article className="prose lg:prose-xl">
          <h1>Next.js for Drupal</h1>
          <h2>Search API Example - Paginated</h2>
          <p>
            A full text search implemented using Search API and JSON:API Search
            API.
          </p>
          <p>
            Pagination is implemented using <code>@tanstack/react-query</code>.
          </p>
          <p>Use the form below to search for article nodes.</p>
          <form onSubmit={onSubmit} className="mb-4">
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
                {isFetching ? "Please wait..." : "Search"}
              </button>
            </div>
          </form>
          {isError ? (
            <div className="px-4 py-2 text-sm text-red-600 bg-red-100 border-red-200 rounded-md">
              An error occured. Please try again.
            </div>
          ) : null}
          {!data?.pages?.length ? (
            <p className="text-sm" data-cy="search-no-results">
              No results found. Try searching for <strong>static</strong> or{" "}
              <strong>preview</strong>.
            </p>
          ) : (
            <div className="pt-4">
              <h3 className="mt-0" data-cy="search-results">
                Found {data?.pages[0]?.total} result(s).
              </h3>
              {data?.pages.map((page, index) => (
                <div key={index}>
                  {page.items?.map((node) => (
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
                        <div className="col-span-2 not-prose">
                          <h4 className="font-semibold text-black leading-normal">
                            {node.title}
                          </h4>
                          <p className="mb-0">
                            <small>{formatDate(node.created)}</small>
                          </p>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              ))}
              {hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetching}
                  className="flex justify-center px-4 py-2 mt-4 text-sm font-medium text-black bg-slate-200 border border-slate-200 rounded-md shadow-sm sm:col-span-2 sm:mt-0"
                >
                  {isFetching ? "Loading..." : "Show more"}
                </button>
              )}
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
