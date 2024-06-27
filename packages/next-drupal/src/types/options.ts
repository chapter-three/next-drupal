import type { NextDrupalAuth } from "./next-drupal-base"

export type BaseUrl = string

export type Locale = string

export type PathPrefix = string

export interface FetchOptions extends RequestInit, JsonApiWithNextFetchOptions {
  withAuth?: boolean | NextDrupalAuth
}

export type JsonApiOptions = {
  deserialize?: boolean
  params?: JsonApiParams
} & JsonApiWithAuthOption &
  (
    | {
        locale: Locale
        defaultLocale: Locale
      }
    | {
        locale?: undefined
        defaultLocale?: never
      }
  )

export type JsonApiWithAuthOption = {
  withAuth?: boolean | NextDrupalAuth
}

export type JsonApiWithCacheOptions = {
  withCache?: boolean
  cacheKey?: string
}

export type JsonApiWithNextFetchOptions = {
  next?: NextFetchRequestConfig
}
// TODO: Properly type this.
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type JsonApiParams = Record<string, any>
