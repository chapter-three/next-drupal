import { drupal } from "@/lib/drupal"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function draft(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // Enables Preview mode and Draft mode.
  await drupal.preview(request, response, { enable: true })
}
