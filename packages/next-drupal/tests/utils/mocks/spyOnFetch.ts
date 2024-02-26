import { jest } from "@jest/globals"
import type { NextDrupalBase } from "../../../src"

interface SpyOnFetchParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseBody?: any
  throwErrorMessage?: string
  status?: number
  statusText?: string
  headers?: Record<string, string>
}

export function spyOnFetch({
  responseBody = null,
  throwErrorMessage = null,
  status = 200,
  statusText = "",
  headers = {},
}: SpyOnFetchParams = {}) {
  return jest.spyOn(global, "fetch").mockImplementation(
    fetchMockImplementation({
      responseBody,
      throwErrorMessage,
      status,
      statusText,
      headers,
    })
  )
}

export function spyOnFetchOnce({
  responseBody = null,
  throwErrorMessage = null,
  status = 200,
  statusText = "",
  headers = {},
}: SpyOnFetchParams) {
  return jest.spyOn(global, "fetch").mockImplementationOnce(
    fetchMockImplementation({
      responseBody,
      throwErrorMessage,
      status,
      statusText,
      headers,
    })
  )
}

export function spyOnDrupalFetch(
  drupal: NextDrupalBase,
  {
    responseBody = null,
    throwErrorMessage = null,
    status = 200,
    statusText = "",
    headers = {},
  }: SpyOnFetchParams = {}
) {
  return jest.spyOn(drupal, "fetch").mockImplementation(
    fetchMockImplementation({
      responseBody,
      throwErrorMessage,
      status,
      statusText,
      headers,
    })
  )
}

function fetchMockImplementation({
  responseBody = null,
  throwErrorMessage = null,
  status = 200,
  statusText = "",
  headers = {},
}: SpyOnFetchParams) {
  if (throwErrorMessage) {
    return async () => {
      throw new Error(throwErrorMessage)
    }
  }

  const hasTextResponse = typeof responseBody === "string"

  const mockedHeaders = new Headers(headers)
  if (!mockedHeaders.has("content-type")) {
    let contentType: string
    if (hasTextResponse) {
      contentType = "text/plain"
    } else if (
      responseBody?.data ||
      responseBody?.errors ||
      responseBody?.meta ||
      responseBody?.jsonapi
    ) {
      contentType = "application/vnd.api+json"
    } else {
      contentType = "application/json"
    }

    mockedHeaders.set("Content-type", contentType)
  }

  return async () =>
    new Response(
      hasTextResponse ? responseBody : JSON.stringify(responseBody || {}),
      {
        status,
        statusText,
        headers: mockedHeaders,
      }
    )
}
