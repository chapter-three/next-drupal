import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { NextDrupalBase } from "../../src"
import { DEBUG_MESSAGE_PREFIX, logger as defaultLogger } from "../../src/logger"
import { BASE_URL, mocks } from "../utils"
import type { NextDrupalAuth, Logger } from "../../src"

afterEach(() => {
  jest.restoreAllMocks()
})

describe("baseUrl parameter", () => {
  const env = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...env }
  })

  afterEach(() => {
    process.env = env
  })

  test("throws error given an invalid baseUrl", () => {
    expect(
      () =>
        // @ts-expect-error
        new NextDrupalBase()
    ).toThrow("The 'baseUrl' param is required.")

    expect(
      () =>
        // @ts-expect-error
        new NextDrupalBase({})
    ).toThrow("The 'baseUrl' param is required.")
  })

  test("announces debug mode when turned on", () => {
    const consoleSpy = jest.spyOn(console, "debug").mockImplementation(() => {
      //
    })

    new NextDrupalBase(BASE_URL, {
      debug: true,
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      DEBUG_MESSAGE_PREFIX,
      "Debug mode is on."
    )
  })

  test("returns a NextDrupalBase", () => {
    expect(new NextDrupalBase(BASE_URL)).toBeInstanceOf(NextDrupalBase)
  })
})

describe("options parameter", () => {
  describe("accessToken", () => {
    test("defaults to `undefined`", () => {
      const drupal = new NextDrupalBase(BASE_URL)
      expect(drupal.accessToken).toBe(undefined)
    })

    test("sets the accessToken", async () => {
      const accessToken = mocks.auth.accessToken

      const drupal = new NextDrupalBase(BASE_URL, {
        accessToken,
      })

      expect(drupal.accessToken).toEqual(accessToken)
    })
  })

  describe("apiPrefix", () => {
    test("defaults to empty string", () => {
      const drupal = new NextDrupalBase(BASE_URL)
      expect(drupal.apiPrefix).toBe("")
    })

    test("sets the apiPrefix", () => {
      const customEndPoint = "/customapi"
      const drupal = new NextDrupalBase(BASE_URL, {
        apiPrefix: customEndPoint,
      })
      expect(drupal.apiPrefix).toBe(customEndPoint)
    })
  })

  describe("auth", () => {
    test("defaults to `undefined`", () => {
      const drupal = new NextDrupalBase(BASE_URL)
      expect(drupal.auth).toBe(undefined)
    })

    test("sets the auth credentials", () => {
      const auth: NextDrupalAuth = {
        username: "example",
        password: "pw",
      }
      const drupal = new NextDrupalBase(BASE_URL, {
        auth,
      })
      expect(drupal.auth).toMatchObject({
        ...auth,
      })
    })
  })

  describe("debug", () => {
    test("defaults to `false`", () => {
      const consoleSpy = jest.spyOn(console, "debug").mockImplementation(() => {
        //
      })

      new NextDrupalBase(BASE_URL)

      expect(consoleSpy).toBeCalledTimes(0)
    })

    test("turns on debug mode", () => {
      const consoleSpy = jest.spyOn(console, "debug").mockImplementation(() => {
        //
      })

      new NextDrupalBase(BASE_URL, { debug: true })

      expect(consoleSpy).toBeCalledTimes(1)
    })
  })

  describe("fetcher", () => {
    test("defaults to `undefined`", () => {
      const drupal = new NextDrupalBase(BASE_URL)
      expect(drupal.fetcher).toBe(undefined)
    })

    test("sets up a custom fetcher", () => {
      const customFetcher: NextDrupalBase["fetcher"] = async () => {
        //
      }
      const drupal = new NextDrupalBase(BASE_URL, {
        fetcher: customFetcher,
      })
      expect(drupal.fetcher).toBe(customFetcher)
    })
  })

  describe("headers", () => {
    test("defaults to `Content-Type`/`Accept`", () => {
      const drupal = new NextDrupalBase(BASE_URL)
      expect(Object.fromEntries(drupal.headers.entries())).toMatchObject({
        "content-type": "application/json",
        accept: "application/json",
      })
    })

    test("sets custom headers", () => {
      const customHeaders = {
        CustomContentType: "application/vnd.api+json",
        CustomAccept: "application/vnd.api+json",
      }
      const expectedHeaders = {}
      Object.keys(customHeaders).forEach((header) => {
        expectedHeaders[header.toLowerCase()] = customHeaders[header]
      })

      const drupal = new NextDrupalBase(BASE_URL, {
        headers: customHeaders,
      })

      expect(Object.fromEntries(drupal.headers.entries())).toMatchObject(
        expectedHeaders
      )
    })
  })

  describe("logger", () => {
    test("defaults to `console`-based `Logger`", () => {
      const drupal = new NextDrupalBase(BASE_URL)
      expect(drupal.logger).toBe(defaultLogger)
    })

    test("sets up a custom logger", () => {
      const customLogger: Logger = {
        log: () => {
          //
        },
        debug: () => {
          //
        },
        warn: () => {
          //
        },
        error: () => {
          //
        },
      }

      const drupal = new NextDrupalBase(BASE_URL, {
        logger: customLogger,
      })
      expect(drupal.logger).toBe(customLogger)
    })
  })

  describe("withAuth", () => {
    test("defaults to `false`", () => {
      const drupal = new NextDrupalBase(BASE_URL)
      expect(drupal.withAuth).toBe(false)
    })

    test("can be set to `true`", () => {
      const drupal = new NextDrupalBase(BASE_URL, {
        withAuth: true,
      })
      expect(drupal.withAuth).toBe(true)
    })
  })
})
