import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { FetchOptions, NextDrupalBase } from "../../src"
import {
  BASE_URL,
  mockLogger,
  mocks,
  spyOnFetch,
  spyOnFetchOnce,
} from "../utils"
import type {
  AccessToken,
  NextDrupalAuth,
  NextDrupalBaseOptions,
} from "../../src"

afterEach(() => {
  jest.restoreAllMocks()
})

describe("fetch()", () => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
  const defaultInit = {
    credentials: "include",
    headers: new Headers(headers),
  }
  const mockUrl = "https://example.com/mock-url"
  const authHeader = mocks.auth.customAuthenticationHeader

  test("uses global fetch by default", async () => {
    const logger = mockLogger()
    const drupal = new NextDrupalBase(BASE_URL, {
      debug: true,
      logger,
    })
    const mockResponseBody = { success: true }
    const mockUrl = "https://example.com/mock-url"
    const mockInit = {
      priority: "high",
    } as FetchOptions
    const fetchSpy = spyOnFetch({ responseBody: mockResponseBody, headers })

    const response = await drupal.fetch(mockUrl, mockInit)

    expect(fetchSpy).toBeCalledTimes(1)
    expect(fetchSpy).toBeCalledWith(
      mockUrl,
      expect.objectContaining({
        ...defaultInit,
        ...mockInit,
      })
    )
    expect(response.headers.get("content-type")).toEqual("application/json")
    expect(await response.json()).toMatchObject(mockResponseBody)
    expect(logger.debug).toHaveBeenLastCalledWith(
      `Using default fetch, fetching: ${mockUrl}`
    )
  })

  test("allows for custom fetcher", async () => {
    const logger = mockLogger()
    const customFetch = jest.fn()

    const drupal = new NextDrupalBase(BASE_URL, {
      fetcher: customFetch,
      debug: true,
      logger,
    })
    const mockUrl = "https://example.com/mock-url"
    const mockInit = {
      priority: "high",
    } as FetchOptions

    await drupal.fetch(mockUrl, mockInit)

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

  test("handles relative URLs", async () => {
    const drupal = new NextDrupalBase(BASE_URL)
    const mockResponseBody = { success: true }
    const mockUrl = "/mock-url"
    const fetchSpy = spyOnFetch({ responseBody: mockResponseBody, headers })

    await drupal.fetch(mockUrl)

    expect(fetchSpy).toBeCalledTimes(1)
    expect(fetchSpy).toBeCalledWith(
      `${BASE_URL}${mockUrl}`,
      expect.objectContaining({
        ...defaultInit,
      })
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
    const drupal = new NextDrupalBase(BASE_URL, {
      fetcher: customFetch,
      headers: constructorHeaders,
    })

    const url = "http://example.com"

    await drupal.fetch(url, {
      headers: paramHeaders,
    })

    expect(customFetch).toHaveBeenLastCalledWith(
      url,
      expect.objectContaining({
        ...defaultInit,
        headers: new Headers({
          ...constructorHeaders,
          ...paramHeaders,
        }),
      })
    )
  })

  test("does not add Authorization header by default", async () => {
    const fetcher: NextDrupalBaseOptions["fetcher"] = jest.fn()
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: authHeader,
      fetcher,
    })

    await drupal.fetch(mockUrl)

    expect(fetcher.mock.lastCall[0]).toBe(mockUrl)
    expect(fetcher.mock.lastCall[1]?.headers?.has("Authorization")).toBeFalsy()
  })

  test("optionally adds Authorization header from constructor", async () => {
    const fetcher: NextDrupalBaseOptions["fetcher"] = jest.fn()
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: authHeader,
      fetcher,
    })

    await drupal.fetch(mockUrl, { withAuth: true })

    expect(fetcher.mock.lastCall[0]).toBe(mockUrl)
    expect(fetcher.mock.lastCall[1]?.headers?.get("Authorization")).toBe(
      authHeader
    )
  })

  test("optionally adds Authorization header from init", async () => {
    const fetcher: NextDrupalBaseOptions["fetcher"] = jest.fn()
    const drupal = new NextDrupalBase(BASE_URL, {
      fetcher,
    })

    await drupal.fetch(mockUrl, { withAuth: authHeader })

    expect(fetcher.mock.lastCall[0]).toBe(mockUrl)
    expect(fetcher.mock.lastCall[1]?.headers?.get("Authorization")).toBe(
      authHeader
    )
  })

  test("optionally adds Next revalidate options", async () => {
    const drupal = new NextDrupalBase(BASE_URL)
    const mockUrl = "/mock-url"
    const mockInit = {
      next: { revalidate: 60 },
    } as FetchOptions

    const fetchSpy = spyOnFetch()

    await drupal.fetch(mockUrl, mockInit)

    expect(fetchSpy).toBeCalledTimes(1)
    expect(fetchSpy).toBeCalledWith(
      `${BASE_URL}${mockUrl}`,
      expect.objectContaining({
        ...defaultInit,
        ...mockInit,
      })
    )
  })

  test("optionally adds cache option", async () => {
    const drupal = new NextDrupalBase(BASE_URL)
    const mockUrl = "/mock-url"
    const mockInit = {
      cache: "no-store",
    } as FetchOptions

    const fetchSpy = spyOnFetch()

    await drupal.fetch(mockUrl, mockInit)

    expect(fetchSpy).toBeCalledTimes(1)
    expect(fetchSpy).toBeCalledWith(
      `${BASE_URL}${mockUrl}`,
      expect.objectContaining({
        ...defaultInit,
        ...mockInit,
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
      access_token: `LONG${accessToken.access_token}`,
      expires_in: accessToken.expires_in * 1000,
    }
    const drupal = new NextDrupalBase(BASE_URL, {
      accessToken: longLivedAccessToken,
    })
    const fetchSpy = spyOnFetch({
      responseBody: accessToken,
    })

    const token = await drupal.getAccessToken(clientIdSecret)
    expect(fetchSpy).toHaveBeenCalledTimes(0)
    expect(token).toBe(longLivedAccessToken)
  })

  test("throws if auth is not configured", async () => {
    const fetchSpy = spyOnFetch({
      responseBody: accessToken,
    })

    const drupal = new NextDrupalBase(BASE_URL)

    await expect(drupal.getAccessToken()).rejects.toThrow(
      "auth is not configured. See https://next-drupal.org/docs/client/auth"
    )
    expect(fetchSpy).toHaveBeenCalledTimes(0)
  })

  test("throws if auth is not ClientIdSecret", async () => {
    const errorMessage =
      "'clientId' and 'clientSecret' required. See https://next-drupal.org/docs/client/auth"
    const fetchSpy = spyOnFetch({
      responseBody: accessToken,
    })

    const drupal = new NextDrupalBase(BASE_URL, {
      auth: mocks.auth.basicAuth,
      withAuth: true,
    })

    await expect(drupal.getAccessToken()).rejects.toThrow(errorMessage)
    expect(fetchSpy).toHaveBeenCalledTimes(0)

    await expect(
      drupal.getAccessToken(
        // @ts-expect-error
        { clientId: clientIdSecret.clientId }
      )
    ).rejects.toThrow(errorMessage)
    expect(fetchSpy).toHaveBeenCalledTimes(0)
  })

  test("fetches an access token", async () => {
    spyOnFetch({
      responseBody: accessToken,
    })

    const logger = mockLogger()
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: clientIdSecret,
      debug: true,
      logger,
    })

    const token = await drupal.getAccessToken()
    expect(token).toEqual(accessToken)
    expect(logger.debug).toHaveBeenCalledWith("Fetching new access token.")
  })

  test("re-uses an access token", async () => {
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
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: clientIdSecret,
      debug: true,
      logger,
    })

    const token1 = await drupal.getAccessToken()
    const token2 = await drupal.getAccessToken()

    expect(token1).toEqual(accessToken)
    expect(token2).toEqual(token1)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using existing access token."
    )
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  test("uses the default auth url", async () => {
    const fetchSpy = spyOnFetch({
      responseBody: accessToken,
    })

    const drupal = new NextDrupalBase(BASE_URL, {
      auth: clientIdSecret,
    })

    const token = await drupal.getAccessToken()

    expect(token).toEqual(accessToken)
    expect(fetchSpy.mock?.lastCall?.[0]).toBe(`${BASE_URL}/oauth/token`)
  })

  test("uses a custom auth url from constructor", async () => {
    const fetchSpy = spyOnFetch({
      responseBody: accessToken,
    })

    const drupal = new NextDrupalBase(BASE_URL, {
      auth: { ...clientIdSecret, url: "/custom/token" },
    })

    const token = await drupal.getAccessToken()

    expect(token).toEqual(accessToken)
    expect(fetchSpy.mock?.lastCall?.[0]).toBe(`${BASE_URL}/custom/token`)
  })

  test("uses a custom auth url from arguments", async () => {
    const fetchSpy = spyOnFetch({
      responseBody: accessToken,
    })

    const drupal = new NextDrupalBase(BASE_URL, {
      auth: { ...clientIdSecret, url: "/different/token" },
    })

    const token = await drupal.getAccessToken({
      ...clientIdSecret,
      url: "/custom/token",
    })
    expect(token).toEqual(accessToken)
    expect(fetchSpy.mock?.lastCall?.[0]).toBe(`${BASE_URL}/custom/token`)
  })

  test("uses the scope from constructor", async () => {
    spyOnFetch({
      responseBody: accessToken,
    })

    const logger = mockLogger()
    const scope = "admin"
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: { ...clientIdSecret, scope },
      debug: true,
      logger,
    })

    const token = await drupal.getAccessToken()
    expect(token).toEqual(accessToken)
    expect(logger.debug).toHaveBeenCalledWith("Fetching new access token.")
    expect(logger.debug).toHaveBeenCalledWith(`Using scope: ${scope}`)
  })

  test("uses the scope from arguments", async () => {
    spyOnFetch({
      responseBody: accessToken,
    })

    const logger = mockLogger()
    const scope = "admin"
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: {
        clientId: "not-used",
        clientSecret: "not-used",
        scope: "not-used",
        expires_in: 3600,
      },
      debug: true,
      logger,
    })

    const token = await drupal.getAccessToken({ ...clientIdSecret, scope })

    expect(token).toEqual(accessToken)
    expect(logger.debug).toHaveBeenCalledWith("Fetching new access token.")
    expect(logger.debug).toHaveBeenCalledWith(`Using scope: ${scope}`)
  })

  test("re-uses an access token if scope matches", async () => {
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
    const scope = "admin"
    const drupal = new NextDrupalBase(BASE_URL, {
      debug: true,
      logger,
    })

    const token1 = await drupal.getAccessToken({ ...clientIdSecret, scope })
    const token2 = await drupal.getAccessToken({ ...clientIdSecret, scope })

    expect(token1).toEqual(accessToken)
    expect(token2).toEqual(token1)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using existing access token."
    )
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  test("does not re-use an access token if scope does not match", async () => {
    spyOnFetchOnce({
      responseBody: accessToken,
    })
    const differentToken = {
      ...accessToken,
      access_token: "differentAccessToken",
      expires_in: 1800,
    }
    const fetchSpy = spyOnFetchOnce({
      responseBody: differentToken,
    })

    const logger = mockLogger()
    const scope = "admin"
    const drupal = new NextDrupalBase(BASE_URL, {
      debug: true,
      logger,
    })

    const token1 = await drupal.getAccessToken({ ...clientIdSecret, scope })
    const token2 = await drupal.getAccessToken({
      ...clientIdSecret,
      scope: "differs",
    })

    expect(token1).toEqual(accessToken)
    expect(token2).toEqual(differentToken)
    expect(logger.debug).not.toHaveBeenCalledWith(
      "Using existing access token."
    )
    expect(fetchSpy).toHaveBeenCalledTimes(2)
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
    const auth: NextDrupalAuth = basicAuth
    const logger = mockLogger()
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: "is not used",
      debug: true,
      logger,
    })

    const header = await drupal.getAuthorizationHeader(auth)

    expect(header).toBe(basicAuthHeader)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using basic authorization header."
    )
  })

  test("returns Client Id/Secret", async () => {
    const auth: NextDrupalAuth = clientIdSecret
    const logger = mockLogger()
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: "is not used",
      debug: true,
      logger,
    })
    jest
      .spyOn(drupal, "getAccessToken")
      .mockImplementation(async () => accessToken)

    const header = await drupal.getAuthorizationHeader(auth)

    expect(header).toBe(`Bearer ${accessToken.access_token}`)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using access token authorization header retrieved from Client Id/Secret."
    )
  })

  test("returns Access Token", async () => {
    const auth: NextDrupalAuth = accessToken
    const logger = mockLogger()
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: "is not used",
      debug: true,
      logger,
    })

    const header = await drupal.getAuthorizationHeader(auth)

    expect(header).toBe(`${auth.token_type} ${auth.access_token}`)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using access token authorization header."
    )
  })

  test("returns auth header", async () => {
    const logger = mockLogger()
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: "is not used",
      debug: true,
      logger,
    })

    const header = await drupal.getAuthorizationHeader(authHeader)

    expect(header).toBe(authHeader)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using custom authorization header."
    )
  })

  test("returns result of auth callback", async () => {
    const auth: NextDrupalAuth = jest.fn(authCallback)
    const logger = mockLogger()
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: "is not used",
      debug: true,
      logger,
    })

    const header = await drupal.getAuthorizationHeader(auth)

    expect(header).toBe(authCallback())
    expect(auth).toBeCalledTimes(1)
    expect(logger.debug).toHaveBeenLastCalledWith(
      "Using custom authorization callback."
    )
  })

  test("throws an error if auth is undefined", async () => {
    const auth = undefined
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: "is not used",
    })

    await expect(drupal.getAuthorizationHeader(auth)).rejects.toThrow(
      "auth is not configured. See https://next-drupal.org/docs/client/auth"
    )
  })

  test("throws an error if auth is unrecognized", async () => {
    const auth = {
      username: "admin",
      token_type: "Bearer",
    }
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: "is not used",
    })

    await expect(
      drupal.getAuthorizationHeader(
        // @ts-expect-error
        auth
      )
    ).rejects.toThrow(
      "auth is not configured. See https://next-drupal.org/docs/client/auth"
    )
  })
})
