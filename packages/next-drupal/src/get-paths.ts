import { GetStaticPathsContext } from "next"
import { getResourceCollection } from "./get-resource-collection"
import { JsonApiParams, Locale } from "./types"

export async function getPathsFromContext(
  type: string,
  context: GetStaticPathsContext,
  options: {
    params?: JsonApiParams
  } = {}
) {
  // Use sparse fieldset to expand max size.
  options.params = {
    [`fields[${type}]`]: "path",
    ...options?.params,
  }

  if (!context.locales?.length) {
    const resources = await getResourceCollection(type, {
      deserialize: true,
      ...options,
    })

    return buildPathsFromResources(resources)
  }

  const paths = await Promise.all(
    context.locales.flatMap(async (locale) => {
      const resources = await getResourceCollection(type, {
        deserialize: true,
        locale,
        defaultLocale: context.defaultLocale,
        ...options,
      })

      return buildPathsFromResources(resources, locale)
    })
  )

  return [].concat(...paths)
}

function buildPathsFromResources(resources, locale?: Locale) {
  return resources?.flatMap((resource) => {
    const slug =
      resource?.path?.alias === process.env.DRUPAL_FRONT_PAGE
        ? "/"
        : resource?.path?.alias

    const path = {
      params: {
        slug: `${slug?.replace(/^\/|\/$/g, "")}`.split("/"),
      },
    }

    if (locale) {
      path.params["locale"] = locale
    }

    return path
  })
}
