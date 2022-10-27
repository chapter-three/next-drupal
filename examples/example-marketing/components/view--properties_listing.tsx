import React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { deserialize } from "next-drupal"
import classNames from "classnames"

import { FormItem } from "components/form-item"
import { Section } from "components/section"
import { Node } from "components/node"

const filters = { location: "All", status: "All", beds: "1", baths: "1" }

async function fetchView(url, params) {
  const _url = new URL(url)
  _url.search = new URLSearchParams(params).toString()

  const result = await fetch(_url.toString())

  if (!result.ok) {
    throw new Error(result.statusText)
  }

  const data = await result.json()

  return {
    results: deserialize(data),
    meta: data.meta,
    links: data.links,
  }
}

export function ViewPropertiesListing({ view: initialView, ...props }) {
  const [page, setPage] = React.useState(0)
  const queryClient = useQueryClient()
  const [display, setDisplay] = React.useState<"grid" | "list">("grid")
  const { register, handleSubmit, getValues, formState, reset } = useForm({
    defaultValues: filters,
  })
  const [locations, setLocations] = React.useState([])
  const {
    data: view,
    isLoading,
    isPreviousData,
  } = useQuery(
    [initialView.name, page],
    async () => {
      // Build params from form values.
      const values = getValues()
      const params = {
        page: page + "",
        include: "field_location,field_images.field_media_image",
      }
      for (const filter of Object.keys(filters)) {
        if (values[filter]) {
          params[`views-filter[${filter}]`] = values[filter]
        }
      }

      return fetchView(initialView.links.self.href.split("?")[0], params)
    },
    {
      initialData: initialView,
      keepPreviousData: true,
    }
  )

  // Build locations dropdown from view results.
  React.useEffect(() => {
    const allLocations: {
      name: string
      id: string
    }[] = view.results.map((result) => ({
      name: result.field_location.name,
      id: result.field_location.drupal_internal__tid,
    }))

    setLocations(
      Array.from(new Map(allLocations.map((item) => [item.id, item])).values())
    )
  }, [])

  async function submitForm() {
    setPage(0)
    await queryClient.invalidateQueries(view.name)
  }

  async function resetForm() {
    reset()
    submitForm()
  }

  return (
    <Section backgroundColor="bg-gray-50" {...props}>
      <div className="container items-start gap-10 px-6 mx-auto md:grid md:grid-cols-3">
        <div className="p-6 mb-10 bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold">Find your place</h4>
          </div>
          <hr className="my-6" />
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="grid gap-8 auto-rows-auto">
              <FormItem name="location" label="Locations">
                <select
                  id="location"
                  name="location"
                  className="border border-gray-300 rounded-md appearance-none"
                  {...register("location")}
                >
                  <option value="All">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </FormItem>
              <FormItem name="status" label="Status">
                <select
                  id="status"
                  name="status"
                  className="border border-gray-300 rounded-md appearance-none"
                  {...register("status")}
                >
                  <option value="All">Select Status</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </FormItem>
              <div className="grid grid-cols-2 gap-4">
                <FormItem name="beds" label="Min Beds">
                  <select
                    id="beds"
                    name="beds"
                    className="border border-gray-300 rounded-md appearance-none"
                    {...register("beds")}
                  >
                    {[1, 2, 3, 4].map((value) => (
                      <option value={value} key={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </FormItem>
                <FormItem name="baths" label="Min Baths">
                  <select
                    id="baths"
                    name="baths"
                    className="border border-gray-300 rounded-md appearance-none"
                    {...register("baths")}
                  >
                    {[1, 2, 3, 4].map((value) => (
                      <option value={value} key={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </FormItem>
              </div>
            </div>
            <hr className="my-6" />
            <div className="grid items-center justify-between grid-cols-2 gap-4">
              <button
                className="flex items-center justify-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                data-cy="submit"
              >
                Search
              </button>
              <button
                className={classNames(
                  "flex items-center justify-center px-4 py-2 text-black transition-colors bg-gray-100 rounded-md hover:bg-gray-200",
                  {
                    hidden: !formState.isSubmitted,
                  }
                )}
                type="button"
                onClick={() => resetForm()}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
        <div className="col-span-2">
          {view.results.length ? (
            <>
              <div className="flex items-center justify-between px-2 pb-4">
                <h3 className="text-lg" data-cy="view--results">
                  Found {view.meta?.count} properties.
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={classNames(
                      "border h-8 w-8 flex items-center justify-center bg-white rounded-md",
                      {
                        "opacity-50": display === "grid",
                      }
                    )}
                    onClick={() => setDisplay("grid")}
                    aria-label="grid"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={classNames(
                      "border h-8 w-8 flex items-center justify-center bg-white rounded-md",
                      {
                        "opacity-50": display === "list",
                      }
                    )}
                    onClick={() => setDisplay("list")}
                    aria-label="list"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                className={classNames("grid grid-flow-row gap-10", {
                  "md:grid-cols-2": display === "grid",
                  "opacity-50": isLoading,
                })}
              >
                {view.results.map((node) => (
                  <Node key={node.id} viewMode={display} node={node} />
                ))}
              </div>
              <hr className="my-10" />
              <div className="flex items-center justify-between">
                <button
                  className={classNames(
                    "flex items-center bg-black justify-center px-4 py-2 transition-colors  rounded-md ",
                    page == 0
                      ? "bg-gray-100 hover:bg-gray-200 text-black opacity-50"
                      : "bg-black text-white"
                  )}
                  data-cy="pager-previous"
                  onClick={() => setPage((old) => Math.max(old - 1, 0))}
                  disabled={page === 0}
                >
                  Previous
                </button>
                <button
                  className={classNames(
                    "flex items-center bg-black justify-center px-4 py-2 transition-colors  rounded-md ",
                    isPreviousData || !view?.links.next
                      ? "bg-gray-100 hover:bg-gray-200 text-black opacity-50"
                      : "bg-black text-white"
                  )}
                  data-cy="pager-next"
                  onClick={() => {
                    if (!isPreviousData && view.links.next) {
                      setPage((old) => old + 1)
                    }
                  }}
                  disabled={isPreviousData || !view?.links.next}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="py-20 text-center">No properties found.</p>
          )}
        </div>
      </div>
    </Section>
  )
}
