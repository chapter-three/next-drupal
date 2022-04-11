import { drupal } from "lib/drupal"

export default async function (request, response) {
  return drupal.preview(request, response)
}
