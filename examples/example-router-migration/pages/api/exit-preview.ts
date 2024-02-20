import { drupal } from "@/lib/drupal"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function exit(
  request: NextApiRequest,
  response: NextApiResponse
) {
  await drupal.previewDisable(request, response)
}
