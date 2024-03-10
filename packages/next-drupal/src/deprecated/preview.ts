import { getResourceByPath } from "./get-resource"
import type { NextApiRequest, NextApiResponse } from "next"
import type { JsonApiWithLocaleOptions } from "../types/deprecated"

interface PreviewOptions {
  errorMessages?: {
    secret?: string
    slug?: string
  }
}

export function DrupalPreview(options?: PreviewOptions) {
  return (request, response) => PreviewHandler(request, response, options)
}

export async function PreviewHandler(
  request?: NextApiRequest,
  response?: NextApiResponse,
  options?: PreviewOptions
) {
  const { path, resourceVersion, secret, locale, defaultLocale } = request.query

  if (secret !== process.env.DRUPAL_PREVIEW_SECRET) {
    return response.status(401).json({
      message: options?.errorMessages.secret || "Invalid preview secret.",
    })
  }

  if (!path) {
    return response
      .status(401)
      .end({ message: options?.errorMessages.slug || "Invalid slug." })
  }

  let _options: GetResourcePreviewUrlOptions = {
    isVersionable: typeof resourceVersion !== "undefined",
  }
  if (locale && defaultLocale) {
    _options = {
      ..._options,
      locale: locale as string,
      defaultLocale: defaultLocale as string,
    }
  }

  const url = await getResourcePreviewUrl(path as string, _options)

  if (!url) {
    response
      .status(404)
      .end({ message: options?.errorMessages.slug || "Invalid slug" })
  }

  response.setPreviewData({
    resourceVersion,
  })

  response.writeHead(307, { Location: url })

  return response.end()
}

type GetResourcePreviewUrlOptions = JsonApiWithLocaleOptions & {
  isVersionable?: boolean
}

export async function getResourcePreviewUrl(
  slug: string,
  options?: GetResourcePreviewUrlOptions
) {
  const entity = await getResourceByPath(slug, options)

  if (!entity) {
    return null
  }

  if (!entity?.path) {
    throw new Error(
      `Error: the path attribute is missing for entity type ${entity.type}`
    )
  }

  return entity?.default_langcode
    ? entity.path.alias
    : `/${entity.path.langcode}${entity.path.alias}`
}
