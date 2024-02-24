import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { GetStaticPropsContext } from "next"
import { DrupalClient } from "../../src"
import { BASE_URL, mocks, spyOnFetch } from "../utils"
import type { DrupalNode, JsonApiResourceWithPath } from "../../src"

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
    const client = new DrupalClient(BASE_URL)

    expect(client.buildStaticPathsFromResources(resources)).toMatchObject([
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
      client.buildStaticPathsFromResources(resources, { locale: "es" })
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
    const client = new DrupalClient(BASE_URL)

    const paths = client.buildStaticPathsFromResources(resources, {
      pathPrefix: "blog",
    })

    const paths2 = client.buildStaticPathsFromResources(resources, {
      pathPrefix: "/blog",
    })

    const paths3 = client.buildStaticPathsFromResources(resources, {
      pathPrefix: "/blog/post",
      locale: "es",
    })

    const paths4 = client.buildStaticPathsFromResources(resources, {
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
    const client = new DrupalClient(BASE_URL)

    const resources: Pick<JsonApiResourceWithPath, "path">[] = [
      {
        path: {
          alias: "/home",
          pid: 1,
          langcode: "en",
        },
      },
    ]

    expect(client.buildStaticPathsFromResources(resources)).toMatchObject([
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
    const client = new DrupalClient(BASE_URL)

    const paths = ["/blog/post/one", "/blog/post/two", "/blog/post/three"]

    expect(client.buildStaticPathsParamsFromPaths(paths)).toMatchObject([
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
      client.buildStaticPathsParamsFromPaths(paths, { locale: "en" })
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
    const client = new DrupalClient(BASE_URL)

    const paths = client.buildStaticPathsParamsFromPaths(
      ["/blog/post/one", "/blog/post/two", "/blog/post"],
      { pathPrefix: "blog" }
    )

    const paths2 = client.buildStaticPathsParamsFromPaths(
      ["/blog/post/one", "/blog/post/two", "/blog/post"],
      { pathPrefix: "/blog" }
    )

    const paths3 = client.buildStaticPathsParamsFromPaths(
      ["blog/post/one", "blog/post/two", "blog/post"],
      { pathPrefix: "/blog" }
    )

    const paths4 = client.buildStaticPathsParamsFromPaths(
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
  const accessToken = mocks.auth.accessToken

  test("should use the withAuth option if provided and NOT in preview", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: clientIdSecret,
    })
    const fetchSpy = spyOnFetch()
    jest
      .spyOn(client, "getAccessToken")
      .mockImplementation(async () => accessToken)

    await client.getResourceFromContext(
      "node--article",
      {
        preview: false,
      },
      {
        withAuth: true,
      }
    )

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `${accessToken.token_type} ${accessToken.access_token}`,
        }),
      })
    )

    await client.getResourceFromContext(
      "node--article",
      {
        preview: false,
      },
      {
        withAuth: {
          clientId: "foo",
          clientSecret: "bar",
          scope: "baz",
        },
      }
    )

    expect(fetchSpy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `${accessToken.token_type} ${accessToken.access_token}`,
        }),
      })
    )
  })

  test("should fallback to the global auth if NOT in preview and no withAuth option provided", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: clientIdSecret,
    })
    const fetchSpy = spyOnFetch()

    await client.getResourceFromContext("node--article", {
      preview: false,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.anything(),
        }),
      })
    )

    const client2 = new DrupalClient(BASE_URL, {
      auth: clientIdSecret,
      withAuth: true,
    })
    jest
      .spyOn(client2, "getAccessToken")
      .mockImplementation(async () => accessToken)

    await client2.getResourceFromContext("node--article", {
      preview: false,
    })

    expect(fetchSpy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `${accessToken.token_type} ${accessToken.access_token}`,
        }),
      })
    )
  })

  test("should NOT use the global auth if in preview", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: clientIdSecret,
      withAuth: true,
    })
    const fetchSpy = jest.spyOn(client, "fetch")
    spyOnFetch()

    await client.getResourceFromContext("node--article", {
      preview: true,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: null,
      })
    )
  })

  test("should use the scope from context if in preview and using the simple_oauth plugin", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: clientIdSecret,
    })
    const fetchSpy = jest.spyOn(client, "fetch")
    spyOnFetch()

    await client.getResourceFromContext("node--article", {
      preview: true,
      previewData: {
        plugin: "simple_oauth",
        scope: "editor",
      },
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: {
          ...clientIdSecret,
          scope: "editor",
          url: "/oauth/token",
        },
      })
    )
  })

  test("should use the scope from context even with global withAuth if in preview and using the simple_oauth plugin", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        ...clientIdSecret,
        scope: "administrator",
      },
      withAuth: true,
    })
    const fetchSpy = jest.spyOn(client, "fetch")
    spyOnFetch()

    await client.getResourceFromContext("node--article", {
      preview: true,
      previewData: {
        plugin: "simple_oauth",
        scope: "editor",
      },
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: {
          ...clientIdSecret,
          scope: "editor",
          url: "/oauth/token",
        },
      })
    )
  })

  test("should use the access_token from context if in preview and using the jwt plugin", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: clientIdSecret,
    })
    const fetchSpy = spyOnFetch()

    await client.getResourceFromContext("node--article", {
      preview: true,
      previewData: {
        plugin: "jwt",
        access_token: "example-token",
      },
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer example-token`,
        }),
      })
    )
  })

  test("should use the access token from context even with global withAuth if in preview and using the jwt plugin", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        ...clientIdSecret,
        scope: "administrator",
      },
      withAuth: true,
    })
    const fetchSpy = spyOnFetch()

    await client.getResourceFromContext("node--article", {
      preview: true,
      previewData: {
        plugin: "jwt",
        access_token: "example-token",
      },
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer example-token`,
        }),
      })
    )
  })
})

