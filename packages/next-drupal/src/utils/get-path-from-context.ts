import type { GetStaticPropsContext } from "next"

export function getPathFromContext(
  context: GetStaticPropsContext,
  prefix = ""
) {
  let { slug } = context.params

  slug = Array.isArray(slug)
    ? slug.map((s) => encodeURIComponent(s)).join("/")
    : slug

  // Handle locale.
  if (context.locale && context.locale !== context.defaultLocale) {
    slug = `/${context.locale}/${slug}`
  }

  return !slug
    ? process.env.DRUPAL_FRONT_PAGE
    : prefix
    ? `${prefix}/${slug}`
    : slug
}
