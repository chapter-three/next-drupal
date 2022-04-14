import { DrupalUser } from "next-drupal"

import { Author } from "types"
import { absoluteURL } from "lib/utils"

// This is a custom data formatter for converting a user--user to an author.
export function formatAuthor(user: DrupalUser): Author {
  return {
    id: user.id,
    name: user.display_name,
    picture: user.user_picture && {
      url: absoluteURL(user.user_picture.uri.url),
      alt: user.user_picture.resourceIdObjMeta.alt || user.display_name,
      title: user.user_picture.resourceIdObjMeta.alt || user.display_name,
    },
  }
}