describe("getPathFromContext()", () => {
  test("returns a path from context", async () => {
    const client = new DrupalClient(BASE_URL)

    expect(
      client.getPathFromContext({
        params: {
          slug: ["foo"],
        },
      })
    ).toEqual("/foo")

    expect(
      client.getPathFromContext({
        params: {
          slug: ["foo", "bar"],
        },
      })
    ).toEqual("/foo/bar")

    expect(
      client.getPathFromContext({
        locale: "en",
        defaultLocale: "es",
        params: {
          slug: ["foo", "bar"],
        },
      })
    ).toEqual("/en/foo/bar")

    expect(
      client.getPathFromContext({
        params: {
          slug: [],
        },
      })
    ).toEqual("/home")

    client.frontPage = "/front"

    expect(
      client.getPathFromContext({
        params: {
          slug: [],
        },
      })
    ).toEqual("/front")

    expect(
      client.getPathFromContext({
        locale: "es",
        defaultLocale: "en",
        params: {
          slug: [],
        },
      })
    ).toEqual("/es/front")
  })

  test("returns a path from context with pathPrefix", () => {
    const client = new DrupalClient(BASE_URL)

    expect(
      client.getPathFromContext(
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
      client.getPathFromContext(
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
      client.getPathFromContext(
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
      client.getPathFromContext(
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
      client.getPathFromContext(
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
    ).toEqual("/es/foo/home")

    client.frontPage = "/baz"

    expect(
      client.getPathFromContext(
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
    ).toEqual("/foo/baz")

    expect(
      client.getPathFromContext(
        {
          params: {
            slug: [],
          },
        },
        {
          pathPrefix: "/foo/bar",
        }
      )
    ).toEqual("/foo/bar/baz")
  })

  test("encodes path with punctuation", async () => {
    const client = new DrupalClient(BASE_URL)

    const path = client.getPathFromContext({
      params: {
        slug: ["path&with^punc&in$path"],
      },
    })

    expect(path).toEqual("/path%26with%5Epunc%26in%24path")

    const translatedPath = await client.translatePath(path)

    expect(translatedPath).toMatchSnapshot()
  })
})

describe("getPathsFromContext()", () => {
  test("is an alias for getStaticPathsFromContext", () => {
    const client = new DrupalClient(BASE_URL)
    expect(client.getPathsFromContext).toBe(client.getStaticPathsFromContext)
  })
})

describe("getResourceCollectionFromContext()", () => {
  test("fetches a resource collection", async () => {
    const client = new DrupalClient(BASE_URL)

    const context: GetStaticPropsContext = {
      locale: "en",
      defaultLocale: "en",
    }

    const articles = await client.getResourceCollectionFromContext(
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
    const client = new DrupalClient(BASE_URL)

    const context: GetStaticPropsContext = {
      locale: "es",
      defaultLocale: "en",
    }

    const articles = await client.getResourceCollectionFromContext(
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
    const client = new DrupalClient(BASE_URL)

    const context: GetStaticPropsContext = {
      locale: "en",
      defaultLocale: "en",
    }

    const recipes = await client.getResourceCollectionFromContext(
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
    const client = new DrupalClient(BASE_URL)

    const context: GetStaticPropsContext = {
      locale: "en",
      defaultLocale: "en",
    }

    await expect(
      client.getResourceCollectionFromContext(
        "RESOURCE-DOES-NOT-EXIST",
        context
      )
    ).rejects.toThrow("Resource of type 'RESOURCE-DOES-NOT-EXIST' not found.")
  })

  test("throws an error for invalid params", async () => {
    const client = new DrupalClient(BASE_URL)

    const context: GetStaticPropsContext = {
      locale: "en",
      defaultLocale: "en",
    }

    await expect(
      client.getResourceCollectionFromContext<DrupalNode>(
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
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    const context: GetStaticPropsContext = {
      locale: "en",
      defaultLocale: "en",
    }

    await client.getResourceCollectionFromContext("node--recipe", context)
    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()
    jest.spyOn(client, "getAccessToken")

    const context: GetStaticPropsContext = {
      locale: "en",
      defaultLocale: "en",
    }
    await client.getResourceCollectionFromContext("node--recipe", context, {
      withAuth: true,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sample-token",
        }),
      })
    )
  })
})

describe("getResourceFromContext()", () => {
  test("fetches a resource from context", async () => {
    const client = new DrupalClient(BASE_URL)
    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }
    const recipe = await client.getResourceFromContext<DrupalNode>(
      "node--recipe",
      context
    )

    expect(recipe).toMatchSnapshot()
  })

  test("fetches a resource from context with params", async () => {
    const client = new DrupalClient(BASE_URL)
    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }
    const recipe = await client.getResourceFromContext<DrupalNode>(
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
    const client = new DrupalClient(BASE_URL)
    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "quiche-mediterráneo-profundo"],
      },
      locale: "es",
      defaultLocale: "en",
    }
    const recipe = await client.getResourceFromContext<DrupalNode>(
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
    const client = new DrupalClient(BASE_URL)

    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }
    const recipe = await client.getResourceFromContext<DrupalNode>(
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
    const client = new DrupalClient(BASE_URL)
    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "quiche-mediterráneo-profundo"],
      },
      locale: "es",
      defaultLocale: "en",
    }
    const recipe = await client.getResourceFromContext<DrupalNode>(
      "node--recipe",
      context,
      {
        params: {
          "fields[node--recipe]": "drupal_internal__vid",
        },
      }
    )

    context.previewData = { resourceVersion: "rel:latest-version" }

    const latestRevision = await client.getResourceFromContext<DrupalNode>(
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
    const client = new DrupalClient(BASE_URL)
    const context: GetStaticPropsContext = {
      previewData: {
        resourceVersion: "id:-11",
      },
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    await expect(
      client.getResourceFromContext<DrupalNode>("node--recipe", context, {
        params: {
          "fields[node--recipe]": "drupal_internal__vid",
        },
      })
    ).rejects.toThrow(
      "404 Not Found\nThe requested version, identified by `id:-11`, could not be found."
    )
  })

  test("throws an error if revision access is forbidden", async () => {
    const client = new DrupalClient(BASE_URL)

    const context: GetStaticPropsContext = {
      previewData: {
        resourceVersion: "id:1",
      },
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    await expect(
      client.getResourceFromContext<DrupalNode>("node--recipe", context, {
        params: {
          "fields[node--recipe]": "title",
        },
      })
    ).rejects.toThrow(
      "403 Forbidden\nThe current user is not allowed to GET the selected resource. The user does not have access to the requested version."
    )
  })

  test("makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")
    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    await client.getResourceFromContext("node--recipe", context)
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: false,
      })
    )
  })

  test("makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()
    jest.spyOn(client, "getAccessToken")

    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    await client.getResourceFromContext("node--recipe", context, {
      withAuth: true,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sample-token",
        }),
      })
    )
  })

  test("makes authenticated requests when preview is true", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()
    jest.spyOn(client, "getAccessToken")

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

    await client.getResourceFromContext("node--recipe", context)

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer sample-token`,
        }),
      })
    )
  })

  test("accepts a translated path", async () => {
    const client = new DrupalClient(BASE_URL)

    const path = await client.translatePath("recipes/deep-mediterranean-quiche")

    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    const recipe = await client.getResourceFromContext(path, context, {
      params: {
        "fields[node--recipe]": "title,path,status",
      },
    })

    await expect(recipe).toMatchSnapshot()
  })
})

describe("getSearchIndexFromContext()", () => {
  test("calls getSearchIndex() with context data", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest
      .spyOn(client, "getSearchIndex")
      .mockImplementation(async () => jest.fn())
    const name = "resource-name"
    const locale = "en-uk"
    const defaultLocale = "en-us"
    const options = {
      deserialize: true,
    }

    await client.getSearchIndexFromContext(
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
    const client = new DrupalClient(BASE_URL)

    const paths = await client.getStaticPathsFromContext("node--article", {})

    expect(paths).toMatchSnapshot()
  })

  test("returns static paths from context with locale", async () => {
    const client = new DrupalClient(BASE_URL)

    const paths = await client.getStaticPathsFromContext("node--article", {
      locales: ["en", "es"],
      defaultLocale: "en",
    })

    expect(paths).toMatchSnapshot()
  })

  test("returns static paths for multiple resource types from context", async () => {
    const client = new DrupalClient(BASE_URL)

    const paths = await client.getStaticPathsFromContext(
      ["node--article", "node--recipe"],
      {
        locales: ["en", "es"],
        defaultLocale: "en",
      }
    )

    expect(paths).toMatchSnapshot()
  })

  test("returns static paths from context with params", async () => {
    const client = new DrupalClient(BASE_URL)

    const paths = await client.getStaticPathsFromContext(
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
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.getStaticPathsFromContext("node--article", {
      locales: ["en", "es"],
      defaultLocale: "en",
    })
    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()
    jest.spyOn(client, "getAccessToken")

    await client.getStaticPathsFromContext(
      "node--article",
      {
        locales: ["en", "es"],
        defaultLocale: "en",
      },
      {
        withAuth: true,
      }
    )

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sample-token",
        }),
      })
    )
  })
})

describe("translatePathFromContext()", () => {
  test("translates a path", async () => {
    const client = new DrupalClient(BASE_URL)

    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    const path = await client.translatePathFromContext(context)

    expect(path).toMatchSnapshot()
  })

  test("returns null for path not found", async () => {
    const client = new DrupalClient(BASE_URL)

    const context: GetStaticPropsContext = {
      params: {
        slug: ["path-not-found"],
      },
    }

    const path = await client.translatePathFromContext(context)

    expect(path).toBeNull()
  })

  test("translates a path with pathPrefix", async () => {
    const client = new DrupalClient(BASE_URL)

    const context: GetStaticPropsContext = {
      params: {
        slug: ["deep-mediterranean-quiche"],
      },
    }

    const path = await client.translatePathFromContext(context, {
      pathPrefix: "recipes",
    })

    expect(path).toMatchSnapshot()

    const path2 = await client.translatePathFromContext(context, {
      pathPrefix: "/recipes",
    })

    expect(path).toEqual(path2)
  })

  test("makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }
    await client.translatePathFromContext(context)

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: false,
      })
    )
  })

  test("makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = spyOnFetch()
    jest.spyOn(client, "getAccessToken")

    const context: GetStaticPropsContext = {
      params: {
        slug: ["deep-mediterranean-quiche"],
      },
    }
    await client.translatePathFromContext(context, {
      pathPrefix: "recipes",
      withAuth: true,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sample-token",
        }),
      })
    )
  })
})
