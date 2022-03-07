<div align="center">
  <img width="100%" alt="Next.js for drupal" src="https://next-drupal.org/images/meta.jpg" />
  <h1>Next.js for Drupal</h1>
  <h3 align="center">Next-generation front end for your Drupal site.</h3>
</div>

## Demo

- https://demo.next-drupal.org
- https://cms-drupal.vercel.app

## Documentation

https://next-drupal.org

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchapter-three%2Fnext-drupal-basic-starter&env=NEXT_PUBLIC_DRUPAL_BASE_URL,NEXT_IMAGE_DOMAIN,DRUPAL_CLIENT_SECRET,DRUPAL_CLIENT_ID,DRUPAL_PREVIEW_SECRET&envDescription=Connect%20Drupal&envLink=https%3A%2F%2Fnext-drupal.org%2Fdocs%2Fenvironment-variables&demo-title=Next.js%20for%20Drupal&demo-description=A%20statically%20generated%20site%20using%20Next.js%20and%20Drupal.&demo-url=https%3A%2F%2Fcms-drupal.vercel.app%2F)

## Example

A page with all "Article" nodes.

```tsx
import { getResourceCollectionFromContext, DrupalNode } from "next-drupal"

interface BlogPageProps {
  nodes: DrupalNode[]
}

export default function BlogPage({ nodes }: BlogPageProps) {
  return (
    <div>
      {nodes?.length
        ? nodes.map((node) => (
            <div key={node.id}>
              <h1>{node.title}</h1>
            </div>
          ))
        : null}
    </div>
  )
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<BlogPageProps>> {
  const nodes = await getResourceCollectionFromContext<DrupalNode[]>(
    "node--article",
    context
  )

  return {
    props: {
      nodes,
      revalidate: 60,
    },
  }
}
```

## Supporting organizations

Development sponsored by [Chapter Three](https://chapterthree.com)
