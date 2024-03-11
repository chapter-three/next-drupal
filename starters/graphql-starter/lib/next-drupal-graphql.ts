// This is an example GraphQL implementation using NextDrupalFetch, a
// lower-level class that contains helper methods and no JSON:API methods.

import { NextDrupalFetch } from "next-drupal"
import type { BaseUrl, NextDrupalFetchOptions } from "next-drupal"

const DEFAULT_API_PREFIX = "/graphql"

export class NextDrupalGraphQL extends NextDrupalFetch {
  endpoint: string

  constructor(baseUrl: BaseUrl, options: NextDrupalFetchOptions = {}) {
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
}

type QueryPayload = {
  query: string
  variables?: Record<string, string>
}

type QueryJsonResponse<DataType> = {
  data?: DataType
  errors?: { message: string }[]
}
