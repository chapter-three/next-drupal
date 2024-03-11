import type {
  NextDrupalAuth,
  NextDrupalAuthClientIdSecret,
  NextDrupalAuthUsernamePassword,
  NextDrupalAuthAccessToken,
} from "./next-drupal-fetch"
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
}

export type DrupalClientAuth = NextDrupalAuth

export type DrupalClientAuthUsernamePassword = NextDrupalAuthUsernamePassword

export type DrupalClientAuthClientIdSecret = NextDrupalAuthClientIdSecret

export type DrupalClientAuthAccessToken = NextDrupalAuthAccessToken

export interface Serializer {
  deserialize: JsonDeserializer
}
