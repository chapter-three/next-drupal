import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals"
import { cookies, draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"
import {
  DRAFT_DATA_COOKIE_NAME,
  DRAFT_MODE_COOKIE_NAME,
  NextDrupalBase,
} from "../../src"
import { BASE_URL, spyOnFetch } from "../utils"
import {
  disableDraftMode,
  enableDraftMode,
  getDraftData,
} from "../../src/draft"
import { resetNextHeaders } from "../__mocks__/next/headers"
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"

jest.mock("next/headers")
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}))

beforeEach(() => {
  resetNextHeaders()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe("enableDraftMode()", () => {
  const searchParams = new URLSearchParams({
    path: "/example",
    resourceVersion: "id:1",
    plugin: "simple_oauth",
    secret: "very-secret-key",
  })
  const validationPayload = {
    path: "/example",
    maxAge: 30,
  }
  const request = new NextRequest(
    `https://example.com/api/draft?${searchParams}`
  )
  const drupal = new NextDrupalBase(BASE_URL)
  const draftModeCookie: ResponseCookie = {
    name: DRAFT_MODE_COOKIE_NAME,
    value: "some-secret-key",
    sameSite: "lax",
  }

  test("does not enable draft mode if validation fails", async () => {
    spyOnFetch({ responseBody: { message: "fail" }, status: 500 })

    const response = await enableDraftMode(request, drupal)

    expect((await draftMode()).enable).not.toHaveBeenCalled()
    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(500)
  })

  test("enables draft mode", async () => {
    spyOnFetch({ responseBody: validationPayload })

    await enableDraftMode(request, drupal)

    expect((await draftMode()).enable).toHaveBeenCalled()
  })

  test("updates draft mode cookie’s sameSite flag", async () => {
    spyOnFetch({ responseBody: validationPayload })

    // Our mock draftMode().enable does not set a cookie, so we set one.
    ;(await cookies()).set(draftModeCookie)

    expect((await cookies()).get(DRAFT_MODE_COOKIE_NAME).sameSite).toBe("lax")
    expect((await cookies()).get(DRAFT_MODE_COOKIE_NAME).secure).toBeFalsy()

    await enableDraftMode(request, drupal)

    expect((await cookies()).get(DRAFT_MODE_COOKIE_NAME).sameSite).toBe("none")
    expect((await cookies()).get(DRAFT_MODE_COOKIE_NAME).secure).toBe(true)
  })

  test("sets a draft data cookie", async () => {
    spyOnFetch({ responseBody: validationPayload })
    expect((await cookies()).get(DRAFT_DATA_COOKIE_NAME)).toBe(undefined)

    await enableDraftMode(request, drupal)

    const cookie = (await cookies()).get(DRAFT_DATA_COOKIE_NAME)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { secret, plugin, ...data } = Object.fromEntries(
      searchParams.entries()
    )
    expect(cookie).toMatchObject({
      name: DRAFT_DATA_COOKIE_NAME,
      sameSite: "none",
      secure: true,
      value: JSON.stringify(data),
    })
  })

  test("redirects to the given path", async () => {
    spyOnFetch({ responseBody: validationPayload })

    await enableDraftMode(request, drupal)

    expect(redirect).toHaveBeenCalledWith(searchParams.get("path"))
  })
})

describe("disableDraftMode()", () => {
  test("draft data cookie was deleted", async () => {
    await disableDraftMode()

    expect(cookies).toHaveBeenCalledTimes(1)
    expect((await cookies()).delete).toHaveBeenCalledWith(
      DRAFT_DATA_COOKIE_NAME
    )
  })

  test("draft mode was disabled", async () => {
    // First ensure draft mode is enabled.

    ;(await draftMode()).enable()
    expect((await draftMode()).isEnabled).toBe(true)

    await disableDraftMode()
    expect((await draftMode()).disable).toHaveBeenCalledTimes(1)
    expect((await draftMode()).isEnabled).toBe(false)
  })

  test("returns a response object", async () => {
    const response = await disableDraftMode()

    expect(response).toBeInstanceOf(Response)
    expect(response.ok).toBe(true)
    expect(await response.text()).toBe("Draft mode is disabled")
  })
})

describe("getDraftData()", () => {
  const draftData = {
    path: "/example",
    resourceVersion: "id:1",
  }
  const draftDataCookie: ResponseCookie = {
    name: DRAFT_DATA_COOKIE_NAME,
    value: JSON.stringify(draftData),
    sameSite: "none",
    secure: true,
  }

  test("returns empty object if draft mode disabled", async () => {
    ;(await cookies()).set(draftDataCookie)

    const data = await getDraftData()
    expect((await draftMode()).isEnabled).toBe(false)
    expect((await cookies()).has).toHaveBeenCalledTimes(0)
    expect((await cookies()).get).toHaveBeenCalledTimes(0)
    expect(data).toMatchObject({})
  })

  test("returns empty object if no draft data cookie", async () => {
    ;(await draftMode()).enable()
    draftMode.mockClear()

    const data = await getDraftData()
    expect(draftMode).toHaveBeenCalledTimes(1)
    expect((await draftMode()).isEnabled).toBe(true)
    expect((await cookies()).has).toHaveBeenCalledWith(DRAFT_DATA_COOKIE_NAME)
    expect((await cookies()).has).toHaveBeenCalledTimes(1)
    expect((await cookies()).get).toHaveBeenCalledTimes(0)
    expect(data).toMatchObject({})
  })

  test("returns empty object if no draft data cookie value", async () => {
    ;(await cookies()).set({
      ...draftDataCookie,
      value: "",
    })
    ;(await draftMode()).enable()
    draftMode.mockClear()

    const data = await getDraftData()
    expect(draftMode).toHaveBeenCalledTimes(1)
    expect((await draftMode()).isEnabled).toBe(true)
    expect((await cookies()).has).toHaveBeenCalledWith(DRAFT_DATA_COOKIE_NAME)
    expect((await cookies()).has).toHaveBeenCalledTimes(1)
    expect((await cookies()).get).toHaveBeenCalledWith(DRAFT_DATA_COOKIE_NAME)
    expect((await cookies()).get).toHaveBeenCalledTimes(1)
    expect(data).toMatchObject({})
  })

  test("returns the JSON.parse()d data", async () => {
    ;(await cookies()).set(draftDataCookie)
    ;(await draftMode()).enable()

    expect(await getDraftData()).toMatchObject(draftData)
  })
})
