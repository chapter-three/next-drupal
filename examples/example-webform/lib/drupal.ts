import { DrupalClient } from "next-drupal"

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    previewSecret: process.env.DRUPAL_PREVIEW_SECRET,
    auth: {
      clientId: process.env.DRUPAL_CLIENT_ID,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET,
      scope:
        "administrator developer site_builder content_administrator content_author content_editor user_administrator headless",
    },
    // @see https://github.com/vercel/next.js/discussions/32238
    // @see https://github.com/vercel/next.js/blob/d895a50abbc8f91726daa2d7ebc22c58f58aabbb/packages/next/server/api-utils/node.ts#L504
    forceIframeSameSiteCookie: process.env.NODE_ENV === "development",
  }
)
