# example-graphql

An example showing how to use `next-drupal` with GraphQL.

## Usage

```ts
// 1️⃣ - Create a new DrupalClient.
import { DrupalClient } from "next-drupal"

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    auth: {
      clientId: process.env.DRUPAL_CLIENT_ID,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET,
    },
  }
)

// 2️⃣ - Build your /graphql endpoint
const graphqlUrl = drupal.buildUrl("/graphql")

// 3️⃣ - Make a request
const response = await drupal.fetch(graphqlUrl.toString(), {
  method: "POST",
  withAuth: true, // Make authenticated requests using OAuth.
  body: JSON.stringify({
    query: `
      query {
        nodeArticles(first: 10) {
          nodes {
            id
            title
          }
        }
      }
    `,
  }),
})

const { data } = await response.json()
```

## License

Licensed under the [MIT license](https://github.com/chapter-three/next-drupal/blob/master/LICENSE).
