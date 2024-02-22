import { jest } from "@jest/globals"

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

  return async () =>
    new Response(JSON.stringify(responseBody || {}), {
      status,
      headers: {
        "content-type": "application/vnd.api+json",
        ...headers,
      },
    })
}
