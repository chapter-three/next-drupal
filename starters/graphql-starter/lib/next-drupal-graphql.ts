// This is an example GraphQL implementation using NextDrupalBase, a lower-level
// class that contains helper methods and no JSON:API methods.

import { NextDrupalBase } from "next-drupal"
import type {
  BaseUrl,
  EndpointSearchParams,
  NextDrupalBaseOptions,
} from "next-drupal"

const DEFAULT_API_PREFIX = "/graphql"

export class NextDrupalGraphQL extends NextDrupalBase {
  endpoint: string

  constructor(baseUrl: BaseUrl, options: NextDrupalBaseOptions = {}) {
    super(baseUrl, options)

    const { apiPrefix = DEFAULT_API_PREFIX } = options

    this.apiPrefix = apiPrefix

    this.endpoint = this.buildUrl(this.apiPrefix).toString()
  }

  async query<DataType>(payload: QueryPayload) {
    const response = await this.fetch(this.endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
      withAuth: true, // Make authenticated requests using OAuth.
    })

    if (!response?.ok) {
      throw new Error(response.statusText)
    }

    const { data, errors }: QueryJsonResponse<DataType> = await response.json()

    if (errors) {
      this.logger.log(errors)
      throw new Error(errors?.map((e) => e.message).join("\n") ?? "unknown")
    }

    return data
  }

  // Since the endpoint doesn't change (even with different locales), there's
  // no need to use this method; use NextDrupalGraphQL.query() directly.
  async buildEndpoint({
    searchParams,
  }: {
    searchParams?: EndpointSearchParams
  } = {}): Promise<string> {
    return this.buildUrl(this.apiPrefix, searchParams).toString()
  }
}

type QueryPayload = {
  query: string
  variables?: Record<string, string>
}

type QueryJsonResponse<DataType> = {
  data?: DataType
  errors?: { message: string }[]
}
