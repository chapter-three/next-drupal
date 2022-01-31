import Head from "next/head"
import { useRouter } from "next/router"
import { DrupalMetatag } from "types/drupal"

import { absoluteURL } from "lib/utils/absolute-url"

interface MetaProps {
  title?: string
  path?: string
  tags?: DrupalMetatag[]
}

export function Meta({ title, tags }: MetaProps) {
  const router = useRouter()

  return (
    <Head>
      <meta
        name="description"
        content="A Next.js site powered by a Drupal backend. Built with paragraphs, views, menus and translations."
      />
      <link
        rel="canonical"
        href={absoluteURL(router.asPath !== "/" ? router.asPath : "")}
      />
      <meta property="og:image" content={absoluteURL("/images/meta.jpg")} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="600" />
      {tags?.length ? (
        tags.map((tag) =>
          tag.attributes.name === "title" ? (
            <title key={tag.attributes.name}>{tag.attributes.content}</title>
          ) : (
            <meta
              key={tag.attributes.name}
              name={tag.attributes.name}
              content={tag.attributes.content}
            />
          )
        )
      ) : (
        <title>{title} | Next.js for Drupal</title>
      )}
    </Head>
  )
}
