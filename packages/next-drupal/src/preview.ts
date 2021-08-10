import { NextApiRequest, NextApiResponse } from "next"
import { getResourceByPath } from "./get-resource"
import { JsonApiWithLocaleOptions } from "./types"

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
  const { slug, resourceVersion, secret, locale, defaultLocale } = request.query

  if (secret !== process.env.DRUPAL_PREVIEW_SECRET) {
    return response.status(401).json({
      message: options?.errorMessages.secret || "Invalid preview secret.",
    })
  }

  if (!slug) {
    return response
      .status(401)
      .end({ message: options?.errorMessages.slug || "Invalid slug." })
  }

  let _options = {}
  if (locale && defaultLocale) {
    _options = {
      locale,
      defaultLocale,
    }
  }

  const url = await getResourcePreviewUrl(slug as string, _options)

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

export async function getResourcePreviewUrl(
  slug: string,
  options?: JsonApiWithLocaleOptions
) {
  const node = await getResourceByPath(slug, options)

  if (!node) {
    return null
  }

  return node?.default_langcode
    ? node.path.alias
    : `/${node.path.langcode}${node.path.alias}`
}
