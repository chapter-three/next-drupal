import type { TJsonaModel } from "jsona/lib/JsonaTypes"
import type { NextDrupalBaseOptions } from "./next-drupal-base"

export type NextDrupalOptions = NextDrupalBaseOptions & {
  /**
   * Override the default cache.
   *
   * * **Default value**: `node-cache`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#cache)
   */
  cache?: DataCache

  /**
   * Override the default data deserializer. You can use this to add your own JSON:API data deserializer.
   *
   * * **Default value**: `(new jsona()).deserialize`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#deserializer)
   */
  deserializer?: JsonDeserializer

  /**
   * If set to true, JSON:API errors are thrown in non-production environments. The errors are shown in the Next.js overlay.
   *
   * **Default value**: `true`
   * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#throwjsonapierrors)
   */
  throwJsonApiErrors?: boolean

  /**
   * By default, the client will make a request to JSON:API to retrieve the endpoint url. You can turn this off and use the default endpoint from the resource name.
   *
   * * **Default value**: `true`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#usedefaultendpoints)
   */
  useDefaultEndpoints?: boolean
}

export type JsonDeserializer = (
  body: Record<string, unknown>,
  options?: Record<string, unknown>
) => TJsonaModel | TJsonaModel[]

export interface DataCache {
  get(key): Promise<unknown>

  set(key, value, ttl?: number): Promise<unknown>

  del?(keys): Promise<unknown>
}
