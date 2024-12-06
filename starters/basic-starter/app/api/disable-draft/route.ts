import { disableDraftMode } from "next-drupal/draft"
import type { NextRequest } from "next/server"

export async function GET(_: NextRequest) {
  return await disableDraftMode()
}
