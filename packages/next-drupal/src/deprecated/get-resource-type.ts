import { translatePathFromContext } from "./translate-path"
import type { GetStaticPropsContext } from "next"
import type { AccessToken } from "../types"

export async function getResourceTypeFromContext(
  context: GetStaticPropsContext,
  options?: {
    accessToken?: AccessToken
    prefix?: string
  }
): Promise<string> {
  try {
    const response = await translatePathFromContext(context, options)

    return response.jsonapi.resourceName
  } catch (error) {
    return null
  }
}
