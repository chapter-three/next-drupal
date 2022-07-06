import { DrupalMedia } from "next-drupal"

import { MediaImage } from "components/media--image"

const mediaTypes = {
  "media--image": MediaImage,
}

export interface MediaProps {
  media: DrupalMedia
}

export function Media({ media, ...props }: MediaProps) {
  const Component = mediaTypes[media?.type]

  if (!media || !Component) {
    return null
  }

  return <Component media={media} {...props} />
}
