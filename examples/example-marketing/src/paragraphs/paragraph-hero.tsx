import { Links } from "@/components/links"
import Image from "next/image"

export default function ParagraphHero({ paragraph, ...props }) {
  const heroImage = paragraph.field_media?.field_media_image

  return (
    <section
      pt="12|20"
      pb={heroImage ? 0 : "12|20"}
      borderBottomWidth={heroImage ? 1 : 0}
      {...props}
    >
      <div variant="container">
        <div textAlign="center">
          {paragraph.field_heading && (
            <h1 variant="heading.h1" minHeight="80px">
              {paragraph.field_heading}
            </h1>
          )}
          {paragraph.field_text?.processed && (
            <div
              variant="text.lead"
              mt="2"
              maxW="700"
              mx="auto"
              dangerouslySetInnerHTML={{
                __html: paragraph.field_text?.processed,
              }}
            />
          )}
          {paragraph.field_links && <Links links={paragraph.field_links} />}
          {heroImage && (
            <div
              w="full"
              h="40|56|80"
              mt="6|12|20"
              roundedTop="xl"
              overflow="hidden"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${heroImage.uri.url}`}
                alt={heroImage.resourceIdObjMeta.alt}
                width={1168}
                height={320}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
