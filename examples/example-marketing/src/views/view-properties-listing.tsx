import React from "react"
import { useQuery, useQueryClient } from "react-query"
import { useForm } from "react-hook-form"
import { deserialize } from "next-drupal"
import { Icon } from "reflexjs"

import { FormItem } from "@/components/form-item"
import { NodePropertyGrid, NodePropertyList } from "@/nodes/node-property"

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
  const { data: view, isLoading, isPreviousData } = useQuery(
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
    <div py="20" bg="muted" {...props}>
      <div
        variant="container"
        display="grid"
        col="1|1|1|350px 1fr"
        gap="10"
        alignItems="flex-start"
      >
        <div bg="background" borderRadius="lg" p="6">
          <div
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb="6"
          >
            <h4 variant="heading.h4" fontFamily="sans">
              Find your place
            </h4>
          </div>
          <hr />
          <form onSubmit={handleSubmit(submitForm)}>
            <div display="grid" row="repeat(3, auto)" gap="8">
              <FormItem name="location" label="Locations">
                <select
                  id="location"
                  name="location"
                  variant="select"
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
                  variant="select"
                  {...register("status")}
                >
                  <option value="All">Select Status</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </FormItem>
              <div display="grid" col="2" gap="4">
                <FormItem name="beds" label="Min Beds">
                  <select
                    id="beds"
                    name="beds"
                    variant="select"
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
                    variant="select"
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
            <hr />
            <div
              display="grid"
              col="2"
              gap="4"
              alignItems="center"
              justifyContent="space-between"
            >
              <button variant="button.primary" width="full">
                Search
              </button>
              <button
                type="button"
                variant="button.outline"
                ml="auto"
                onClick={() => resetForm()}
                visibility={formState.isSubmitted ? "visible" : "hidden"}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
        <div>
          {view.results.length ? (
            <>
              <div
                pb="4"
                px="2"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <h3 fontWeight="normal">
                  Found {view.meta?.count} properties.
                </h3>
                <div display="grid" col="2" gap="2">
                  <button
                    type="button"
                    variant="button.sm"
                    bg={display === "grid" ? "background" : "muted"}
                    onClick={() => setDisplay("grid")}
                  >
                    <Icon name="grid" />
                  </button>
                  <button
                    type="button"
                    variant="button.sm"
                    bg={display === "list" ? "background" : "muted"}
                    onClick={() => setDisplay("list")}
                  >
                    <Icon name="list" />
                  </button>
                </div>
              </div>
              <div
                display="grid"
                col={display === "grid" ? "1|2" : 1}
                gap="10"
                opacity={isLoading ? 0.5 : 1}
              >
                {view.results.map((node) => (
                  <div key={node.id}>
                    {display === "grid" ? (
                      <NodePropertyGrid node={node} />
                    ) : (
                      <NodePropertyList node={node} />
                    )}
                  </div>
                ))}
              </div>
              <hr />
              <div
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <button
                  variant="button"
                  onClick={() => setPage((old) => Math.max(old - 1, 0))}
                  disabled={page === 0}
                >
                  Previous
                </button>
                <button
                  variant="button"
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
            <p textAlign="center" py="20">
              No properties found.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
