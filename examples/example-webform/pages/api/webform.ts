import { NextApiRequest, NextApiResponse } from "next"
import { drupal } from "../../lib/drupal"
import { WebformDefaultApiRoute } from "nextjs-drupal-webform"

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return WebformDefaultApiRoute(request, response, drupal)
}
