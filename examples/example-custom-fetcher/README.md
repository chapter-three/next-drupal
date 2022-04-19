# example-custom-fetcher

An example showing how to use a custom fetch adapter in Next.js for Drupal.

## Example

```ts
import { Experiment_DrupalClient as DrupalClient } from "next-drupal"
import crossFetch from "cross-fetch"

const fetcher = (url, options) => {
  const { withAuth, ...opts } = options

  if (withAuth) {
    // Make additional requests to fetch a bearer token
    // Or any other Authorization headers.
  }

  return crossFetch(url, {
    ...opts,
    // Pass in additional options. Example: agent.
  })
}

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    fetcher,
  }
)
```

## Documentation

See https://next-drupal.org/docs/client/fetcher

## License

Licensed under the [MIT license](https://github.com/chapter-three/next-drupal/blob/master/LICENSE).
