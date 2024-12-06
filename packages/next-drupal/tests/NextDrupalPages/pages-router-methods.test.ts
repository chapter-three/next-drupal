import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { GetStaticPropsContext } from "next"
import { DRAFT_DATA_COOKIE_NAME, NextDrupalPages } from "../../src"
import {
  BASE_URL,
  mockLogger,
  mocks,
  spyOnDrupalFetch,
  spyOnFetch,
} from "../utils"
import type {
  DrupalNode,
  JsonApiResourceWithPath,
  NextDrupalAuth,
} from "../../src"
import { NextApiRequest, NextApiResponse } from "../__mocks__/next"
jest.setTimeout(10000)

afterEach(() => {
  jest.restoreAllMocks()
})

describe("buildStaticPathsFromResources()", () => {
  const resources: Pick<JsonApiResourceWithPath, "path">[] = [
    {
      path: {
        alias: "/blog/post/one",
        pid: 1,
        langcode: "en",
      },
    },
    {
      path: {
        alias: "/blog/post/two",
        pid: 2,
        langcode: "en",
      },
    },
  ]

  test("builds static paths from resources", () => {
    const drupal = new NextDrupalPages(BASE_URL)

    expect(drupal.buildStaticPathsFromResources(resources)).toMatchObject([
      {
        params: {
          slug: ["blog", "post", "one"],
        },
      },
      {
        params: {
          slug: ["blog", "post", "two"],
        },
      },
    ])

    expect(
      drupal.buildStaticPathsFromResources(resources, { locale: "es" })
    ).toMatchObject([
      {
        locale: "es",
        params: {
          slug: ["blog", "post", "one"],
        },
      },
      {
        locale: "es",
        params: {
          slug: ["blog", "post", "two"],
        },
      },
    ])
  })

  test("builds static paths from resources with pathPrefix", () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const paths = drupal.buildStaticPathsFromResources(resources, {
      pathPrefix: "blog",
    })

    const paths2 = drupal.buildStaticPathsFromResources(resources, {
      pathPrefix: "/blog",
    })

    const paths3 = drupal.buildStaticPathsFromResources(resources, {
      pathPrefix: "/blog/post",
      locale: "es",
    })

    const paths4 = drupal.buildStaticPathsFromResources(resources, {
      pathPrefix: "blog/post",
      locale: "es",
    })

    expect(paths).toMatchObject([
      {
        params: {
          slug: ["post", "one"],
        },
      },
      {
        params: {
          slug: ["post", "two"],
        },
      },
    ])
    expect(paths3).toMatchObject([
      {
        locale: "es",
        params: {
          slug: ["one"],
        },
      },
      {
        locale: "es",
        params: {
          slug: ["two"],
        },
      },
    ])

    expect(paths).toEqual(paths2)
    expect(paths3).toEqual(paths4)
  })

  test('converts frontPage path to "/"', () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const resources: Pick<JsonApiResourceWithPath, "path">[] = [
      {
        path: {
          alias: "/home",
          pid: 1,
          langcode: "en",
        },
      },
    ]

    expect(drupal.buildStaticPathsFromResources(resources)).toMatchObject([
      {
        params: {
          slug: [""],
        },
      },
    ])
  })
})

