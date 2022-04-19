# example-custom-auth

An example showing how to use basic auth for client authentication in Next.js for Drupal.

## Example

```ts
import { Experiment_DrupalClient as DrupalClient } from "next-drupal"

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    auth: () =>
      "Basic " +
      Buffer.from(
        `${process.env.BASIC_AUTH_USERNAME}:${process.env.BASIC_AUTH_PASSWORD}`
      ).toString("base64"),
  }
)
```

## Documentation

See https://next-drupal.org/docs/client/auth

## License

Licensed under the [MIT license](https://github.com/chapter-three/next-drupal/blob/master/LICENSE).
