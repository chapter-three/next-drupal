import { Links } from "@/components/links"
import Image from "next/image"

export default function Hero({ section, ...props }) {
  return (
    <section pt="12|20" borderBottomWidth="1" {...props}>
      <div variant="container">
        <div textAlign="center">
          {section.field_heading && (
            <h1 variant="heading.h1">{section.field_heading}</h1>
          )}
          {section.field_text?.processed && (
            <div
              variant="text.lead"
              mt="2"
              maxW="700"
              mx="auto"
              dangerouslySetInnerHTML={{
                __html: section.field_text?.processed,
              }}
            />
          )}
          {section.field_links && <Links links={section.field_links} />}
          {section.field_media?.field_media_image && (
            <div
              w="full"
              h="40|56|80"
              mt="6|12|20"
              roundedTop="xl"
              overflow="hidden"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${section.field_media.field_media_image.uri.url}`}
                width="1200"
                height="600"
                layout="intrinsic"
                objectFit="cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
