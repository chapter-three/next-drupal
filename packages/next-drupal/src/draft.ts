import { cookies, draftMode } from "next/headers"
import { redirect } from "next/navigation"
import {
  DRAFT_DATA_COOKIE_NAME,
  DRAFT_MODE_COOKIE_NAME,
} from "./draft-constants"
import type { NextRequest } from "next/server"
import type { NextDrupalBase } from "./next-drupal-base"

export async function enableDraftMode(
  request: NextRequest,
  drupal: NextDrupalBase
): Promise<Response | never> {
  // Validate the draft request.
  const response = await drupal.validateDraftUrl(request.nextUrl.searchParams)

  // If validation fails, don't enable draft mode.
  if (!response.ok) {
    return response
  }

  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get("path")

  // Enable Draft Mode by setting the cookie
  draftMode().enable()

  // Override the default SameSite=lax.
  // See https://github.com/vercel/next.js/issues/49927
  const draftModeCookie = cookies().get(DRAFT_MODE_COOKIE_NAME)
  if (draftModeCookie) {
    cookies().set({
      ...draftModeCookie,
      sameSite: "none",
      secure: true,
    })
  }

  // Send Drupal's data to the draft-mode page.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { secret, scope, plugin, ...draftData } = Object.fromEntries(
    searchParams.entries()
  )
  cookies().set({
    ...draftModeCookie,
    name: DRAFT_DATA_COOKIE_NAME,
    sameSite: "none",
    secure: true,
    value: JSON.stringify(draftData),
  })

  // Redirect to the path from the fetched post. We can safely redirect to the
  // path since this has been validated on the server.
  redirect(path)
}

export function disableDraftMode() {
  cookies().delete(DRAFT_DATA_COOKIE_NAME)
  draftMode().disable()

  return new Response("Draft mode is disabled")
}

export interface DraftData {
  path?: string
  resourceVersion?: string
}

export function getDraftData() {
  let data: DraftData = {}

  if (draftMode().isEnabled && cookies().has(DRAFT_DATA_COOKIE_NAME)) {
    data = JSON.parse(cookies().get(DRAFT_DATA_COOKIE_NAME)?.value || "{}")
  }

  return data
}
