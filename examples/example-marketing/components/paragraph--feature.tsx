import Image from "next/image"
import classNames from "classnames"

import { absoluteURL } from "lib/utils/absolute-url"
import { Links } from "components/links"
import { FormattedText } from "components/formatted-text"
import { ParagraphProps } from "components/paragraph"
import { Section } from "components/section"

export function ParagraphFeature({ paragraph, ...props }: ParagraphProps) {
  return (
    <Section
      data-cy="paragraph-feature"
      backgroundColor={
        paragraph.field_background_color === "muted" && "bg-gray-50"
      }
      {...props}
    >
      <div className="container px-6 mx-auto">
        <div className="grid items-center gap-8 md:grid-flow-col-dense md:grid-cols-2 md:gap-12">
          {paragraph.field_media?.field_media_image && (
            <div
              className={classNames(
                paragraph.field_media_position === "left"
                  ? "md:col-start-1"
                  : "md:col-start-2"
              )}
            >
              <Image
                src={absoluteURL(
                  paragraph.field_media.field_media_image.uri.url
                )}
                alt={
                  paragraph.field_media.field_media_image.resourceIdObjMeta.alt
                }
                width={500}
                height={300}
                layout="responsive"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {paragraph.field_heading && (
              <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
                {paragraph.field_heading}
              </h2>
            )}
            <FormattedText
              className="max-w-md mt-4 text-lg font-light leading-relaxed text-gray-500 sm:text-xl lg:text-2xl"
              processed={paragraph.field_text.processed}
            />
            {paragraph.field_link && <Links links={[paragraph.field_link]} />}
          </div>
        </div>
      </div>
    </Section>
  )
}
