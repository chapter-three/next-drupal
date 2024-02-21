import deepmerge from "deepmerge"
import { DrupalJsonApiParams } from "drupal-jsonapi-params"
import type { GetServerSidePropsContext, GetStaticPathsContext } from "next"
import type { RequireAllOrNone, ConditionalKeys } from "type-fest"

// Note: some generic are explicitly not typed here to force definition.

const paramBuilder = new DrupalJsonApiParams()

type ViewWithFilters<Items, Filters = null, Options = null> = {
  id: string
  items?: Items
  filters?: Filters
  nextPage?: number
  opts?: QueryOptsWithPagination<Options>
}

/**
 * @template Items The items type for this view.
 * @template Filters The filters type for the view. Use `null` for no filters.
 *
 * @example
 * type ViewWithFilters = View<DrupalNode[], { from: number, to: number }>
 * type ViewWithoutFilters = View<DrupalTaxonomyTerm[], null>
 */
export type View<Items, Filters = null, Options = null> = Filters extends null
  ? Omit<ViewWithFilters<Items, Filters, Options>, "filters">
  : ViewWithFilters<Items, Filters, Options>

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
 * export const params: QueryParams<ParamOpts> = (opts) => {}
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
 *   sortBy: string
 *   sortOrder: "ASC" | "DESC"
 * }>
 *
 * export const params: QueryParams<ParamOpts> = (opts) => {
 *   return queries.getParams()
 *     .addFields("node--article", ["title", "path", "status"])
 *     .addSort(opts.sortBy, opts.sortOrder)
 * }
 */
export type QueryParams<Options> = (opts?: Options) => DrupalJsonApiParams

/**
 * Use this type helper to define options and return type for query data.
 *
 * @template Options The type definition for the options. Use null if no additional options.
 * @template Return The return type for the data loader.
 *
 * @example
 *
 * type DataOpts = QueryOpts<{
 *   id: string
 * }>
 *
 * type DrupalNodeArticle = {
 *   id: string
 *   title: string
 *   field_author: string
 * }
 *
 * export const data: QueryData<ParamOpts, DrupalNodeArticle> = async (opts): Promise<DrupalNodeArticle> => {
 *   return await drupal.getResource<DrupalNodeArticle>("node--article", opts.id)
 * }
 */
export type QueryData<Options, Return> = (opts?: Options) => Promise<Return>

/**
 * Use this type helper to define placeholder data for a query..
 *
 * @template Options The type definition for the options. Use null if no additional options.
 * @template Return The return type for the placeholder data.
 *
 * @example
 *
 * type DataOpts = QueryOpts<{
 *   id: string
 * }>
 *
 * type Article = {
 *   id: string
 *   title: string
 *   author: string
 * }
 *
 * export const placeholder: QueryPlaceholderData<ParamOpts, Article> = async (opts): Promise<DrupalNodeArticle> => {
 *   return {
 *     id: opts.id,
 *     title: faker.lorem.sentence(),
 *     author: faker.name.fullName()
 *   }
 * }
 */
export type QueryPlaceholderData<Options, Return> = (
  opts?: Options
) => Promise<Return>

/**
 * Use this type helper to define a query formatter. A formatter takes in input and outputs formatted data.
 *
 * @template Input The type definition for the input.
 * @template Output The type definition for the output.
 *
 * @example
 *
 * type DrupalNodeArticle = {
 *   id: string
 *   title: string
 *   field_author: string
 * }
 *
 * type Article = {
 *   id: string
 *   title: string
 *   author: string
 * }
 *
 * // This formatter accepts a `DrupalNodeArticle` and outputs an `Article`.
 * export const formatter: QueryFormatter<DrupalNodeArticle, Article> = (node): Article => {
 *   return {
 *     id: node.id,
 *     title: node.title,
 *     author: node.field_author
 *   }
 * }
 */
export type QueryFormatter<Input, Output> = (input: Input) => Output

