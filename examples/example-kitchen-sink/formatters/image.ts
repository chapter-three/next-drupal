import { DrupalFile } from "next-drupal"

import { Image } from "types"
import { absoluteURL } from "lib/utils"

// This is a custom data formatter for converting a user--user to an author.
export function formatImage(file: DrupalFile): Image {
  return {
    url: absoluteURL(file?.uri.url),
    alt: file?.resourceIdObjMeta.alt,
    title: file?.resourceIdObjMeta.title,
  }
}
