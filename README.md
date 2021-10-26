<div align="center">
  <img width="100%" alt="next-drupal" src="https://user-images.githubusercontent.com/124599/122514007-3ada9f80-d01c-11eb-8b33-2c33885bb683.jpg" />
  <h1>Next.js for Drupal</h1>
  <h3 align="center">Next-generation front end for your Drupal site.</h3>
</div>

<p align="center">
  <em>Warning: this project is in early beta.</em>
</p>

## Demo

- https://demo.next-drupal.org
- http://cms-drupal.vercel.app

## Documentation

https://next-drupal.org/docs

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
      {nodes?.length ? (
        nodes.map((node) => (
          <div key={node.id}>
            <h1>{node.title}</h1>
          </div>
        ))
      ) : null}
    </div>
  )
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<BlogPageProps>> {
  const type = await getResourceTypeFromContext(context)
  return {
    props: {
      nodes: await getResourceCollectionFromContext("node--article", context)
      revalidate: 60,
    },
  }
}
```

## Supporting organizations

Development sponsored by [Chapter Three](https://chapterthree.com)
