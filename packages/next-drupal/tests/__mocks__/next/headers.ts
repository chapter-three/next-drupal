import type { CookieListItem } from "next/dist/compiled/@edge-runtime/cookies"

// Create nested mocks ahead of time instead of always creating new mocks when
// the cookies mock function is called.
export const cookies = jest.fn(() => cookiesObject)

const cookieStore = {}
const cookiesObject = {
  delete: jest.fn((name: string) => {
    delete cookieStore[name]
    return cookiesObject
  }),
  get: jest.fn((name: string) =>
    cookieStore[name]
      ? ({
          ...cookieStore[name],
        } as CookieListItem)
      : undefined
  ),
  getAll: jest.fn(
    () =>
      [
        ...Object.keys(cookieStore).map((name) => ({
          ...cookieStore[name],
        })),
      ] as CookieListItem[]
  ),
  has: jest.fn((name: string) => !!cookieStore[name]),
  set: jest.fn(
    ({
      name,
      value,
      expires,
      sameSite,
      secure,
      path,
      domain,
    }: CookieListItem) => {
      cookieStore[name] = {
        name,
        value,
        expires,
        sameSite,
        secure,
        path,
        domain,
      }
      return cookiesObject
    }
  ),
  toString: jest.fn(),
}

// Create nested mocks ahead of time instead of always creating new mocks when
// the draftMode mock function is called.
export const draftMode = jest.fn(() => ({
  disable,
  enable,
  isEnabled: draftModeEnabled,
}))

let draftModeEnabled = false
const disable = jest.fn(() => {
  draftModeEnabled = false
})
const enable = jest.fn(() => {
  draftModeEnabled = true
})

export function resetNextHeaders() {
  cookies.mockClear()
  cookiesObject.delete.mockClear()
  cookiesObject.get.mockClear()
  cookiesObject.getAll.mockClear()
  cookiesObject.has.mockClear()
  cookiesObject.set.mockClear()
  cookiesObject.toString.mockClear()
  Object.keys(cookieStore).forEach((key) => {
    delete cookieStore[key]
  })

  draftMode.mockClear()
  disable.mockClear()
  enable.mockClear()
  draftModeEnabled = false
}
