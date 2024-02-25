import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { DrupalClient } from "../../src"
import {
  BASE_URL,
  mockLogger,
  mocks,
  spyOnFetch,
  spyOnFetchOnce,
} from "../utils"
import type { AccessToken, DrupalClientAuth } from "../../src"

afterEach(() => {
  jest.restoreAllMocks()
})

describe("fetch()", () => {
  const defaultInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
  }
  const mockUrl = "https://example.com/mock-url"
  const authHeader = mocks.auth.customAuthenticationHeader

  test("uses global fetch by default", async () => {
    const logger = mockLogger()
    const client = new DrupalClient(BASE_URL, {
      debug: true,
      logger,
    })
    const mockResponseBody = { success: true }
    const mockUrl = "https://example.com/mock-url"
    const mockInit = {
      priority: "high",
    }
    const fetchSpy = spyOnFetch({ responseBody: mockResponseBody })

    const response = await client.fetch(mockUrl, mockInit)

    expect(fetchSpy).toBeCalledTimes(1)
    expect(fetchSpy).toBeCalledWith(
      mockUrl,
      expect.objectContaining({
        ...defaultInit,
        ...mockInit,
      })
    )
    expect(response.headers.get("content-type")).toEqual(
      "application/vnd.api+json"
    )
    expect(await response.json()).toMatchObject(mockResponseBody)
    expect(logger.debug).toHaveBeenLastCalledWith(
      `Using default fetch, fetching: ${mockUrl}`
    )
  })

  test("allows for custom fetcher", async () => {
    const logger = mockLogger()
    const customFetch = jest.fn()

    const client = new DrupalClient(BASE_URL, {
      fetcher: customFetch,
      debug: true,
      logger,
    })
    const mockUrl = "https://example.com/mock-url"
    const mockInit = {
      priority: "high",
    }

    await client.fetch(mockUrl, mockInit)

    expect(customFetch).toBeCalledTimes(1)
    expect(customFetch).toHaveBeenCalledWith(
      mockUrl,
      expect.objectContaining({
        ...mockInit,
        ...defaultInit,
      })
    )
    expect(logger.debug).toHaveBeenLastCalledWith(
      `Using custom fetcher, fetching: ${mockUrl}`
    )
  })

  test("allows setting custom headers", async () => {
    const customFetch = jest.fn()
    const constructorHeaders = {
      constructor: "header",
      Accept: "application/set-from-constructor",
    }
    const paramHeaders = {
      params: "header",
      Accept: "application/set-from-params",
    }
    const client = new DrupalClient(BASE_URL, {
      fetcher: customFetch,
      headers: constructorHeaders,
    })

    const url = "http://example.com"

    await client.fetch(url, {
      headers: paramHeaders,
    })

    expect(customFetch).toHaveBeenLastCalledWith(
      url,
      expect.objectContaining({
        ...defaultInit,
        headers: {
          ...constructorHeaders,
          ...paramHeaders,
        },
      })
    )
  })

  test("does not add Authorization header by default", async () => {
    const fetcher = jest.fn()
    const client = new DrupalClient(BASE_URL, {
      auth: authHeader,
      fetcher,
    })

    await client.fetch(mockUrl)

    expect(fetcher).toHaveBeenLastCalledWith(
      mockUrl,
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.anything(),
        }),
      })
    )
  })

  test("optionally adds Authorization header from constructor", async () => {
    const fetcher = jest.fn()
    const client = new DrupalClient(BASE_URL, {
      auth: authHeader,
      fetcher,
    })

    await client.fetch(mockUrl, { withAuth: true })

    expect(fetcher).toHaveBeenLastCalledWith(
      mockUrl,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: authHeader,
        }),
      })
    )
  })

  test("optionally adds Authorization header from init", async () => {
    const fetcher = jest.fn()
    const client = new DrupalClient(BASE_URL, {
      fetcher,
    })

    await client.fetch(mockUrl, { withAuth: authHeader })

    expect(fetcher).toHaveBeenLastCalledWith(
      mockUrl,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: authHeader,
        }),
      })
    )
  })
})

