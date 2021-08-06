import { GetStaticPathsContext } from "next"
import { getResourceCollection } from "./get-resource-collection"
import { AccessToken, JsonApiParams, Locale } from "./types"

export async function getPathsFromContext(
  types: string | string[],
  context: GetStaticPathsContext,
  options: {
    params?: JsonApiParams
    accessToken?: AccessToken
  } = {}
) {
  if (typeof types === "string") {
    types = [types]
  }

  const paths = await Promise.all(
    types.map(async (type) => {
      // Use sparse fieldset to expand max size.
      options.params = {
        [`fields[${type}]`]: "path",
        ...options?.params,
      }

      // const paths = await Promise.all(
      //   context.locales.map(async (locale) => {
      //     const resources = await getResourceCollection(type, {
      //       deserialize: true,
      //       locale,
      //       defaultLocale: context.defaultLocale,
      //       ...options,
      //     })

      //     return buildPathsFromResources(resources, locale)
      //   })
      // )

      // return paths.flat()

      // Handle localized path aliases
      if (!context.locales?.length) {
        const resources = await getResourceCollection(type, {
          deserialize: true,
          ...options,
        })

        return buildPathsFromResources(resources)
      }

      const paths = await Promise.all(
        context.locales.map(async (locale) => {
          const resources = await getResourceCollection(type, {
            deserialize: true,
            locale,
            defaultLocale: context.defaultLocale,
            ...options,
          })

          return buildPathsFromResources(resources, locale)
        })
      )

      return paths.flat()
    })
  )

  return paths.flat()
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
      path["locale"] = locale
    }

    return path
  })
}
