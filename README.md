<div align="center">
  <img width="100%" alt="next-drupal" src="https://user-images.githubusercontent.com/124599/122514007-3ada9f80-d01c-11eb-8b33-2c33885bb683.jpg" />
  <h1>Next.js for Drupal</h1>
  <h3 align="center">Next-generation front end for your Drupal site.</h3>
</div>

<p align="center">
  <a href="https://github.com/arshad/next-drupal/actions"><img src="https://github.com/arshad/next-drupal/workflows/Drupal/badge.svg" alt="Drupal"></a>
  <a href="https://github.com/arshad/next-mdx/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" /></a>
  <a href="https://twitter.com/arshadcn"><img src="https://img.shields.io/badge/Follow-%40arshadcn-1da1f2" alt="Follow @arshadcn" /></a>
</p>


<p align="center">
  <em>Warning: this project is in early beta.</em>
</p>

## Demo

- https://next-example-marketing.vercel.app
- http://cms-drupal.vercel.app

## Documentation

https://next-drupal.org/docs

## Example

A page with all "Article" nodes.

```tsx
import { getResourceCollectionFromContext } from "next-drupal"

export default function IndexPage({ articles }) {
  return (
    <div>
      {articles?.length ? (
        articles.map((node) => (
          <div key={node.id}>
            <h1>{node.title}</h1>
          </div>
        ))
      ) : null}
    </div>
  )
}

export async function getStaticProps(context) {
  return {
    props: {
      articles: await getResourceCollectionFromContext("node--article", context)
      revalidate: 60,
    },
  }
}
```

## Supporting organizations

Development sponsored by [Chapter Three](https://chapterthree.com)
