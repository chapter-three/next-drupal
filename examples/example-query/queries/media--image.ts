import { QueryFormatter } from "next-drupal-query"

import { MediaImage } from "types"
import { DrupalMediaImage } from "types/drupal"
import { absoluteUrl } from "lib/utils"

export const formatter: QueryFormatter<
  Partial<DrupalMediaImage>,
  MediaImage
> = (media) => {
  if (!media?.field_media_image) {
    return null
  }

  return {
    type: "media--image",
    id: media.id,
    url: absoluteUrl(media.field_media_image.uri?.url),
    alt: media.field_media_image.resourceIdObjMeta?.alt || null,
    width: media.field_media_image.resourceIdObjMeta?.width || 500,
    height: media.field_media_image.resourceIdObjMeta?.height || 500,
  }
}
