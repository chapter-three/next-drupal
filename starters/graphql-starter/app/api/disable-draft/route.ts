import { disableDraftMode } from "next-drupal/draft"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  return disableDraftMode()
}
