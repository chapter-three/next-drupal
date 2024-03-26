import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { NextDrupalBase } from "../../src"
import { BASE_URL, mocks } from "../utils"
import type {
  AccessToken,
  NextDrupalAuthAccessToken,
  NextDrupalAuthUsernamePassword,
  NextDrupalBaseOptions,
} from "../../src"

afterEach(() => {
  jest.restoreAllMocks()
})

describe("apiPrefix", () => {
  test("get apiPrefix", () => {
    const drupal = new NextDrupalBase(BASE_URL)
    expect(drupal.apiPrefix).toBe("")
  })
  test("set apiPrefix", () => {
    const drupal = new NextDrupalBase(BASE_URL)
    drupal.apiPrefix = "/api"
    expect(drupal.apiPrefix).toBe("/api")
  })
  test('set apiPrefix and prefixes with "/"', () => {
    const drupal = new NextDrupalBase(BASE_URL)
    drupal.apiPrefix = "api"
    expect(drupal.apiPrefix).toBe("/api")
  })
})

describe("auth", () => {
  describe("throws an error if invalid Basic Auth", () => {
    test("missing username", () => {
      expect(() => {
        const drupal = new NextDrupalBase(BASE_URL)
        // @ts-expect-error
        drupal.auth = {
          password: "password",
        }
      }).toThrow(
        "'username' and 'password' are required for auth. See https://next-drupal.org/docs/client/auth"
      )
    })

    test("missing password", () => {
      expect(() => {
        const drupal = new NextDrupalBase(BASE_URL)
        // @ts-expect-error
        drupal.auth = {
          username: "admin",
        }
      }).toThrow(
        "'username' and 'password' are required for auth. See https://next-drupal.org/docs/client/auth"
      )
    })
  })

  describe("throws an error if invalid Access Token", () => {
    test("missing access_token", () => {
      expect(() => {
        const drupal = new NextDrupalBase(BASE_URL)
        // @ts-expect-error
        drupal.auth = {
          token_type: mocks.auth.accessToken.token_type,
        }
      }).toThrow(
        "'access_token' and 'token_type' are required for auth. See https://next-drupal.org/docs/client/auth"
      )
    })

    test("missing token_type", () => {
      expect(() => {
        const drupal = new NextDrupalBase(BASE_URL)
        // @ts-expect-error
        drupal.auth = {
          access_token: mocks.auth.accessToken.access_token,
        }
      }).toThrow(
        "'access_token' and 'token_type' are required for auth. See https://next-drupal.org/docs/client/auth"
      )
    })
  })

  describe("throws an error if invalid Client ID/Secret", () => {
    test("missing clientId", () => {
      expect(() => {
        const drupal = new NextDrupalBase(BASE_URL)
        // @ts-expect-error
        drupal.auth = {
          clientSecret: mocks.auth.clientIdSecret.clientSecret,
        }
      }).toThrow(
        "'clientId' and 'clientSecret' are required for auth. See https://next-drupal.org/docs/client/auth"
      )
    })

    test("missing clientSecret", () => {
      expect(() => {
        const drupal = new NextDrupalBase(BASE_URL)
        // @ts-expect-error
        drupal.auth = {
          clientId: mocks.auth.clientIdSecret.clientId,
        }
      }).toThrow(
        "'clientId' and 'clientSecret' are required for auth. See https://next-drupal.org/docs/client/auth"
      )
    })
  })

  test("get auth", () => {
    const drupal = new NextDrupalBase(BASE_URL, {
      auth: mocks.auth.customAuthenticationHeader,
    })
    expect(drupal.auth).toBe(mocks.auth.customAuthenticationHeader)
  })

  test("sets Basic Auth", () => {
    const basicAuth: NextDrupalAuthUsernamePassword = {
      ...mocks.auth.basicAuth,
    }
    const drupal = new NextDrupalBase(BASE_URL)
    drupal.auth = basicAuth
    expect(drupal.auth).toMatchObject({ ...basicAuth })
  })

  test("sets Access Token", () => {
    const accessToken = {
      ...mocks.auth.accessToken,
    }
    const drupal = new NextDrupalBase(BASE_URL)
    drupal.auth = accessToken
    expect(drupal.auth).toMatchObject({ ...accessToken })
  })

  test("sets Client ID/Secret", () => {
    const clientIdSecret = {
      ...mocks.auth.clientIdSecret,
    }
    const drupal = new NextDrupalBase(BASE_URL)
    drupal.auth = clientIdSecret
    expect(drupal.auth).toMatchObject({ ...clientIdSecret })
  })

  test("sets auth function", () => {
    const authFunction = mocks.auth.callback
    const drupal = new NextDrupalBase(BASE_URL)
    drupal.auth = authFunction
    expect(drupal.auth).toBe(authFunction)
  })

  test("sets custom Authorization string", () => {
    const authString = `${mocks.auth.customAuthenticationHeader}`
    const drupal = new NextDrupalBase(BASE_URL)
    drupal.auth = authString
    expect(drupal.auth).toBe(authString)
  })

  test("sets a default access token url", () => {
    const clientIdSecret = {
      ...mocks.auth.clientIdSecret,
    }
    const drupal = new NextDrupalBase(BASE_URL)
    drupal.auth = clientIdSecret
    expect(drupal.auth.url).toBe("/oauth/token")
  })

  test("can override the default access token url", () => {
    const clientIdSecret = {
      ...mocks.auth.clientIdSecret,
      url: "/custom/oauth/token",
    }
    const drupal = new NextDrupalBase(BASE_URL)
    drupal.auth = clientIdSecret
    expect(drupal.auth.url).toBe("/custom/oauth/token")
  })
})