describe("buildStaticPathsParamsFromPaths()", () => {
  test("builds static paths from paths", () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const paths = ["/blog/post/one", "/blog/post/two", "/blog/post/three"]

    expect(drupal.buildStaticPathsParamsFromPaths(paths)).toMatchObject([
      {
        params: {
          slug: ["blog", "post", "one"],
        },
      },
      {
        params: {
          slug: ["blog", "post", "two"],
        },
      },
      {
        params: {
          slug: ["blog", "post", "three"],
        },
      },
    ])

    expect(
      drupal.buildStaticPathsParamsFromPaths(paths, { locale: "en" })
    ).toMatchObject([
      {
        locale: "en",
        params: {
          slug: ["blog", "post", "one"],
        },
      },
      {
        locale: "en",
        params: {
          slug: ["blog", "post", "two"],
        },
      },
      {
        locale: "en",
        params: {
          slug: ["blog", "post", "three"],
        },
      },
    ])
  })

  test("builds static paths from paths with pathPrefix", () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const paths = drupal.buildStaticPathsParamsFromPaths(
      ["/blog/post/one", "/blog/post/two", "/blog/post"],
      { pathPrefix: "blog" }
    )

    const paths2 = drupal.buildStaticPathsParamsFromPaths(
      ["/blog/post/one", "/blog/post/two", "/blog/post"],
      { pathPrefix: "/blog" }
    )

    const paths3 = drupal.buildStaticPathsParamsFromPaths(
      ["blog/post/one", "blog/post/two", "blog/post"],
      { pathPrefix: "/blog" }
    )

    const paths4 = drupal.buildStaticPathsParamsFromPaths(
      ["blog/post/one", "blog/post/two", "blog/post"],
      { pathPrefix: "blog" }
    )

    expect(paths).toMatchObject([
      {
        params: {
          slug: ["post", "one"],
        },
      },
      {
        params: {
          slug: ["post", "two"],
        },
      },
      {
        params: {
          slug: ["post"],
        },
      },
    ])

    expect(paths).toEqual(paths2)
    expect(paths).toEqual(paths3)
    expect(paths).toEqual(paths4)
  })
})

describe("getAuthFromContextAndOptions()", () => {
  const clientIdSecret = mocks.auth.clientIdSecret
  const context = {
    preview: false,
    params: { slug: ["recipes", "deep-mediterranean-quiche"] },
  }

  test("should use the withAuth option if provided and NOT in preview", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      auth: clientIdSecret,
      throwJsonApiErrors: false,
      logger: mockLogger(),
    })

    let auth: boolean | NextDrupalAuth = true

    expect(
      drupal.getAuthFromContextAndOptions(context, {
        withAuth: auth,
      })
    ).toBe(auth)

    auth = {
      clientId: "foo",
      clientSecret: "bar",
      scope: "baz",
    }

    expect(
      drupal.getAuthFromContextAndOptions(context, {
        withAuth: auth,
      })
    ).toBe(auth)
  })

  test("should fallback to the global auth if NOT in preview and no withAuth option provided", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      auth: clientIdSecret,
      throwJsonApiErrors: false,
      logger: mockLogger(),
    })

    expect(drupal.getAuthFromContextAndOptions(context, {})).toBe(false)

    const drupal2 = new NextDrupalPages(BASE_URL, {
      auth: clientIdSecret,
      withAuth: true,
      throwJsonApiErrors: false,
      logger: mockLogger(),
    })

    expect(drupal2.getAuthFromContextAndOptions(context, {})).toBe(true)
  })

  test("should NOT use the global auth if in preview and no plugin in previewData", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      auth: clientIdSecret,
      withAuth: true,
      throwJsonApiErrors: false,
      logger: mockLogger(),
    })

    expect(
      drupal.getAuthFromContextAndOptions(
        {
          ...context,
          preview: true,
        },
        {}
      )
    ).toBe(null)
  })

  test("should use the scope from context if in preview and using the simple_oauth plugin", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      auth: clientIdSecret,
      throwJsonApiErrors: false,
      logger: mockLogger(),
    })

    expect(
      drupal.getAuthFromContextAndOptions(
        {
          ...context,
          preview: true,
          previewData: {
            plugin: "simple_oauth",
            scope: "editor",
          },
        },
        {}
      )
    ).toMatchObject({
      ...clientIdSecret,
      scope: "editor",
      url: "/oauth/token",
    })
  })

  test("should use the scope from context even with global withAuth if in preview and using the simple_oauth plugin", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      auth: {
        ...clientIdSecret,
        scope: "administrator",
      },
      withAuth: true,
      throwJsonApiErrors: false,
      logger: mockLogger(),
    })

    expect(
      drupal.getAuthFromContextAndOptions(
        {
          ...context,
          preview: true,
          previewData: {
            plugin: "simple_oauth",
            scope: "editor",
          },
        },
        {}
      )
    ).toMatchObject({
      ...clientIdSecret,
      scope: "editor",
      url: "/oauth/token",
    })
  })

  test("should use the access_token from context if in preview and using the jwt plugin", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      auth: clientIdSecret,
      throwJsonApiErrors: false,
      logger: mockLogger(),
    })

    expect(
      drupal.getAuthFromContextAndOptions(
        {
          ...context,
          preview: true,
          previewData: {
            plugin: "jwt",
            access_token: "example-token",
          },
        },
        {}
      )
    ).toBe(`Bearer example-token`)
  })

  test("should use the access token from context even with global withAuth if in preview and using the jwt plugin", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      auth: {
        ...clientIdSecret,
        scope: "administrator",
      },
      withAuth: true,
      throwJsonApiErrors: false,
      logger: mockLogger(),
    })

    expect(
      drupal.getAuthFromContextAndOptions(
        {
          ...context,
          preview: true,
          previewData: {
            plugin: "jwt",
            access_token: "example-token",
          },
        },
        {}
      )
    ).toBe(`Bearer example-token`)
  })
})

