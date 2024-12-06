import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { Article } from "@/components/drupal/Article"
import { BasicPage } from "@/components/drupal/BasicPage"
import { drupal } from "@/lib/drupal"
import type { Metadata, ResolvingMetadata } from "next"
import type { DrupalArticle, DrupalPage, NodesPath } from "@/types"

async function getNode(slug: string[]) {
  const path = `/${slug.join("/")}`

  const data = await drupal.query<{
    route: { entity: DrupalArticle | DrupalPage }
  }>({
    query: `query ($path: String!){
      route(path: $path) {
        ... on RouteInternal {
          entity {
            ... on NodeArticle {
              __typename
              id
              title
              path
              author {
                name
              }
              body {
                processed
              }
              status
              created {
                time
              }
              image {
                width
                url
                height
              }
            }
            ... on NodePage {
              __typename
              id
              title
              path
              body {
                processed
              }
            }
          }
        }
      }
    }`,
    variables: {
      path,
    },
  })

  const resource = data?.route?.entity

  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path}`, {
      cause: "DrupalError",
    })
  }

  return resource
}

type NodePageParams = {
  slug: string[]
}
type NodePageProps = {
  params: NodePageParams
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params: { slug } }: NodePageProps,
  _: ResolvingMetadata
): Promise<Metadata> {
  let node
  try {
    node = await getNode(slug)
  } catch (e) {
    // If we fail to fetch the node, don't return any metadata.
    return {}
  }

  return {
    title: node.title,
  }
}

export async function generateStaticParams(): Promise<NodePageParams[]> {
  // Fetch the paths for the first 50 articles and pages.
  // We'll fall back to on-demand generation for the rest.
  const data = await drupal.query<{
    nodeArticles: NodesPath
    nodePages: NodesPath
  }>({
    query: `query {
      nodeArticles(first: 50) {
        nodes {
          path,
        }
      }
      nodePages(first: 50) {
        nodes {
          path,
        }
      }
    }`,
  })

  return [
    ...(data?.nodeArticles?.nodes as { path: string }[]),
    ...(data?.nodePages?.nodes as { path: string }[]),
  ].map(({ path }) => ({ slug: path.split("/").filter(Boolean) }))
}

export default async function Page({ params: { slug } }: NodePageProps) {
  const isDraftMode = (await draftMode()).isEnabled

  let node
  try {
    node = await getNode(slug)
  } catch (error) {
    // If getNode throws an error, tell Next.js the path is 404.
    notFound()
  }

  // If we're not in draft mode and the resource is not published, return a 404.
  if (!isDraftMode && node?.status === false) {
    notFound()
  }

  return (
    <>
      {node.__typename === "NodePage" && <BasicPage node={node} />}
      {node.__typename === "NodeArticle" && <Article node={node} />}
    </>
  )
}
