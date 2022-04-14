import { Unstable_DrupalClient as DrupalClient } from "next-drupal"
import { Deserializer } from "jsonapi-serializer"

// next-drupal uses the jsona deserialiser for data formatting by default.
// We can pass in our own data formatter.
const customFormatter = new Deserializer({
  // This will change field_name to fieldName,
  keyForAttribute: "camelCase",
})

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    formatter: customFormatter,
  }
)
