import { DrupalBlock } from "next-drupal"
import Link from "next/link"
import { MediaImage } from "./media--image"

interface BlockBannerProps {
  block: DrupalBlock
}

export function BlockBanner({ block }: BlockBannerProps) {
  return (
    <div className="relative lg:max-h-[550px] overflow-hidden">
      <MediaImage media={block.field_media_image} priority />
      <div className="container inset-0 z-10 flex items-center lg:absolute">
        <div className="top-0 flex flex-col items-start space-y-4 lg:max-w-[40%] text-text px-0 py-6 lg:px-6 lg:text-white lg:border border-text lg:bg-black/40">
          <p className="font-serif text-[28px] leading-tight">
            {block.field_title}
          </p>
          {block.field_summary && (
            <p className="text-[19px] leading-snug">{block.field_summary}</p>
          )}
          {block.field_content_link && (
            <Link
              href={block.field_content_link.uri.replace("internal:", "")}
              passHref
              className="px-6 py-3 font-serif text-xl text-white transition-colors border-2 rounded-md bg-secondary hover:bg-white hover:text-black border-secondary"
            >
              {block.field_content_link.title}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