describe("getPathFromContext()", () => {
  test("returns a path from context", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    expect(
      drupal.getPathFromContext({
        params: {
          slug: ["foo"],
        },
      })
    ).toEqual("/foo")

    expect(
      drupal.getPathFromContext({
        params: {
          slug: ["foo", "bar"],
        },
      })
    ).toEqual("/foo/bar")

    expect(
      drupal.getPathFromContext({
        locale: "en",
        defaultLocale: "es",
        params: {
          slug: ["foo", "bar"],
        },
      })
    ).toEqual("/en/foo/bar")

    expect(
      drupal.getPathFromContext({
        params: {
          slug: [],
        },
      })
    ).toEqual("/home")

    drupal.frontPage = "/front"

    expect(
      drupal.getPathFromContext({
        params: {
          slug: [],
        },
      })
    ).toEqual("/front")

    expect(
      drupal.getPathFromContext({
        locale: "es",
        defaultLocale: "en",
        params: {
          slug: [],
        },
      })
    ).toEqual("/es/front")
  })

  test("returns a path from context with pathPrefix", () => {
    const drupal = new NextDrupalPages(BASE_URL)

    expect(
      drupal.getPathFromContext(
        {
          params: {
            slug: ["bar", "baz"],
          },
        },
        {
          pathPrefix: "/foo",
        }
      )
    ).toEqual("/foo/bar/baz")

    expect(
      drupal.getPathFromContext(
        {
          params: {
            slug: ["bar", "baz"],
          },
        },
        {
          pathPrefix: "foo",
        }
      )
    ).toEqual("/foo/bar/baz")

    expect(
      drupal.getPathFromContext(
        {
          locale: "en",
          defaultLocale: "en",
          params: {
            slug: ["bar", "baz"],
          },
        },
        {
          pathPrefix: "foo",
        }
      )
    ).toEqual("/foo/bar/baz")

    expect(
      drupal.getPathFromContext(
        {
          locale: "es",
          defaultLocale: "en",
          params: {
            slug: ["bar", "baz"],
          },
        },
        {
          pathPrefix: "foo",
        }
      )
    ).toEqual("/es/foo/bar/baz")

    expect(
      drupal.getPathFromContext(
        {
          locale: "es",
          defaultLocale: "en",
          params: {
            slug: [],
          },
        },
        {
          pathPrefix: "/foo",
        }
      )
    ).toEqual("/es/foo")

    drupal.frontPage = "/baz"

    expect(
      drupal.getPathFromContext(
        {
          locale: "en",
          defaultLocale: "en",
          params: {
            slug: [],
          },
        },
        {
          pathPrefix: "foo",
        }
      )
    ).toEqual("/foo")

    expect(
      drupal.getPathFromContext(
        {
          params: {
            slug: [],
          },
        },
        {
          pathPrefix: "",
        }
      )
    ).toEqual("/baz")
  })

  test("encodes path with punctuation", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const path = drupal.getPathFromContext({
      params: {
        slug: ["path&with^punc&in$path"],
      },
    })

    expect(path).toEqual("/path%26with%5Epunc%26in%24path")

    const translatedPath = await drupal.translatePath(path)

    expect(translatedPath).toMatchSnapshot()
  })
})

