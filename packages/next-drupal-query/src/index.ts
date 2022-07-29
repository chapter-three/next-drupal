import deepmerge from "deepmerge"
import { DrupalJsonApiParams } from "drupal-jsonapi-params"
import { GetServerSidePropsContext, GetStaticPathsContext } from "next"
import type { RequireAllOrNone, ConditionalKeys } from "type-fest"

const paramBuilder = new DrupalJsonApiParams()

type ViewWithFilters<T, F> = {
  id: string
  items?: T
  filters?: F
  nextPage?: number
  opts: QueryParamsOptsWithPagination<null>
}

/**
 * @template T The items type for this view.
 * @template F The filters type for the view. Use `null` for no filters.
 *
 * @example
 * type ViewWithFilters = View<DrupalNode[], { from: number, to: number }>
 * type ViewWithoutFilters = View<DrupalTaxonomyTerm[], null>
 */
export type View<T, F> = F extends null
  ? Omit<ViewWithFilters<T, F>, "filters">
  : ViewWithFilters<T, F>

export type QueryOpts<O> = O & {
  context?: GetStaticPathsContext | GetServerSidePropsContext
}

// Generic params are explicitly not typed here to force definition.
export type QueryParams<O> = (opts?: O) => DrupalJsonApiParams

export type QueryData<O, R> = (opts?: O) => Promise<R>

type QueryParamsOptsPaginated = RequireAllOrNone<
  {
    page: number
    limit: number
  },
  "page" | "limit"
> & {
  context?: GetServerSidePropsContext
}

/**
 * @template O The type for the params options. Use `null` if the query does not use any additional options.
 *
 * @example
 * type ParamOpts = PaginatedQueryParamsOpts<{ type: string }>
 */
export type QueryParamsOptsWithPagination<O> = O extends null
  ? QueryParamsOptsPaginated
  : O & QueryParamsOptsPaginated

type Queries<Q> = Record<
  keyof Q,
  {
    params: (opts: unknown) => DrupalJsonApiParams
    data?: (opts: unknown) => unknown
  }
>

export type QueryTypeOf<
  Q extends Queries<Q>,
  T extends keyof Q,
  F extends "params" | "data"
> = Q[T][F]

export type QueryId<Q = null> = keyof Q

export type QueryParamsOpts<
  Q extends Queries<Q>,
  T extends keyof Q
> = Parameters<QueryTypeOf<Q, T, "params">>[0]

export type QueryDataOpts<Q extends Queries<Q>, T extends keyof Q> = Parameters<
  Q[T]["data"]
>[0]

export type QueryDataReturn<
  Q extends Queries<Q>,
  T extends keyof Q
> = ReturnType<QueryTypeOf<Q, T, "data">>

export function withPagination(
  params: DrupalJsonApiParams,
  opts: QueryParamsOptsWithPagination<unknown>
) {
  if (!opts) {
    return params
  }

  if (opts?.context?.query) {
    opts = {
      ...opts,
      ...opts.context.query,
    }
  }

  if (typeof opts.page !== undefined && typeof opts.limit !== undefined) {
    params.addPageLimit(opts.limit).addPageOffset(opts.page * opts.limit)
  }

  return params
}

export function massageRouteQuery(query) {
  if (!query) {
    return {}
  }

  // Remove slug keys from query.
  Object.keys(query).forEach((key) => {
    if (key.startsWith("slug")) {
      delete query[key]
    }
  })

  if (query?.page) {
    query.page = parseInt(`${query.page}`)
  }

  if (query?.limit) {
    query.limit = parseInt(`${query.limit}`)
  }

  return query
}

export function createQueries<Q extends Readonly<Queries<Q>>>(queries: Q) {
  return {
    getDataIds: <T extends ConditionalKeys<Q, { data }>>(): T[] => {
      const ids = []
      for (const id in queries) {
        if (typeof queries[id]["data"] !== "undefined") {
          ids.push(id)
        }
      }
      return ids
    },
    getIds: <T extends keyof Q>(): T[] => {
      const ids = []
      for (const id in queries) {
        ids.push(id)
      }
      return ids
    },
    getParams: <T extends keyof Q, O extends QueryParamsOpts<Q, T>>(
      id: T = null,
      opts: O = null
    ) => {
      if (typeof window !== "undefined") {
        throw new Error(
          "You should not call getQueryParams on the client. This is a server-only call."
        )
      }

      if (!id) {
        return paramBuilder.clear()
      }

      const query = queries?.[id]

      if (!query) {
        throw new Error(`Query with id '${id as string}' not found.`)
      }

      if (!query["params"]) {
        throw new Error(
          `No params defined for query with id '${id as string}'.`
        )
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return query["params"](opts as any)
    },
    getData: async <
      T extends ConditionalKeys<Q, { data }>,
      O extends QueryDataOpts<Q, T>
    >(
      id: T,
      opts: O = null
    ): Promise<QueryDataReturn<typeof queries, T>> => {
      if (typeof window !== "undefined") {
        throw new Error(
          "You should not call getQueryData on the client. This is a server-only call."
        )
      }

      const query = queries?.[id]

      if (!query) {
        throw new Error(`Query with id '${id as string}' not found.`)
      }

      if (!query["data"]) {
        throw new Error(`No data defined for query with id '${id as string}'.`)
      }

      opts = massageRouteQuery(opts)

      if (
        typeof query["defaultOpts"] !== undefined &&
        typeof opts !== undefined
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        opts = deepmerge(query["defaultOpts"], opts as any) as any
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (await query["data"](opts as any)) as any
    },
  }
}
