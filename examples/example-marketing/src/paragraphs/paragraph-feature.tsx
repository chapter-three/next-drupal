import Image from "next/image"

import { Links } from "@/components/links"

export default function ParagraphFeature({ paragraph, ...props }) {
  return (
    <section py="12|32" bg={paragraph.field_background_color} {...props}>
      <div variant="container">
        <div
          display="grid"
          gridAutoFlow="dense"
          col="1|1|2"
          gap="8|8|12"
          alignItems="center"
        >
          {paragraph.field_media?.field_media_image && (
            <div
              colStart={`null|null|${
                paragraph.field_media_position === "left" ? 1 : 2
              }`}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${paragraph.field_media.field_media_image.uri.url}`}
                alt={
                  paragraph.field_media.field_media_image.resourceIdObjMeta.alt
                }
                width={500}
                height={400}
                layout="responsive"
                objectFit="cover"
                sx={{
                  borderRadius: "lg",
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
            {paragraph.field_heading && (
              <h2 variant="heading.h1">{paragraph.field_heading}</h2>
            )}
            {paragraph.field_text?.processed && (
              <div
                variant="text.lead"
                mt="2"
                dangerouslySetInnerHTML={{
                  __html: paragraph.field_text?.processed,
                }}
              />
            )}
            {paragraph.field_link && <Links links={[paragraph.field_link]} />}
          </div>
        </div>
      </div>
    </section>
  )
}
