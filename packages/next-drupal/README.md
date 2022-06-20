<div align="center">
  <img width="100%" alt="Next.js for drupal" src="https://next-drupal.org/images/meta.jpg" />
  <h1>Next.js for Drupal</h1>
  <h3 align="center">Next-generation front end for your Drupal site.</h3>
</div>

## Demo

https://demo.next-drupal.org

## Documentation

https://next-drupal.org

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchapter-three%2Fnext-drupal-basic-starter&env=NEXT_PUBLIC_DRUPAL_BASE_URL,NEXT_IMAGE_DOMAIN,DRUPAL_PREVIEW_SECRET,DRUPAL_CLIENT_ID,DRUPAL_CLIENT_SECRET&envDescription=Learn%20more%20about%20environment%20variables&envLink=https%3A%2F%2Fnext-drupal.org%2Fdocs%2Fenvironment-variables&project-name=next-drupal&demo-title=Next.js%20for%20Drupal&demo-description=A%20next-generation%20front-end%20for%20your%20Drupal%20site.&demo-url=https%3A%2F%2Fdemo.next-drupal.org&demo-image=https%3A%2F%2Fnext-drupal.org%2Fimages%2Fdemo-screenshot.jpg)

## Example

A page with all "Article" nodes.

```jsx
import { DrupalClient } from "next-drupal"

const drupal = new DrupalClient("https://drupal.org")

export default function BlogPage({ articles }) {
  return (
    <div>
      {articles?.length
        ? nodes.map((node) => (
            <div key={node.id}>
              <h1>{node.title}</h1>
            </div>
          ))
        : null}
    </div>
  )
}

export async function getStaticProps(context) {
  const articles = await drupal.getResourceCollectionFromContext(
    "node--article",
    context
  )

  return {
    props: {
      articles,
    },
  }
}
```

## Supporting organizations

Development sponsored by [Chapter Three](https://chapterthree.com)
