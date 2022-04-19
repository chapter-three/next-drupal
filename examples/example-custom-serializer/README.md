# example-custom-serializer

An example showing how to use a custom serializer for deserializing JSON:API in Next.js for Drupal.

## Example

```ts
import { Experiment_DrupalClient as DrupalClient } from "next-drupal"
import { Deserializer } from "jsonapi-serializer"

const customSerializer = new Deserializer({
  keyForAttribute: "camelCase",
})

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    serializer: customSerializer,
  }
)
```

## Documentation

See https://next-drupal.org/docs/client/serializer

## License

Licensed under the [MIT license](https://github.com/chapter-three/next-drupal/blob/master/LICENSE).
