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
        key="head_link_canonical"
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
          <title key="head_title">{`${title} | Next.js for Drupal`}</title>
          <meta
            key="head_meta_description"
            name="description"
            content="A Next.js blog powered by a Drupal backend."
          />
          <meta
            key="head_meta_og:image"
            property="og:image"
            content={`${process.env.NEXT_PUBLIC_BASE_URL}/images/meta.jpg`}
          />
          <meta key="head_meta_og:image:width" property="og:image:width" content="800" />
          <meta key="head_meta_og:image:height" property="og:image:height" content="600" />
        </>
      )}
    </Head>
  )
}