describe("getPathsFromContext()", () => {
  test("is an alias for getStaticPathsFromContext", () => {
    const drupal = new NextDrupalPages(BASE_URL)
    expect(drupal.getPathsFromContext).toBe(drupal.getStaticPathsFromContext)
  })
})

describe("getResourceCollectionFromContext()", () => {
  test("fetches a resource collection", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const context: GetStaticPropsContext = {
      locale: "en",
      defaultLocale: "en",
    }

    const articles = await drupal.getResourceCollectionFromContext(
      "node--article",
      context,
      {
        params: {
          "fields[node--article]": "title",
        },
      }
    )

    expect(articles).toMatchSnapshot()
  })

  test("fetches a resource collection using locale", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const context: GetStaticPropsContext = {
      locale: "es",
      defaultLocale: "en",
    }

    const articles = await drupal.getResourceCollectionFromContext(
      "node--article",
      context,
      {
        params: {
          "fields[node--article]": "title,langcode",
        },
      }
    )

    expect(articles[0].langcode).toEqual("es")

    expect(articles).toMatchSnapshot()
  })

  test("fetches raw data", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const context: GetStaticPropsContext = {
      locale: "en",
      defaultLocale: "en",
    }

    const recipes = await drupal.getResourceCollectionFromContext(
      "node--recipe",
      context,
      {
        deserialize: false,
        params: {
          "fields[node--recipe]": "title",
          "page[limit]": 2,
        },
      }
    )

    expect(recipes).toMatchSnapshot()
  })

  test("throws an error for invalid resource type", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const context: GetStaticPropsContext = {
      locale: "en",
      defaultLocale: "en",
    }

    await expect(
      drupal.getResourceCollectionFromContext(
        "RESOURCE-DOES-NOT-EXIST",
        context
      )
    ).rejects.toThrow("Resource of type 'RESOURCE-DOES-NOT-EXIST' not found.")
  })

  test("throws an error for invalid params", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const context: GetStaticPropsContext = {
      locale: "en",
      defaultLocale: "en",
    }

    await expect(
      drupal.getResourceCollectionFromContext<DrupalNode>(
        "node--recipe",
        context,
        {
          params: {
            include: "invalid_relationship",
          },
        }
      )
    ).rejects.toThrow(
      "400 Bad Request\n`invalid_relationship` is not a valid relationship field name. Possible values: node_type, revision_uid, uid, menu_link, field_media_image, field_recipe_category, field_tags."
    )
  })

  test("makes un-authenticated requests by default", async () => {
    const drupal = new NextDrupalPages(BASE_URL, { useDefaultEndpoints: true })
    const drupalFetchSpy = spyOnDrupalFetch(drupal)

    const context: GetStaticPropsContext = {
      locale: "en",
      defaultLocale: "en",
    }

    await drupal.getResourceCollectionFromContext("node--recipe", context)
    expect(drupalFetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("makes authenticated requests with withAuth option", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()

    const context: GetStaticPropsContext = {
      locale: "en",
      defaultLocale: "en",
    }
    await drupal.getResourceCollectionFromContext("node--recipe", context, {
      withAuth: true,
    })

    expect(
      (fetchSpy.mock.lastCall[1].headers as Headers).get("Authorization")
    ).toBe("Bearer sample-token")
  })
})

