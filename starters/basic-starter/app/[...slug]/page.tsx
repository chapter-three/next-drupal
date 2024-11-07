import { drupal } from "@/lib/drupal"
import { notFound } from "next/navigation"
import { DrupalNode } from "next-drupal"

interface PageProps {
  params: {
    slug: string[]
  }
}

export default async function Page({ params }: PageProps) {
  const path = `/${params.slug.join("/")}`
  const pathData = await drupal.translatePath(path)

  if (!pathData || !pathData.entity) {
    notFound()
  }

  const tag = `${pathData.entity.type}:${pathData.entity.id}`

  const node = await drupal.getResource<DrupalNode>(pathData.entity.type, pathData.entity.id, {
    params: {
      include: "field_image,uid",
    },
    next: {
      revalidate: 3600,
      // tags: [tag],
    },
  })

  if (!node) {
    notFound()
  }

  return (
    <article>
      <h1>{node.title}</h1>
    </article>
  )
}
