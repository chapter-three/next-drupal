import { SectionImage } from "types"
import { MediaImage } from "components/media--image"

export interface SectionImageProps {
  section: SectionImage
}

export function SectionImage({ section }: SectionImageProps) {
  return <MediaImage media={section.image} />
}