describe("getResourceFromContext()", () => {
  test("fetches a resource from context", async () => {
    const drupal = new NextDrupalPages(BASE_URL)
    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }
    const recipe = await drupal.getResourceFromContext<DrupalNode>(
      "node--recipe",
      context
    )

    expect(recipe).toMatchSnapshot()
  })

  test("fetches a resource from context with params", async () => {
    const drupal = new NextDrupalPages(BASE_URL)
    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }
    const recipe = await drupal.getResourceFromContext<DrupalNode>(
      "node--recipe",
      context,
      {
        params: {
          "fields[node--recipe]": "title",
        },
      }
    )

    expect(recipe).toMatchSnapshot()
  })

  test("fetches a resource from context using locale", async () => {
    const drupal = new NextDrupalPages(BASE_URL)
    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "quiche-mediterráneo-profundo"],
      },
      locale: "es",
      defaultLocale: "en",
    }
    const recipe = await drupal.getResourceFromContext<DrupalNode>(
      "node--recipe",
      context,
      {
        params: {
          "fields[node--recipe]": "title,field_cooking_time",
        },
      }
    )

    expect(recipe).toMatchSnapshot()
  })

  test("fetches raw data", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }
    const recipe = await drupal.getResourceFromContext<DrupalNode>(
      "node--recipe",
      context,
      {
        deserialize: false,
        params: {
          "fields[node--recipe]": "title",
        },
      }
    )

    expect(recipe).toMatchSnapshot()
  })

  test("fetches a resource from context by revision", async () => {
    const drupal = new NextDrupalPages(BASE_URL)
    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "quiche-mediterráneo-profundo"],
      },
      locale: "es",
      defaultLocale: "en",
    }
    const recipe = await drupal.getResourceFromContext<DrupalNode>(
      "node--recipe",
      context,
      {
        params: {
          "fields[node--recipe]": "drupal_internal__vid",
        },
      }
    )

    context.previewData = { resourceVersion: "rel:latest-version" }

    const latestRevision = await drupal.getResourceFromContext<DrupalNode>(
      "node--recipe",
      context,
      {
        params: {
          "fields[node--recipe]": "drupal_internal__vid",
        },
      }
    )

    expect(recipe.drupal_internal__vid).toEqual(
      latestRevision.drupal_internal__vid
    )
  })

  test("throws an error for invalid revision", async () => {
    const drupal = new NextDrupalPages(BASE_URL)
    const context: GetStaticPropsContext = {
      previewData: {
        resourceVersion: "id:-11",
      },
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    await expect(
      drupal.getResourceFromContext<DrupalNode>("node--recipe", context, {
        params: {
          "fields[node--recipe]": "drupal_internal__vid",
        },
      })
    ).rejects.toThrow(
      "404 Not Found\nThe requested version, identified by `id:-11`, could not be found."
    )
  })

  test("makes un-authenticated requests by default", async () => {
    const drupal = new NextDrupalPages(BASE_URL)
    const drupalFetchSpy = spyOnDrupalFetch(drupal, {
      responseBody: mocks.resources.subRequests.ok,
      status: 207,
    })
    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    await drupal.getResourceFromContext("node--recipe", context)
    expect(drupalFetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: false,
      })
    )
  })

  test("makes authenticated requests with withAuth option", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
      throwJsonApiErrors: false,
      logger: mockLogger(),
    })
    const fetchSpy = spyOnFetch({
      responseBody: { "resolvedResource#uri{0}": { body: "{}" } },
      status: 207,
    })

    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    await drupal.getResourceFromContext("node--recipe", context, {
      withAuth: true,
    })

    expect(
      (fetchSpy.mock.lastCall[1].headers as Headers).get("Authorization")
    ).toBe("Bearer sample-token")
  })

  test("makes authenticated requests when preview is true", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
      throwJsonApiErrors: false,
      logger: mockLogger(),
    })
    const fetchSpy = spyOnFetch({
      responseBody: { "resolvedResource#uri{0}": { body: "{}" } },
      status: 207,
    })

    const context: GetStaticPropsContext = {
      preview: true,
      previewData: {
        plugin: "simple_oauth",
        scope: "editor",
      },
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    await drupal.getResourceFromContext("node--recipe", context)

    expect(
      (fetchSpy.mock.lastCall[1].headers as Headers).get("Authorization")
    ).toBe("Bearer sample-token")
  })

  test("accepts a translated path", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const path = await drupal.translatePath("recipes/deep-mediterranean-quiche")

    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    const recipe = await drupal.getResourceFromContext(path, context, {
      params: {
        "fields[node--recipe]": "title,path,status",
      },
    })

    await expect(recipe).toMatchSnapshot()
  })
})

