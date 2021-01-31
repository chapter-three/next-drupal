import Image from "next/image"

import { Links } from "@/components/links"

export default function Feature({ section, ...props }) {
  return (
    <section py="6|12|32" bg={section.field_background_color} {...props}>
      <div variant="container">
        <div
          display="grid"
          gridAutoFlow="dense"
          col="1|1|2"
          gap="8|8|12"
          alignItems="center"
        >
          {section.field_media?.field_media_image && (
            <div
              colStart={`null|null|${
                section.field_media_position === "left" ? 1 : 2
              }`}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${section.field_media.field_media_image.uri.url}`}
                width="500"
                height="400"
                layout="intrinsic"
                objectFit="cover"
                sx={{
                  rounded: "lg",
                }}
              />
            </div>
          )}
          <div
            display="flex"
            flexDirection="column"
            alignItems="center|flex-start"
            textAlign="center|left"
          >
            {section.field_heading && (
              <h2 variant="heading.h1">{section.field_heading}</h2>
            )}
            {section.field_text?.processed && (
              <div
                variant="text.lead"
                mt="2"
                dangerouslySetInnerHTML={{
                  __html: section.field_text?.processed,
                }}
              />
            )}
            {section.field_link && <Links links={[section.field_link]} />}
          </div>
        </div>
      </div>
    </section>
  )
}
