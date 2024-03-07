import type {
  NextDrupalAuth,
  NextDrupalAuthClientIdSecret,
  NextDrupalAuthUsernamePassword,
  NextDrupalAuthAccessToken,
} from "./next-drupal-base"
import type { JsonDeserializer, NextDrupalOptions } from "./next-drupal"

export type DrupalClientOptions = NextDrupalOptions & {
  /**
   * Override the default data serializer. You can use this to add your own JSON:API data deserializer.
   *
   * * **Default value**: `jsona`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/client/configuration#serializer)
   */
  serializer?: Serializer

  /**
   * By default, the client will make a request to JSON:API to retrieve the endpoint url. You can turn this off and use the default endpoint based on the resource name.
   *
   * * **Default value**: `false`
   * * **Required**: *No*
   *
   * [Documentation](https://next-drupal.org/docs/configuration#usedefaultresourcetypeentry)
   */
  useDefaultResourceTypeEntry?: boolean
}

export type DrupalClientAuth = NextDrupalAuth

export type DrupalClientAuthUsernamePassword = NextDrupalAuthUsernamePassword

export type DrupalClientAuthClientIdSecret = NextDrupalAuthClientIdSecret

export type DrupalClientAuthAccessToken = NextDrupalAuthAccessToken

export interface Serializer {
  deserialize: JsonDeserializer
}