describe("getAccessToken()", () => {
  const accessToken = mocks.auth.accessToken
  const clientIdSecret = mocks.auth.clientIdSecret

  test("uses the long-lived access token from constructor", async () => {
    const longLivedAccessToken: AccessToken = {
      ...accessToken,
      expires_in: 360000,
    }
    const client = new DrupalClient(BASE_URL, {
      accessToken: longLivedAccessToken,
    })
    const fetchSpy = spyOnFetch({
      responseBody: {
        ...accessToken,
        access_token: "not-used",
      },
    })

    const token = await client.getAccessToken({
      clientId: "",
      clientSecret: "",
      scope: undefined,
    })
    expect(fetchSpy).toHaveBeenCalledTimes(0)
    expect(token).toBe(longLivedAccessToken)
  })

  test("throws if auth is not configured", async () => {
    const fetchSpy = spyOnFetch({
      responseBody: accessToken,
    })

    const client = new DrupalClient(BASE_URL)

    await expect(
      // @ts-ignore
      client.getAccessToken({ clientId: clientIdSecret.clientId })
    ).rejects.toThrow(
      "auth is not configured. See https://next-drupal.org/docs/client/auth"
    )
    expect(fetchSpy).toHaveBeenCalledTimes(0)
  })

  test("throws if auth is not ClientIdSecret", async () => {
    const fetchSpy = spyOnFetch({
      responseBody: accessToken,
    })

    const client = new DrupalClient(BASE_URL, {
      auth: mocks.auth.basicAuth,
      withAuth: true,
    })

    await expect(
      // @ts-ignore
      client.getAccessToken()
    ).rejects.toThrow(
      "'clientId' and 'clientSecret' required. See https://next-drupal.org/docs/client/auth"
    )
    expect(fetchSpy).toHaveBeenCalledTimes(0)
  })

  test("fetches an access token", async () => {
    spyOnFetch({
      responseBody: accessToken,
    })

    const logger = mockLogger()
    const client = new DrupalClient(BASE_URL, {
      auth: clientIdSecret,
      debug: true,
      logger,
    })

    const token = await client.getAccessToken()
    expect(token).toEqual(accessToken)
    expect(logger.debug).toHaveBeenCalledWith("Fetching new access token.")
  })

  test("re-uses access token", async () => {
    spyOnFetchOnce({
      responseBody: accessToken,
    })
    const fetchSpy = spyOnFetchOnce({
      responseBody: {
        ...accessToken,
        access_token: "differentAccessToken",
        expires_in: 1800,
      },
    })

    const logger = mockLogger()
    const client = new DrupalClient(BASE_URL, {
      auth: clientIdSecret,
      debug: true,
      logger,
    })

    const token1 = await client.getAccessToken()
    const token2 = await client.getAccessToken()
    expect(token1).toEqual(accessToken)
    expect(token1).toEqual(token2)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using existing access token."
    )
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })
})

describe("getAuthorizationHeader()", () => {
  const accessToken = mocks.auth.accessToken
  const basicAuth = mocks.auth.basicAuth
  const basicAuthHeader = `Basic ${Buffer.from(
    `${basicAuth.username}:${basicAuth.password}`
  ).toString("base64")}`
  const clientIdSecret = mocks.auth.clientIdSecret
  const authCallback = mocks.auth.callback
  const authHeader = mocks.auth.customAuthenticationHeader

  test("returns Basic Auth", async () => {
    const auth: DrupalClientAuth = basicAuth
    const logger = mockLogger()
    const client = new DrupalClient(BASE_URL, {
      auth: "is not used",
      debug: true,
      logger,
    })

    const header = await client.getAuthorizationHeader(auth)

    expect(header).toBe(basicAuthHeader)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using basic authorization header."
    )
  })

  test("returns Client Id/Secret", async () => {
    const auth: DrupalClientAuth = clientIdSecret
    const logger = mockLogger()
    const client = new DrupalClient(BASE_URL, {
      auth: "is not used",
      debug: true,
      logger,
    })
    jest
      .spyOn(client, "getAccessToken")
      .mockImplementation(async () => accessToken)

    const header = await client.getAuthorizationHeader(auth)

    expect(header).toBe(`Bearer ${accessToken.access_token}`)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using access token authorization header retrieved from Client Id/Secret."
    )
  })

  test("returns Access Token", async () => {
    const auth: DrupalClientAuth = accessToken
    const logger = mockLogger()
    const client = new DrupalClient(BASE_URL, {
      auth: "is not used",
      debug: true,
      logger,
    })

    const header = await client.getAuthorizationHeader(auth)

    expect(header).toBe(`${auth.token_type} ${auth.access_token}`)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using access token authorization header."
    )
  })

  test("returns auth header", async () => {
    const logger = mockLogger()
    const client = new DrupalClient(BASE_URL, {
      auth: "is not used",
      debug: true,
      logger,
    })

    const header = await client.getAuthorizationHeader(authHeader)

    expect(header).toBe(authHeader)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using custom authorization header."
    )
  })

  test("returns result of auth callback", async () => {
    const auth: DrupalClientAuth = jest.fn(authCallback)
    const logger = mockLogger()
    const client = new DrupalClient(BASE_URL, {
      auth: "is not used",
      debug: true,
      logger,
    })

    const header = await client.getAuthorizationHeader(auth)

    expect(header).toBe(authCallback())
    expect(auth).toBeCalledTimes(1)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using custom authorization callback."
    )
  })

  test("throws an error if auth is undefined", async () => {
    const auth = undefined
    const client = new DrupalClient(BASE_URL, {
      auth: "is not used",
    })

    await expect(client.getAuthorizationHeader(auth)).rejects.toThrow(
      "auth is not configured. See https://next-drupal.org/docs/client/auth"
    )
  })

  test("throws an error if auth is unrecognized", async () => {
    const auth = {
      username: "admin",
      token_type: "Bearer",
    }
    const client = new DrupalClient(BASE_URL, {
      auth: "is not used",
    })

    // @ts-ignore
    await expect(client.getAuthorizationHeader(auth)).rejects.toThrow(
      "auth is not configured. See https://next-drupal.org/docs/client/auth"
    )
  })
})