describe("getSearchIndexFromContext()", () => {
  test("calls getSearchIndex() with context data", async () => {
    const drupal = new NextDrupalPages(BASE_URL)
    const fetchSpy = jest
      .spyOn(drupal, "getSearchIndex")
      .mockImplementation(async () => jest.fn())
    const name = "resource-name"
    const locale = "en-uk"
    const defaultLocale = "en-us"
    const options = {
      deserialize: true,
    }

    await drupal.getSearchIndexFromContext(
      name,
      { locale, defaultLocale },
      options
    )

    expect(fetchSpy).toHaveBeenCalledWith(name, {
      ...options,
      locale,
      defaultLocale,
    })
  })
})

describe("getStaticPathsFromContext()", () => {
  test("returns static paths from context", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const paths = await drupal.getStaticPathsFromContext("node--article", {})

    expect(paths).toMatchSnapshot()
  })

  test("returns static paths from context with locale", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const paths = await drupal.getStaticPathsFromContext("node--article", {
      locales: ["en", "es"],
      defaultLocale: "en",
    })

    expect(paths).toMatchSnapshot()
  })

  test("returns static paths for multiple resource types from context", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const paths = await drupal.getStaticPathsFromContext(
      ["node--article", "node--recipe"],
      {
        locales: ["en", "es"],
        defaultLocale: "en",
      }
    )

    expect(paths).toMatchSnapshot()
  })

  test("returns static paths from context with params", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const paths = await drupal.getStaticPathsFromContext(
      "node--article",
      {},
      {
        params: {
          "filter[promote]": 1,
        },
      }
    )

    expect(paths).toMatchSnapshot()
  })

  test("makes un-authenticated requests by default", async () => {
    const drupal = new NextDrupalPages(BASE_URL, { useDefaultEndpoints: true })
    const drupalFetchSpy = spyOnDrupalFetch(drupal)

    await drupal.getStaticPathsFromContext("node--article", {
      locales: ["en", "es"],
      defaultLocale: "en",
    })
    expect(drupalFetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("makes authenticated requests with withAuth option", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()

    await drupal.getStaticPathsFromContext(
      "node--article",
      {
        locales: ["en", "es"],
        defaultLocale: "en",
      },
      {
        withAuth: true,
      }
    )

    expect(
      (fetchSpy.mock.lastCall[1].headers as Headers).get("Authorization")
    ).toBe("Bearer sample-token")
  })
})

