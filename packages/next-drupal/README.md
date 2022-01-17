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
