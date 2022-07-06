import { NextApiRequest, NextApiResponse } from "next"

import { drupal } from "lib/drupal"

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return await drupal.preview(request, response)
}