describe("preview()", () => {
  // Get values from our mocked request.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { path, resourceVersion, plugin, secret, ...draftData } =
    // @ts-expect-error
    new NextApiRequest().query
  const dataCookie = `${DRAFT_DATA_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify({ path, resourceVersion, ...draftData })
  )}; Path=/; HttpOnly; SameSite=None; Secure`
  const validationPayload = {
    path,
    maxAge: 30,
  }

  test("turns on preview mode and clears preview data", async () => {
    const request = new NextApiRequest()
    const response = new NextApiResponse()
    const drupal = new NextDrupalPages(BASE_URL)
    spyOnFetch({ responseBody: validationPayload })

    // @ts-expect-error
    await drupal.preview(request, response)

    expect(response.clearPreviewData).toBeCalledTimes(1)
    expect(response.setPreviewData).toBeCalledWith({
      resourceVersion,
      plugin,
      ...validationPayload,
    })
  })

  test("does not enable preview mode if validation fails", async () => {
    const logger = mockLogger()
    const request = new NextApiRequest()
    const response = new NextApiResponse()
    const drupal = new NextDrupalPages(BASE_URL, { debug: true, logger })
    const status = 403
    const message = "mock fail"
    spyOnFetch({
      responseBody: { message },
      status,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // @ts-expect-error
    await drupal.preview(request, response)

    expect(logger.debug).toBeCalledWith(
      `Draft url validation error: ${message}`
    )
    expect(response.setPreviewData).toBeCalledTimes(0)
    expect(response.statusCode).toBe(status)
    expect(response.json).toBeCalledWith({ message })
  })

  test("does not turn on draft mode by default", async () => {
    const request = new NextApiRequest()
    const response = new NextApiResponse()
    const drupal = new NextDrupalPages(BASE_URL)
    spyOnFetch({ responseBody: validationPayload })

    // @ts-expect-error
    await drupal.preview(request, response)

    expect(response.setDraftMode).toBeCalledTimes(0)

    // Also check for no draft data cookie.
    const cookies = response.getHeader("Set-Cookie")
    expect(cookies[cookies.length - 1]).not.toBe(dataCookie)
  })

  test("optionally turns on draft mode", async () => {
    const request = new NextApiRequest()
    const response = new NextApiResponse()
    const logger = mockLogger()
    const drupal = new NextDrupalPages(BASE_URL, {
      debug: true,
      logger,
    })
    spyOnFetch({ responseBody: validationPayload })

    const options = { enable: true }
    // @ts-expect-error
    await drupal.preview(request, response, options)

    expect(response.setDraftMode).toBeCalledWith(options)

    // Also check for draft data cookie.
    const cookies = response.getHeader("Set-Cookie")
    expect(cookies[cookies.length - 1]).toBe(dataCookie)

    expect(logger.debug).toHaveBeenLastCalledWith("Draft mode enabled.")
  })

  test("updates preview mode cookie’s sameSite flag", async () => {
    const request = new NextApiRequest()
    const response = new NextApiResponse()
    const drupal = new NextDrupalPages(BASE_URL)
    spyOnFetch({ responseBody: validationPayload })

    // Our mock response.setPreviewData() does not set a cookie, so we set one.
    const previewCookie =
      "__next_preview_data=secret-data; Path=/; HttpOnly; SameSite=Lax"
    response.setHeader("Set-Cookie", [
      previewCookie,
      ...response.getHeader("Set-Cookie"),
    ])

    const cookies = response.getHeader("Set-Cookie")
    cookies[0] = cookies[0].replace("SameSite=Lax", "SameSite=None; Secure")

    // @ts-expect-error
    await drupal.preview(request, response)

    expect(response.getHeader).toHaveBeenLastCalledWith("Set-Cookie")
    expect(response.setHeader).toHaveBeenLastCalledWith("Set-Cookie", cookies)
    expect(response.getHeader("Set-Cookie")).toStrictEqual(cookies)
  })

  test("redirects to the given path", async () => {
    const request = new NextApiRequest()
    const response = new NextApiResponse()
    const logger = mockLogger()
    const drupal = new NextDrupalPages(BASE_URL, { debug: true, logger })
    spyOnFetch({ responseBody: validationPayload })

    // @ts-expect-error
    await drupal.preview(request, response)

    expect(response.setPreviewData).toBeCalledWith({
      resourceVersion,
      plugin,
      ...validationPayload,
    })
    expect(response.writeHead).toBeCalledWith(307, { Location: path })
    expect(logger.debug).toHaveBeenLastCalledWith("Preview mode enabled.")
  })

  test("returns a 422 response on error", async () => {
    const request = new NextApiRequest()
    const response = new NextApiResponse()
    const logger = mockLogger()
    const drupal = new NextDrupalPages(BASE_URL, { debug: true, logger })
    const message = "mock internal error"
    response.clearPreviewData = jest.fn(() => {
      throw new Error(message)
    })

    // @ts-expect-error
    await drupal.preview(request, response)

    expect(logger.debug).toHaveBeenLastCalledWith(`Preview failed: ${message}`)
    expect(response.status).toBeCalledWith(422)
    expect(response.end).toHaveBeenCalled()
  })
})

describe("previewDisable()", () => {
  test("clears preview data", async () => {
    const request = new NextApiRequest()
    const response = new NextApiResponse()
    const drupal = new NextDrupalPages(BASE_URL)

    // @ts-expect-error
    await drupal.previewDisable(request, response)
    expect(response.clearPreviewData).toBeCalledTimes(1)
  })

  test("disables draft mode", async () => {
    const request = new NextApiRequest()
    const response = new NextApiResponse()
    const drupal = new NextDrupalPages(BASE_URL)

    // @ts-expect-error
    await drupal.previewDisable(request, response)
    expect(response.setDraftMode).toBeCalledWith({ enable: false })
  })

  test("deletes the draft cookie", async () => {
    const request = new NextApiRequest()
    const response = new NextApiResponse()
    const drupal = new NextDrupalPages(BASE_URL)

    // @ts-expect-error
    await drupal.previewDisable(request, response)
    const cookies = response.getHeader("Set-Cookie")
    expect(cookies[cookies.length - 1]).toBe(
      `${DRAFT_DATA_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=None; Secure`
    )
  })

  test('redirects to "/"', async () => {
    const request = new NextApiRequest()
    const response = new NextApiResponse()
    const drupal = new NextDrupalPages(BASE_URL)

    // @ts-expect-error
    await drupal.previewDisable(request, response)
    expect(response.writeHead).toBeCalledWith(307, { Location: "/" })
    expect(response.end).toBeCalled()
  })
})

describe("translatePathFromContext()", () => {
  test("translates a path", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    const path = await drupal.translatePathFromContext(context)

    expect(path).toMatchSnapshot()
  })

  test("returns null for path not found", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const context: GetStaticPropsContext = {
      params: {
        slug: ["path-not-found"],
      },
    }

    const path = await drupal.translatePathFromContext(context)

    expect(path).toBeNull()
  })

  test("translates a path with pathPrefix", async () => {
    const drupal = new NextDrupalPages(BASE_URL)

    const context: GetStaticPropsContext = {
      params: {
        slug: ["deep-mediterranean-quiche"],
      },
    }

    const path = await drupal.translatePathFromContext(context, {
      pathPrefix: "recipes",
    })

    expect(path).toMatchSnapshot()

    const path2 = await drupal.translatePathFromContext(context, {
      pathPrefix: "/recipes",
    })

    expect(path).toEqual(path2)
  })

  test("makes un-authenticated requests by default", async () => {
    const drupal = new NextDrupalPages(BASE_URL)
    const drupalFetchSpy = spyOnDrupalFetch(drupal)

    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }
    await drupal.translatePathFromContext(context)

    expect(drupalFetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: false,
      })
    )
  })

  test("makes authenticated requests with withAuth option", async () => {
    const drupal = new NextDrupalPages(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()

    const context: GetStaticPropsContext = {
      params: {
        slug: ["deep-mediterranean-quiche"],
      },
    }
    await drupal.translatePathFromContext(context, {
      pathPrefix: "recipes",
      withAuth: true,
    })

    expect(
      (fetchSpy.mock.lastCall[1].headers as Headers).get("Authorization")
    ).toBe("Bearer sample-token")
  })
})
