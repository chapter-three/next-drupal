import { drupal } from "@/lib/drupal"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function preview(
  request: NextApiRequest,
  response: NextApiResponse
) {
  await drupal.preview(request, response)
}