describe("headers", () => {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  } as NextDrupalBaseOptions["headers"]
  const expectedHeaders = {}
  Object.keys(headers).forEach((header) => {
    expectedHeaders[header.toLowerCase()] = headers[header]
  })

  test("get headers", () => {
    const drupal = new NextDrupalBase(BASE_URL, { headers })

    expect(Object.fromEntries(drupal.headers.entries())).toMatchObject(
      expectedHeaders
    )
  })

  test("set headers using key-value pairs", () => {
    const keyValuePairs = [
      ["Content-Type", headers["Content-Type"]],
      ["Accept", headers.Accept],
    ]

    const drupal = new NextDrupalBase(BASE_URL)
    drupal.headers = keyValuePairs

    expect(Object.fromEntries(drupal.headers.entries())).toMatchObject(
      expectedHeaders
    )
  })

  test("set headers using object literal", () => {
    const drupal = new NextDrupalBase(BASE_URL)

    drupal.headers = headers

    expect(Object.fromEntries(drupal.headers.entries())).toMatchObject(
      expectedHeaders
    )
  })

  test("set headers using Headers object", () => {
    const headersObject = new Headers()
    headersObject.set("Content-Type", headers["Content-Type"])
    headersObject.set("Accept", headers["Accept"])

    const drupal = new NextDrupalBase(BASE_URL)
    drupal.headers = headersObject

    expect(Object.fromEntries(drupal.headers.entries())).toMatchObject(
      expectedHeaders
    )
  })
})

describe("token", () => {
  test("get token", () => {
    const accessToken = {
      ...mocks.auth.accessToken,
    } as NextDrupalAuthAccessToken

    const drupal = new NextDrupalBase(BASE_URL)
    drupal.token = accessToken
    expect(drupal.token).toBe(accessToken)
  })

  test("set token", () => {
    function getExpiresOn(token: AccessToken): number {
      return Date.now() + token.expires_in * 1000
    }

    const accessToken = {
      ...mocks.auth.accessToken,
    } as NextDrupalAuthAccessToken
    const drupal = new NextDrupalBase(BASE_URL)

    const before = getExpiresOn(accessToken)
    drupal.token = accessToken
    const after = getExpiresOn(accessToken)

    expect(drupal.token).toBe(accessToken)
    expect(
      // @ts-expect-error
      drupal._tokenExpiresOn
    ).toBeGreaterThanOrEqual(before)
    expect(
      // @ts-expect-error
      drupal._tokenExpiresOn
    ).toBeLessThanOrEqual(after)
  })
})
