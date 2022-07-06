import { DrupalClient } from "next-drupal"
import { Deserializer } from "jsonapi-serializer"

// next-drupal uses the jsona deserializer for data formatting by default.
// We can pass in our own data serializer.
const customSerializer = new Deserializer({
  // This will change field_name to fieldName,
  keyForAttribute: "camelCase",
})

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    serializer: customSerializer,
  }
)
