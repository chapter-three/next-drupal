import type { NextDrupalAuth } from "./next-drupal-base"

export type BaseUrl = string

export type Locale = string

export type PathPrefix = string

export interface FetchOptions extends RequestInit {
  withAuth?: boolean | NextDrupalAuth
}

/**
 * JSON:API Related Options
 */
export type JsonApiOptions = {
  /**
   * Set to false to return the raw JSON:API response.
   * */
  deserialize?: boolean
  /**
   * JSON:API params such as `filter`, `fields`, `include` or `sort`.
   */
  params?: JsonApiParams
} & JsonApiWithAuthOption &
  (
    | {
        /** The locale to fetch the resource in. */
        locale: Locale
        /** The default locale of the site. */
        defaultLocale: Locale
      }
    | {
        locale?: undefined
        defaultLocale?: never
      }
  )

export type JsonApiWithAuthOption = {
  /** Set to true to use the authentication method configured on the client. */
  withAuth?: boolean | NextDrupalAuth
}

export type JsonApiWithCacheOptions = {
  /** Set `withCache` if you want to store and retrieve the resource from cache. */
  withCache?: boolean
  /** The cache key to use. */
  cacheKey?: string
}

export type JsonApiWithNextFetchOptions = {
  next?: NextFetchRequestConfig
  cache?: RequestCache
}
// TODO: Properly type this.
/**
 * JSON:API params such as filter, fields, include or sort.
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type JsonApiParams = Record<string, any>
