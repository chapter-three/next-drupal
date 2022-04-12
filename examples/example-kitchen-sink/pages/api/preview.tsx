import { NextApiRequest, NextApiResponse } from "next"

import { drupal } from "lib/drupal"

export default async function (
  request: NextApiRequest,
  response: NextApiResponse
) {
  return drupal.preview(request, response)
}
