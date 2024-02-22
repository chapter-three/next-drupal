import Head from "next/head"
import { useRouter } from "next/router"
import { DrupalMetatag } from "types/drupal"

interface MetaProps {
  title?: string
  path?: string
  tags?: DrupalMetatag[]
}

export function Meta({ title, tags }: MetaProps) {
  const router = useRouter()

  return (
    <Head>
      <link
        key="canonical_link"
        rel="canonical"
        href={`${process.env.NEXT_PUBLIC_BASE_URL}${
          router.asPath !== "/" ? router.asPath : ""
        }`}
      />
      {tags?.length ? (
        tags.map((tag, index) => {
          if (tag.attributes.rel === "canonical") {
            return null
          }

          if (tag.attributes.name === "title") {
            return (
              <title key={tag.attributes.name}>{tag.attributes.content}</title>
            )
          }
          const Tag = tag.tag as keyof JSX.IntrinsicElements
          return <Tag key={index} {...tag.attributes}></Tag>
        })
      ) : (
        <>
          <title>{`${title} | Next.js for Drupal`}</title>
          <meta
            key="description"
            name="description"
            content="A Next.js blog powered by a Drupal backend."
          />
          <meta
            key="og_image"
            property="og:image"
            content={`${process.env.NEXT_PUBLIC_BASE_URL}/images/meta.jpg`}
          />
          <meta key="og_image_width" property="og:image:width" content="800" />
          <meta
            key="og_image_height"
            property="og:image:height"
            content="600"
          />
        </>
      )}
    </Head>
  )
}
