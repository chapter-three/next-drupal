import Image, { ImageProps } from "next/image"

import { absoluteURL } from "lib/utils"
import { MediaProps } from "components/media"

interface MediaImageProps extends MediaProps, Partial<ImageProps> {}

export function MediaImage({
  media,
  layout = "responsive",
  objectFit,
  width,
  height,
  priority,
  ...props
}: MediaImageProps) {
  const image = media?.field_media_image

  if (!image?.uri) {
    return null
  }

  const sizeProps =
    layout === "fill"
      ? null
      : {
          width: width || image.resourceIdObjMeta.width,
          height: height || image.resourceIdObjMeta.height,
        }

  return (
    <div className="media__content image__wrapper" {...props}>
      <Image
        src={absoluteURL(image.uri.url)}
        layout={layout}
        objectFit={objectFit}
        alt={image.resourceIdObjMeta.alt || "Image"}
        title={image.resourceIdObjMeta.title}
        priority={priority}
        {...sizeProps}
      />
    </div>
  )
}
