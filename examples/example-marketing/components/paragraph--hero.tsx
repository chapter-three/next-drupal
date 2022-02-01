import classNames from "classnames"

import { ParagraphProps } from "components/paragraph"
import { MediaImage } from "components/media--image"
import { SectionHeader } from "components/section-header"

export function ParagraphHero({ paragraph, ...props }: ParagraphProps) {
  return (
    <section
      data-cy="paragraph-hero"
      className={classNames(
        "pt-8 md:pt-12 lg:pt-20",
        paragraph.field_media?.field_media_image
          ? "pb-0 md:pb-0 border-b"
          : "pb-8 md:pb-12 lg:pb-20"
      )}
      {...props}
    >
      <SectionHeader
        level={1}
        heading={paragraph.field_heading}
        text={paragraph.field_text?.processed}
        links={paragraph.field_links}
      />
      <div className="container px-6 mx-auto">
        {paragraph.field_media && (
          <div className="w-full h-40 mt-6 overflow-hidden sm:rounded-t-xl md:mt-12 lg:mt-20 md:h-56 lg:h-80">
            <MediaImage
              media={paragraph.field_media}
              objectFit="cover"
              priority
            />
          </div>
        )}
      </div>
    </section>
  )
}
