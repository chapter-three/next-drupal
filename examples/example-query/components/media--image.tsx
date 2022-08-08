import Image from "next/image"

import { MediaImage } from "types"

export interface MediaImageProps {
  media: MediaImage
}

export function MediaImage({ media }: MediaImageProps) {
  if (!media?.url) {
    return null
  }

  return (
    <Image
      src={media.url}
      width={media.width}
      height={media.height}
      layout="responsive"
      alt={media.alt}
    />
  )
}
