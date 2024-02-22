import { ArticleTeaser } from "@/components/drupal/ArticleTeaser"
import { Link } from "@/components/navigation/Link"
import { drupal } from "@/lib/drupal"
import type { Metadata } from "next"
import type { DrupalNode } from "next-drupal"

export const metadata: Metadata = {
  description: "A Next.js site powered by a Drupal backend.",
}

export default async function Home() {
  const nodes = await drupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      params: {
        "filter[status]": 1,
        "fields[node--article]": "title,path,field_image,uid,created",
        include: "field_image,uid",
        sort: "-created",
      },
    }
  )

  return (
    <>
      <h1 className="mb-2 text-6xl font-black leading-6">
        Latest Articles.
        <br />
        <small className="text-xl">
          <em>Using the App Router</em>
        </small>
      </h1>
      <p className="mb-10">
        Switch to{" "}
        <Link href="/pages-router" className="underline hover:text-blue-600">
          Pages Router
        </Link>
      </p>
      {nodes?.length ? (
        nodes.map((node) => (
          <div key={node.id}>
            <ArticleTeaser node={node} />
            <hr className="my-20" />
          </div>
        ))
      ) : (
        <p className="py-4">No nodes found</p>
      )}
    </>
  )
}
