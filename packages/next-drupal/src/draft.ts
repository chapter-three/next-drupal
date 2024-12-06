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

  const cookieStore = await cookies()
  const draftModeStore = await draftMode()
  // Enable Draft Mode by setting the cookie
  draftModeStore.enable()

  // Override the default SameSite=lax.
  // See https://github.com/vercel/next.js/issues/49927
  const draftModeCookie = cookieStore.get(DRAFT_MODE_COOKIE_NAME)
  if (draftModeCookie) {
    cookieStore.set({
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
  cookieStore.set({
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

export async function disableDraftMode() {
  const cookieStore = await cookies()
  const draftModeStore = await draftMode()
  cookieStore.delete(DRAFT_DATA_COOKIE_NAME)
  draftModeStore.disable()

  return new Response("Draft mode is disabled")
}

export interface DraftData {
  path?: string
  resourceVersion?: string
}

export async function getDraftData() {
  let data: DraftData = {}
  const cookieStore = await cookies()
  const draftModeStore = await draftMode()
  if (draftModeStore.isEnabled && cookieStore.has(DRAFT_DATA_COOKIE_NAME)) {
    data = JSON.parse(cookieStore.get(DRAFT_DATA_COOKIE_NAME)?.value || "{}")
  }

  return data
}