type Queries<Q> = Record<
  keyof Q,
  {
    params?: (opts: unknown) => DrupalJsonApiParams
    data?: (opts: unknown) => unknown
    placeholder?: (opts: unknown) => unknown
    formatter?: (input) => unknown
  }
>

type QueryTypeOf<
  Q extends Queries<Q>,
  T extends keyof Q,
  F extends "params" | "data" | "formatter" | "placeholder",
> = Q[T][F]

// type QueryId<Q = null> = keyof Q

type QueryParamsOpts<Q extends Queries<Q>, T extends keyof Q> = Parameters<
  QueryTypeOf<Q, T, "params">
>[0]

type QueryDataOpts<Q extends Queries<Q>, T extends keyof Q> = Parameters<
  Q[T]["data"]
>[0]

type QueryPlaceholderDataOpts<
  Q extends Queries<Q>,
  T extends keyof Q,
> = Parameters<Q[T]["placeholder"]>[0]

type QueryFormatterInput<Q extends Queries<Q>, T extends keyof Q> = Parameters<
  Q[T]["formatter"]
>[0]

type QueryDataReturn<Q extends Queries<Q>, T extends keyof Q> = ReturnType<
  QueryTypeOf<Q, T, "data">
>

type QueryPlaceholderDataReturn<
  Q extends Queries<Q>,
  T extends keyof Q,
> = ReturnType<QueryTypeOf<Q, T, "placeholder">>

type QueryFormatterReturn<Q extends Queries<Q>, T extends keyof Q> = ReturnType<
  QueryTypeOf<Q, T, "formatter">
>

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

  if (typeof opts.page !== "undefined" && typeof opts.limit !== "undefined") {
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
    O extends QueryDataOpts<Q, T>,
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
      typeof query["defaultOpts"] !== "undefined" &&
      typeof opts !== "undefined"
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      opts = deepmerge(query["defaultOpts"], opts as any) as any
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await query["data"](opts as any)) as any
  }

  const getPlaceholderData = async <
    T extends ConditionalKeys<Q, { data }>,
    O extends QueryPlaceholderDataOpts<Q, T>,
  >(
    id: T,
    opts: O = null
  ): Promise<QueryPlaceholderDataReturn<typeof queries, T>> => {
    if (typeof window !== "undefined") {
      throw new Error(
        "You should not call getPlaceholderData on the client. This is a server-only call."
      )
    }

    const query = queries?.[id]

    if (!query) {
      throw new Error(`Query with id '${id as string}' not found.`)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await query["placeholder"](opts as any)) as any
  }

  const formatData = <
    T extends ConditionalKeys<Q, { formatter }>,
    Input extends QueryFormatterInput<Q, T>,
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
    O extends QueryDataOpts<Q, T>,
  >(id: T, opts?: O): Promise<QueryFormatterReturn<Q, T>>

  async function getData<
    T extends ConditionalKeys<Q, { data }>,
    O extends QueryDataOpts<Q, T>,
  >(id: T, opts?: O): Promise<QueryDataReturn<Q, T>>

  async function getData<
    T extends ConditionalKeys<Q, { placeholder }>,
    O extends QueryPlaceholderDataOpts<Q, T>,
  >(id: T, opts?: O): Promise<QueryPlaceholderDataReturn<Q, T>>

  async function getData(id, opts = null) {
    const query = queries?.[id]

    if (!query) {
      throw new Error(`Query with id '${id as string}' not found.`)
    }

    // Try to get the raw data if defined.
    if (query["data"]) {
      const rawData = await getRawData(id, opts)

      // Format the data using the query formatter.
      return query["formatter"] ? formatData(id, rawData) : rawData
    }

    // Otherwise fallback to placeholder.
    if (query["placeholder"]) {
      return await getPlaceholderData(id, opts)
    }

    throw new Error(`No data or placeholder defined for query with id '${id}'.`)
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
    getParams: <
      T extends ConditionalKeys<Q, { params }>,
      O extends QueryParamsOpts<Q, T>,
    >(
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
    getPlaceholderData,
    getData,
    formatData,
  }
}
