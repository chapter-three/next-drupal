import deepmerge from "deepmerge"
import { DrupalJsonApiParams } from "drupal-jsonapi-params"
import { GetServerSidePropsContext, GetStaticPathsContext } from "next"
import type { RequireAllOrNone, ConditionalKeys } from "type-fest"

// Note: some generic are explicitly not typed here to force definition.

const paramBuilder = new DrupalJsonApiParams()

type ViewWithFilters<T, F> = {
  id: string
  items?: T
  filters?: F
  nextPage?: number
  opts: QueryOptsWithPagination<null>
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

type QueryOptsPaginated = RequireAllOrNone<
  {
    page: number
    limit: number
  },
  "page" | "limit"
> & {
  context?: GetServerSidePropsContext
}

/**
 * Use this type helper to define options for query params.
 *
 * @template Options The type definition for the options. Use null if no additional options.
 *
 * @example
 * type ParamOpts = QueryOpts<{
 *    id: string
 * }>
 *
 * export const params: QueryParams<ParamOpts> = () => {}
 */
export type QueryOpts<Options> = Options & {
  context?: GetStaticPathsContext | GetServerSidePropsContext
}

/**
 * Use this type helper to define **paginated** options for query params.
 *
 * @template Options The type definition for the options. Use null if no additional options.
 *
 * @example
 * type ParamOpts = PaginatedQueryParamsOpts<{ type: string }>
 *
 * export const params: QueryParams<ParamOpts> = () => {}
 */
export type QueryOptsWithPagination<Options> = Options extends null
  ? QueryOptsPaginated
  : Options & QueryOptsPaginated

/**
 * Use this type helper to define options for query params.
 *
 * @template Options The type definition for the options. Use null if no additional options.
 *
 * @example
 *
 * type ParamOpts = QueryOpts<{
 *    id: string
 * }>
 *
 * export const params: QueryParams<ParamOpts> = () => {}
 */
export type QueryParams<
  Options extends QueryOpts<null> | QueryOptsWithPagination<null>
> = (opts?: Options) => DrupalJsonApiParams

/**
 * Use this type helper to define options and return type for query data.
 *
 * @template Options The type definition for the options. Use null if no additional options.
 * @template Return The return type for the data loader.
 *
 * @example
 *
 * type ParamOpts = QueryOpts<{
 *    id: string
 * }>
 *
 * type Article = {
 *    id: string
 *    title: string
 * }
 *
 * export const data: QueryData<ParamOpts, Article> = async (): Promise<Article> => {
 *    return {
 *        id: "",
 *        title: "",
 *    }
 * }
 */
export type QueryData<Options, Return> = (opts?: Options) => Promise<Return>

export type QueryFormatter<Input, Output> = (input: Input) => Output

type Queries<Q> = Record<
  keyof Q,
  {
    params?: (opts: unknown) => DrupalJsonApiParams
    data?: (opts: unknown) => unknown
    formatter?: (input) => unknown
  }
>

export type QueryTypeOf<
  Q extends Queries<Q>,
  T extends keyof Q,
  F extends "params" | "data" | "formatter"
> = Q[T][F]

export type QueryId<Q = null> = keyof Q

export type QueryParamsOpts<
  Q extends Queries<Q>,
  T extends keyof Q
> = Parameters<QueryTypeOf<Q, T, "params">>[0]

export type QueryDataOpts<Q extends Queries<Q>, T extends keyof Q> = Parameters<
  Q[T]["data"]
>[0]

export type QueryFormatterInput<
  Q extends Queries<Q>,
  T extends keyof Q
> = Parameters<Q[T]["formatter"]>[0]

export type QueryDataReturn<
  Q extends Queries<Q>,
  T extends keyof Q
> = ReturnType<QueryTypeOf<Q, T, "data">>

export type QueryFormatterReturn<
  Q extends Queries<Q>,
  T extends keyof Q
> = ReturnType<QueryTypeOf<Q, T, "formatter">>

export function withPagination(
  params: DrupalJsonApiParams,
  opts: QueryOptsWithPagination<unknown>
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
  const getRawData = async <
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
  }

  const formatData = <
    T extends ConditionalKeys<Q, { formatter }>,
    Input extends QueryFormatterInput<Q, T>
  >(
    id: T,
    input: Input
  ): QueryFormatterReturn<typeof queries, T> => {
    if (typeof window !== "undefined") {
      throw new Error(
        "You should not call getQueryData on the client. This is a server-only call."
      )
    }

    const query = queries?.[id]

    if (!query) {
      throw new Error(`Query with id '${id as string}' not found.`)
    }

    if (!query["formatter"]) {
      throw new Error(
        `No formatter defined for query with id '${id as string}'.`
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return query["formatter"](input) as any
  }

  async function getData<
    T extends ConditionalKeys<Q, { formatter; data }>,
    O extends QueryDataOpts<Q, T>
  >(id: T, opts?: O): Promise<QueryFormatterReturn<Q, T>>

  async function getData<
    T extends ConditionalKeys<Q, { data }>,
    O extends QueryDataOpts<Q, T>
  >(id: T, opts?: O): Promise<QueryDataReturn<Q, T>>

  async function getData(id, opts = null) {
    const rawData = await getRawData(id, opts)

    const query = queries?.[id]

    if (!query["formatter"]) {
      return rawData
    }

    return formatData(id, rawData)
  }

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
    getRawData,
    getData,
    formatData,
  }
}
