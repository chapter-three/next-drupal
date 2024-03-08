import { jest } from "@jest/globals"
import type { NextDrupalBase } from "../../../src"

interface SpyOnFetchParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseBody?: any
  throwErrorMessage?: string
  status?: number
  headers?: Record<string, string>
}

export function spyOnFetch({
  responseBody = null,
  throwErrorMessage = null,
  status = 200,
  headers = {},
}: SpyOnFetchParams = {}) {
  return jest.spyOn(global, "fetch").mockImplementation(
    fetchMockImplementation({
      responseBody,
      throwErrorMessage,
      status,
      headers,
    })
  )
}

export function spyOnFetchOnce({
  responseBody = null,
  throwErrorMessage = null,
  status = 200,
  headers = {},
}: SpyOnFetchParams) {
  return jest.spyOn(global, "fetch").mockImplementationOnce(
    fetchMockImplementation({
      responseBody,
      throwErrorMessage,
      status,
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
    headers = {},
  }: SpyOnFetchParams = {}
) {
  return jest.spyOn(drupal, "fetch").mockImplementation(
    fetchMockImplementation({
      responseBody,
      throwErrorMessage,
      status,
      headers,
    })
  )
}

function fetchMockImplementation({
  responseBody = null,
  throwErrorMessage = null,
  status = 200,
  headers = {},
}: SpyOnFetchParams) {
  if (throwErrorMessage) {
    return async () => {
      throw new Error(throwErrorMessage)
    }
  }

  const mockedHeaders = new Headers(headers)
  if (!mockedHeaders.has("content-type")) {
    mockedHeaders.set("content-type", "application/vnd.api+json")
  }

  return async () =>
    new Response(JSON.stringify(responseBody || {}), {
      status,
      headers: mockedHeaders,
    })
}
