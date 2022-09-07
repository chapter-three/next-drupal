import { expect } from "@jest/globals"
import { GetStaticPropsContext } from "next"
import { DrupalClient } from "../src/client"
import type {
  Serializer,
  DrupalNode,
  Logger,
  JsonApiResourceWithPath,
  JsonApiSearchApiResponse,
} from "../src/types"
import { BASE_URL } from "./utils"

afterEach(() => {
  jest.restoreAllMocks()
})

describe("DrupalClient", () => {
  test("it properly constructs a DrupalClient", () => {
    expect(new DrupalClient(BASE_URL)).toBeInstanceOf(DrupalClient)
  })

  test("it throws error for invalid baseUrl", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => new DrupalClient()).toThrow("The 'baseUrl' param is required.")

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => new DrupalClient({})).toThrow(
      "The 'baseUrl' param is required."
    )
  })

  test("it correctly formats apiPrefix", () => {
    const client = new DrupalClient(BASE_URL)
    expect(client.apiPrefix).toBe("/jsonapi")

    const client2 = new DrupalClient(BASE_URL, {
      apiPrefix: "/api",
    })
    expect(client2.apiPrefix).toBe("/api")

    const client3 = new DrupalClient(BASE_URL, {})
    client3.apiPrefix = "api"
    expect(client3.apiPrefix).toBe("/api")

    const client4 = new DrupalClient(BASE_URL, {})
    expect(client4.apiPrefix).toBe("/jsonapi")
  })

  test("it has a debug mode", async () => {
    const consoleSpy = jest.spyOn(console, "debug").mockImplementation()

    const client = new DrupalClient(BASE_URL, {
      debug: true,
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      "[next-drupal][debug]:",
      "Debug mode is on."
    )
    expect(client.debug).toBe(true)
  })
})

describe("auth", () => {
  test("it accepts username and password for auth", async () => {
    const customFetch = jest.fn()

    const client = new DrupalClient(BASE_URL, {
      auth: {
        username: "admin",
        password: "password",
      },
      fetcher: customFetch,
    })
    const url = client.buildUrl("/jsonapi").toString()

    await client.fetch(url, { withAuth: true })
    expect(customFetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
          Authorization: "Basic YWRtaW46cGFzc3dvcmQ=",
        },
        withAuth: true,
      })
    )
  })

  test("it accepts callback for auth", async () => {
    const customAuth = jest
      .fn()
      .mockReturnValue("Basic YXJzaGFkQG5leHQtZHJ1cGFsLm9yZzphYmMxMjM=")
    const customFetch = jest.fn()

    const client = new DrupalClient(BASE_URL, {
      auth: customAuth,
      fetcher: customFetch,
    })
    const url = client.buildUrl("/jsonapi").toString()

    await client.fetch(url, { withAuth: true })
    expect(customFetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
          Authorization: "Basic YXJzaGFkQG5leHQtZHJ1cGFsLm9yZzphYmMxMjM=",
        },
        withAuth: true,
      })
    )
  })

  test("it accepts clientId and clientSecret for auth", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
      },
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )

    const basic = Buffer.from(
      `7795065e-8ad0-45eb-a64d-73d9f3a5e943:d92Fm^ds`
    ).toString("base64")

    await client.fetch("http://example.com", { withAuth: true })
    expect(fetchSpy).toHaveBeenNthCalledWith(
      1,
      `${BASE_URL}/oauth/token`,
      expect.objectContaining({
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
    )
  })

  test("it accepts custom auth url", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
        url: "/custom/oauth",
      },
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )

    await client.fetch("http://example.com", { withAuth: true })
    expect(fetchSpy).toHaveBeenNthCalledWith(
      1,
      `${BASE_URL}/custom/oauth`,
      expect.anything()
    )
  })

  test("it throws an error if invalid auth is set", async () => {
    expect(
      () =>
        new DrupalClient(BASE_URL, {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          auth: {
            clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
          },
        })
    ).toThrow(
      "'clientId' and 'clientSecret' are required for auth. See https://next-drupal.org/docs/client/auth"
    )

    expect(() => {
      const client = new DrupalClient(BASE_URL)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      client.auth = {
        clientSecret: "d92Fm^ds",
      }
    }).toThrow(
      "'clientId' and 'clientSecret' are required for auth. See https://next-drupal.org/docs/client/auth"
    )

    expect(
      () =>
        new DrupalClient(BASE_URL, {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          auth: {
            username: "admin",
          },
        })
    ).toThrow(
      "'username' and 'password' are required for auth. See https://next-drupal.org/docs/client/auth"
    )

    expect(
      () =>
        new DrupalClient(BASE_URL, {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          auth: {
            password: "password",
          },
        })
    ).toThrow(
      "'username' and 'password' are required for auth. See https://next-drupal.org/docs/client/auth"
    )
  })
})

describe("getAccessToken", () => {
  test("it fetches an access token", async () => {
    jest.spyOn(global, "fetch").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              access_token: "ECYM594IlARGc3S8KgBHvTpki0rDtWx6",
              token_type: "bearer",
              expires_in: 3600,
            }),
        })
      ) as jest.Mock
    )

    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
      },
    })

    const token = await client.getAccessToken()
    expect(token).toEqual({
      access_token: "ECYM594IlARGc3S8KgBHvTpki0rDtWx6",
      token_type: "bearer",
      expires_in: 3600,
    })
  })

  test("it re-uses access token", async () => {
    jest.spyOn(global, "fetch").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              access_token: "ECYM594IlARGc3S8KgBHvTpki0rDtWx6" + Math.random(),
              token_type: "bearer",
              expires_in: 3600,
            }),
        })
      ) as jest.Mock
    )

    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
      },
    })

    const token1 = await client.getAccessToken()
    const token2 = await client.getAccessToken()
    expect(token1).toEqual(token2)
  })

  test("it accepts a long-lived accessToken", async () => {
    const accessToken = {
      token_type: "Bearer",
      expires_in: 300,
      access_token:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVlNDkyOTI4ZTZjNj",
    }

    const client = new DrupalClient(BASE_URL, {
      accessToken,
    })

    const token = await client.getAccessToken()

    expect(token).toEqual(accessToken)
  })
})

describe("headers", () => {
  test("it allows setting custom headers", async () => {
    const customFetch = jest.fn()
    const client = new DrupalClient(BASE_URL, {
      fetcher: customFetch,
    })
    client.headers = {
      foo: "bar",
    }

    const url = "http://example.com"

    await client.fetch(url)
    expect(customFetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: { foo: "bar" },
      })
    )
  })

  test("it allows setting custom headers with custom auth", async () => {
    const customFetch = jest.fn()
    const client = new DrupalClient(BASE_URL, {
      fetcher: customFetch,
      headers: {
        foo: "bar",
      },
      auth: jest
        .fn()
        .mockReturnValue("Basic YXJzaGFkQG5leHQtZHJ1cGFsLm9yZzphYmMxMjM="),
    })

    const url = "http://example.com"

    await client.fetch(url, { withAuth: true })

    expect(customFetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: {
          foo: "bar",
          Authorization: "Basic YXJzaGFkQG5leHQtZHJ1cGFsLm9yZzphYmMxMjM=",
        },
        withAuth: true,
      })
    )
  })
})

describe("logger", () => {
  test("it allows custom logger", () => {
    const logger: Logger = {
      log(message) {
        console.log(message)
      },
      warn(message) {
        console.warn(message)
      },
      error(message) {
        console.error(message)
      },
      debug(message) {
        console.debug(message)
      },
    }
    const debugSpy = jest.spyOn(logger, "debug").mockImplementation()

    new DrupalClient(BASE_URL, { debug: true, logger })

    expect(debugSpy).toHaveBeenCalled()
  })
})

describe("fetch", () => {
  test("it allows fetching custom url", async () => {
    const client = new DrupalClient(BASE_URL)
    const url = client.buildUrl(
      "/jsonapi/node/article/52837ad0-f218-46bd-a106-5710336b7053"
    )

    const response = await client.fetch(url.toString())
    expect(response.headers.get("content-type")).toEqual(
      "application/vnd.api+json"
    )
    const json = await response.json()
    expect(json).toMatchSnapshot()
  })

  test("it allows authenticated requests", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
      },
    })
    const url = client.buildUrl("/jsonapi")

    const getAccessTokenSpy = jest
      .spyOn(client, "getAccessToken")
      .mockImplementation()

    await client.fetch(url.toString(), {
      withAuth: true,
    })

    expect(getAccessTokenSpy).toHaveBeenCalled()
  })

  test("it throws an error if withAuth is called when auth is not configured", async () => {
    const client = new DrupalClient(BASE_URL)

    const url = client.buildUrl("/jsonapi")

    await expect(
      client.fetch(url.toString(), {
        withAuth: true,
      })
    ).rejects.toThrow("auth is not configured.")
  })

  test("it allows for custom fetcher", async () => {
    const customFetch = jest.fn()

    const client = new DrupalClient(BASE_URL, {
      fetcher: customFetch,
    })
    const url = client.buildUrl("/jsonapi").toString()

    await client.fetch(url)
    expect(customFetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
        },
      })
    )

    await client.fetch(url, {
      headers: {
        foo: "bar",
      },
    })
    expect(customFetch).toHaveBeenLastCalledWith(
      url,
      expect.objectContaining({
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          foo: "bar",
        },
      })
    )
  })
})

describe("buildUrl", () => {
  const client = new DrupalClient(BASE_URL)

  test("it builds a url", () => {
    expect(client.buildUrl("http://example.com").toString()).toEqual(
      "http://example.com/"
    )
  })

  test("it builds a relative url", () => {
    expect(client.buildUrl("/foo").toString()).toEqual(`${BASE_URL}/foo`)
  })

  test("it builds a url with params", () => {
    expect(client.buildUrl("/foo", { bar: "baz" }).toString()).toEqual(
      `${BASE_URL}/foo?bar=baz`
    )

    expect(
      client
        .buildUrl("/jsonapi/node/article", {
          sort: "-created",
          "fields[node--article]": "title,path",
        })
        .toString()
    ).toEqual(
      `${BASE_URL}/jsonapi/node/article?sort=-created&fields%5Bnode--article%5D=title%2Cpath`
    )
  })

  test("it builds a url from object (DrupalJsonApiParams)", () => {
    const params = {
      getQueryObject: () => ({
        sort: "-created",
        "fields[node--article]": "title,path",
      }),
    }

    expect(client.buildUrl("/jsonapi/node/article", params).toString()).toEqual(
      `${BASE_URL}/jsonapi/node/article?sort=-created&fields%5Bnode--article%5D=title%2Cpath`
    )
  })
})

describe("deserialize", () => {
  test("it deserializes JSON:API resource", async () => {
    const client = new DrupalClient(BASE_URL)
    const url = client.buildUrl(
      "/jsonapi/node/article/52837ad0-f218-46bd-a106-5710336b7053",
      {
        include: "field_tags",
      }
    )

    const response = await client.fetch(url.toString())
    const json = await response.json()
    const article = client.deserialize(json) as DrupalNode

    expect(article).toMatchSnapshot()
    expect(article.id).toEqual("52837ad0-f218-46bd-a106-5710336b7053")
    expect(article.field_tags).toHaveLength(3)
  })

  test("it deserializes JSON:API collection", async () => {
    const client = new DrupalClient(BASE_URL)
    const url = client.buildUrl("/jsonapi/node/article", {
      getQueryObject: () => ({
        "fields[node--article]": "title",
      }),
    })

    const response = await client.fetch(url.toString())
    const json = await response.json()
    const articles = client.deserialize(json) as DrupalNode[]

    expect(articles).toMatchSnapshot()
  })

  test("it allows for custom data serializer", async () => {
    const serializer: Serializer = {
      deserialize: (
        body: { data: { id: string; attributes: { title: string } } },
        options: { pathPrefix: string }
      ) => {
        return {
          id: body.data.id,
          title: `${options.pathPrefix}: ${body.data.attributes.title}`,
        }
      },
    }
    const client = new DrupalClient(BASE_URL, {
      serializer,
    })
    const url = client.buildUrl(
      "/jsonapi/node/article/52837ad0-f218-46bd-a106-5710336b7053"
    )

    const response = await client.fetch(url.toString())
    const json = await response.json()
    const article = client.deserialize(json, {
      pathPrefix: "TITLE",
    }) as DrupalNode

    expect(article).toMatchSnapshot()
    expect(article.id).toEqual("52837ad0-f218-46bd-a106-5710336b7053")
    expect(article.title).toEqual(`TITLE: ${json.data.attributes.title}`)
  })
})

describe("getPathFromContext", () => {
  test("it returns a path from context", async () => {
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

  test("it returns a path from context with pathPrefix", () => {
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

  test("it encodes path with punctuation", async () => {
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

describe("getIndex", () => {
  test("it fetches the JSON:API index", async () => {
    const client = new DrupalClient(BASE_URL)
    const index = await client.getIndex()

    expect(index).toMatchSnapshot()
  })

  test("it fetches the JSON:API index with locale", async () => {
    const client = new DrupalClient(BASE_URL)
    const index = await client.getIndex("es")

    expect(index).toMatchSnapshot()
  })

  test("it throws error for invalid base url", async () => {
    const client = new DrupalClient("https://example.com")

    await expect(client.getIndex()).rejects.toThrow(
      "Failed to fetch JSON:API index at https://example.com/jsonapi"
    )
  })
})

describe("getEntryForResourceType", () => {
  test("it returns the JSON:API entry for a resource type", async () => {
    const client = new DrupalClient(BASE_URL)
    const getIndexSpy = jest.spyOn(client, "getIndex")

    const recipeEntry = await client.getEntryForResourceType("node--recipe")
    expect(recipeEntry).toMatch(`${BASE_URL}/en/jsonapi/node/recipe`)
    expect(getIndexSpy).toHaveBeenCalledTimes(1)

    const articleEntry = await client.getEntryForResourceType("node--article")
    expect(articleEntry).toMatch(`${BASE_URL}/en/jsonapi/node/article`)
    expect(getIndexSpy).toHaveBeenCalledTimes(2)
  })

  test("it assembles JSON:API entry without fetching index", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
    })
    const getIndexSpy = jest.spyOn(client, "getIndex")

    const recipeEntry = await client.getEntryForResourceType("node--article")
    expect(recipeEntry).toMatch(`${BASE_URL}/jsonapi/node/article`)
    expect(getIndexSpy).toHaveBeenCalledTimes(0)
  })

  test("it throws an error if resource type does not exist", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getEntryForResourceType("RESOURCE-DOES-NOT-EXIST")
    ).rejects.toThrow("Resource of type 'RESOURCE-DOES-NOT-EXIST' not found.")
  })
})

describe("getResource", () => {
  test("it fetches a resource by uuid", async () => {
    const client = new DrupalClient(BASE_URL)
    const recipe = await client.getResource<DrupalNode>(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f"
    )

    expect(recipe).toMatchSnapshot()
  })

  test("it fetches a resource by uuid with params", async () => {
    const client = new DrupalClient(BASE_URL)
    const recipe = await client.getResource<DrupalNode>(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
      {
        params: {
          "fields[node--recipe]": "title,field_cooking_time",
        },
      }
    )

    expect(recipe).toMatchSnapshot()
  })

  test("it fetches a resource using locale", async () => {
    const client = new DrupalClient(BASE_URL)
    const recipe = await client.getResource<DrupalNode>(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
      {
        locale: "es",
        defaultLocale: "en",
        params: {
          "fields[node--recipe]": "title,field_cooking_time",
        },
      }
    )

    expect(recipe).toMatchSnapshot()
  })

  test("it fetches raw data", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResource(
        "node--recipe",
        "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
        {
          deserialize: false,
        }
      )
    ).resolves.toMatchSnapshot()
  })

  test("it fetches a resource by revision", async () => {
    const client = new DrupalClient(BASE_URL)
    const recipe = await client.getResource<DrupalNode>(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
      {
        params: {
          "fields[node--recipe]": "drupal_internal__vid",
        },
      }
    )
    const latestRevision = await client.getResource<DrupalNode>(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
      {
        params: {
          resourceVersion: "rel:latest-version",
          "fields[node--recipe]": "drupal_internal__vid",
        },
      }
    )

    expect(recipe.drupal_internal__vid).toEqual(
      latestRevision.drupal_internal__vid
    )
  })

  test("it throws an error for invalid revision", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResource<DrupalNode>(
        "node--recipe",
        "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
        {
          params: {
            resourceVersion: "id:-11",
            "fields[node--recipe]": "title",
          },
        }
      )
    ).rejects.toThrow(
      "404 Not Found\nThe requested version, identified by `id:-11`, could not be found."
    )
  })

  test("it throws an error if revision access if forbidden", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResource<DrupalNode>(
        "node--recipe",
        "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
        {
          params: {
            resourceVersion: "id:1",
            "fields[node--recipe]": "title",
          },
        }
      )
    ).rejects.toThrow(
      "403 Forbidden\nThe current user is not allowed to GET the selected resource. The user does not have access to the requested version."
    )
  })

  test("it throws an error for invalid resource type", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResource<DrupalNode>(
        "RESOURCE-DOES-NOT-EXIST",
        "71e04ead-4cc7-416c-b9ca-60b635fdc50f"
      )
    ).rejects.toThrow("Resource of type 'RESOURCE-DOES-NOT-EXIST' not found.")
  })

  test("it throws an error for invalid params", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResource<DrupalNode>(
        "node--recipe",
        "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
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

  test("it makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.getResource(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f"
    )
    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("it makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    jest.spyOn(client, "getAccessToken").mockImplementation()

    await client.getResource(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
      {
        withAuth: true,
      }
    )

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: true,
      })
    )
  })
})

describe("getResourceByPath", () => {
  test("it fetches a resource by path", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath("/recipes/deep-mediterranean-quiche")
    ).resolves.toMatchSnapshot()
  })

  test("it fetches a resource by path with params", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath("/recipes/deep-mediterranean-quiche", {
        params: {
          "fields[node--recipe]": "title,field_cooking_time",
        },
      })
    ).resolves.toMatchSnapshot()
  })

  test("it fetches a resource by path using locale", async () => {
    const client = new DrupalClient(BASE_URL)
    const recipe = await client.getResourceByPath(
      "/recipes/quiche-mediterráneo-profundo",
      {
        locale: "es",
        defaultLocale: "en",
        params: {
          "fields[node--recipe]": "title,field_cooking_time",
        },
      }
    )

    expect(recipe).toMatchSnapshot()
  })

  test("it fetches raw data", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath("/recipes/deep-mediterranean-quiche", {
        deserialize: false,
      })
    ).resolves.toMatchSnapshot()
  })

  test("it fetches a resource by revision", async () => {
    const client = new DrupalClient(BASE_URL)
    const recipe = await client.getResourceByPath<DrupalNode>(
      "/recipes/deep-mediterranean-quiche",
      {
        params: {
          "fields[node--recipe]": "drupal_internal__vid",
        },
      }
    )
    const latestRevision = await client.getResourceByPath<DrupalNode>(
      "/recipes/deep-mediterranean-quiche",
      {
        params: {
          resourceVersion: "rel:latest-version",
          "fields[node--recipe]": "drupal_internal__vid",
        },
      }
    )

    expect(recipe.drupal_internal__vid).toEqual(
      latestRevision.drupal_internal__vid
    )
  })

  test("it throws an error for invalid revision", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath<DrupalNode>(
        "/recipes/deep-mediterranean-quiche",
        {
          params: {
            resourceVersion: "id:-11",
            "fields[node--recipe]": "title",
          },
        }
      )
    ).rejects.toThrow(
      "404 Not Found\nThe requested version, identified by `id:-11`, could not be found."
    )
  })

  test("it throws an error if revision access if forbidden", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath<DrupalNode>(
        "/recipes/deep-mediterranean-quiche",
        {
          params: {
            resourceVersion: "id:1",
            "fields[node--recipe]": "title",
          },
        }
      )
    ).rejects.toThrow(
      "403 Forbidden\nThe current user is not allowed to GET the selected resource. The user does not have access to the requested version."
    )
  })

  test("it returns null for path not found", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath<DrupalNode>("/path-do-not-exist")
    ).rejects.toThrow("Unable to resolve path /path-do-not-exist.")
  })

  test("it throws an error for invalid params", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceByPath<DrupalNode>(
        "/recipes/deep-mediterranean-quiche",
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

  test("it makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")
    const getAccessTokenSpy = jest.spyOn(client, "getAccessToken")

    await client.getResourceByPath<DrupalNode>(
      "/recipes/deep-mediterranean-quiche"
    )
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.not.objectContaining({
        withAuth: true,
      })
    )
    expect(getAccessTokenSpy).not.toHaveBeenCalled()
  })

  test("it makes authenticated requests with withAuth", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
      },
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    const getAccessTokenSpy = jest.spyOn(client, "getAccessToken")

    await client.getResourceByPath<DrupalNode>(
      "/recipes/deep-mediterranean-quiche",
      {
        withAuth: true,
      }
    )

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: true,
      })
    )
    expect(getAccessTokenSpy).toHaveBeenCalled()
  })
})

describe("getResourceFromContext", () => {
  test("it fetches a resource from context", async () => {
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

  test("it fetches a resource from context with params", async () => {
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

  test("it fetches a resource from context using locale", async () => {
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

  test("it fetches raw data", async () => {
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

  test("it fetches a resource from context by revision", async () => {
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

  test("it throws an error for invalid revision", async () => {
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

  test("it throws an error if revision access if forbidden", async () => {
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

  test("it makes un-authenticated requests by default", async () => {
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

  test("it makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    jest.spyOn(client, "getAccessToken").mockImplementation()

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
        withAuth: true,
      })
    )
  })

  test("it makes authenticated requests when preview is true", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    jest.spyOn(client, "getAccessToken").mockImplementation()

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
        withAuth: `Bearer sample-token`,
      })
    )
  })

  test("it accepts a translated path", async () => {
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

describe("translatePath", () => {
  test("it translates a path", async () => {
    const client = new DrupalClient(BASE_URL)

    const path = await client.translatePath("recipes/deep-mediterranean-quiche")

    expect(path).toMatchSnapshot()

    const path2 = await client.translatePath(
      "/recipes/deep-mediterranean-quiche"
    )

    expect(path).toEqual(path2)
  })

  test("it returns null for path not found", async () => {
    const client = new DrupalClient(BASE_URL)

    const path = await client.translatePath("/path-not-found")

    expect(path).toBeNull()
  })

  test("it makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.translatePath("recipes/deep-mediterranean-quiche")

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: false,
      })
    )
  })

  test("it makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    jest.spyOn(client, "getAccessToken").mockImplementation()

    await client.translatePath("recipes/deep-mediterranean-quiche", {
      withAuth: true,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: true,
      })
    )
  })
})

describe("translatePathFromContext", () => {
  test("it translates a path", async () => {
    const client = new DrupalClient(BASE_URL)

    const context: GetStaticPropsContext = {
      params: {
        slug: ["recipes", "deep-mediterranean-quiche"],
      },
    }

    const path = await client.translatePathFromContext(context)

    expect(path).toMatchSnapshot()
  })

  test("it returns null for path not found", async () => {
    const client = new DrupalClient(BASE_URL)

    const context: GetStaticPropsContext = {
      params: {
        slug: ["path-not-found"],
      },
    }

    const path = await client.translatePathFromContext(context)

    expect(path).toBeNull()
  })

  test("it translates a path with pathPrefix", async () => {
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

  test("it makes un-authenticated requests by default", async () => {
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

  test("it makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    jest.spyOn(client, "getAccessToken").mockImplementation()

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
        withAuth: true,
      })
    )
  })
})

describe("getResourceCollection", () => {
  test("it fetches a resource collection", async () => {
    const client = new DrupalClient(BASE_URL)

    const articles = await client.getResourceCollection("node--article", {
      params: {
        "fields[node--article]": "title",
      },
    })

    expect(articles).toMatchSnapshot()
  })

  test("it fetches a resource collection using locale", async () => {
    const client = new DrupalClient(BASE_URL)

    const articles = await client.getResourceCollection("node--article", {
      locale: "es",
      defaultLocale: "en",
      params: {
        "fields[node--article]": "title,langcode",
      },
    })

    expect(articles[0].langcode).toEqual("es")

    expect(articles).toMatchSnapshot()
  })

  test("it fetches raw data", async () => {
    const client = new DrupalClient(BASE_URL)

    const recipes = await client.getResourceCollection("node--recipe", {
      deserialize: false,
      params: {
        "fields[node--recipe]": "title",
        "page[limit]": 2,
      },
    })

    expect(recipes).toMatchSnapshot()
  })

  test("it throws an error for invalid resource type", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceCollection("RESOURCE-DOES-NOT-EXIST")
    ).rejects.toThrow("Resource of type 'RESOURCE-DOES-NOT-EXIST' not found.")
  })

  test("it throws an error for invalid params", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(
      client.getResourceCollection<DrupalNode>("node--recipe", {
        params: {
          include: "invalid_relationship",
        },
      })
    ).rejects.toThrow(
      "400 Bad Request\n`invalid_relationship` is not a valid relationship field name. Possible values: node_type, revision_uid, uid, menu_link, field_media_image, field_recipe_category, field_tags."
    )
  })

  test("it makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.getResourceCollection("node--recipe")
    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("it makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    jest.spyOn(client, "getAccessToken").mockImplementation()

    await client.getResourceCollection("node--recipe", {
      withAuth: true,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: true,
      })
    )
  })
})

describe("getResourceCollectionFromContext", () => {
  test("it fetches a resource collection", async () => {
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

  test("it fetches a resource collection using locale", async () => {
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

  test("it fetches raw data", async () => {
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

  test("it throws an error for invalid resource type", async () => {
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

  test("it throws an error for invalid params", async () => {
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

  test("it makes un-authenticated requests by default", async () => {
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

  test("it makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    jest.spyOn(client, "getAccessToken").mockImplementation()

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
        withAuth: true,
      })
    )
  })
})

describe("getStaticPathsFromContext", () => {
  test("it returns static paths from context", async () => {
    const client = new DrupalClient(BASE_URL)

    const paths = await client.getStaticPathsFromContext("node--article", {})

    expect(paths).toMatchSnapshot()
  })

  test("it returns static paths from context with locale", async () => {
    const client = new DrupalClient(BASE_URL)

    const paths = await client.getStaticPathsFromContext("node--article", {
      locales: ["en", "es"],
      defaultLocale: "en",
    })

    expect(paths).toMatchSnapshot()
  })

  test("it returns static paths for multiple resoure types from context", async () => {
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

  test("it returns static paths from context with params", async () => {
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

  test("it makes un-authenticated requests by default", async () => {
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

  test("it makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    jest.spyOn(client, "getAccessToken").mockImplementation()

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
        withAuth: true,
      })
    )
  })
})

describe("buildStaticPathsParamsFromPaths", () => {
  test("it builds static paths from paths", () => {
    const client = new DrupalClient(BASE_URL)

    const paths = ["/blog/post/one", "/blog/post/two", "/blog/post/three"]

    expect(client.buildStaticPathsParamsFromPaths(paths)).toMatchSnapshot()

    expect(
      client.buildStaticPathsParamsFromPaths(paths, { locale: "en" })
    ).toMatchSnapshot()
  })

  test("it builds static paths from paths with pathPrefix", () => {
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

    expect(paths).toMatchSnapshot()

    expect(paths).toEqual(paths2)
    expect(paths).toEqual(paths3)
    expect(paths).toEqual(paths4)
  })
})

describe("buildStaticPathsFromResources", () => {
  test("it builds static paths from resources", () => {
    const client = new DrupalClient(BASE_URL)

    const resources: Pick<JsonApiResourceWithPath, "path">[] = [
      {
        path: {
          alias: "blog/post/one",
          pid: 1,
          langcode: "en",
        },
      },
      {
        path: {
          alias: "blog/post/two",
          pid: 2,
          langcode: "en",
        },
      },
    ]

    expect(client.buildStaticPathsFromResources(resources)).toMatchSnapshot()

    expect(
      client.buildStaticPathsFromResources(resources, { locale: "es" })
    ).toMatchSnapshot()
  })

  test("it builds static paths from resources with pathPrefix", () => {
    const client = new DrupalClient(BASE_URL)

    const resources: Pick<JsonApiResourceWithPath, "path">[] = [
      {
        path: {
          alias: "blog/post/one",
          pid: 1,
          langcode: "en",
        },
      },
      {
        path: {
          alias: "blog/post/two",
          pid: 2,
          langcode: "en",
        },
      },
    ]

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

    expect(paths).toMatchSnapshot()
    expect(paths3).toMatchSnapshot()

    expect(paths).toEqual(paths2)
    expect(paths3).toEqual(paths4)
  })
})

describe("getMenu", () => {
  test("it fetches menu items for a menu", async () => {
    const client = new DrupalClient(BASE_URL)

    const menu = await client.getMenu("main")

    expect(menu).toMatchSnapshot()
  })

  test("it fetches menu items for a menu with locale", async () => {
    const client = new DrupalClient(BASE_URL)

    const menu = await client.getMenu("main", {
      locale: "es",
      defaultLocale: "en",
    })

    expect(menu).toMatchSnapshot()
  })

  test("it fetches menu items for a menu with params", async () => {
    const client = new DrupalClient(BASE_URL)

    const menu = await client.getMenu("main", {
      params: {
        "fields[menu_link_content--menu_link_content]": "title",
      },
    })

    expect(menu).toMatchSnapshot()
  })

  test("it throws an error for invalid menu name", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(client.getMenu("INVALID")).rejects.toThrow(
      '404 Not Found\nThe "menu" parameter was not converted for the path "/jsonapi/menu_items/{menu}" (route name: "jsonapi_menu_items.menu")'
    )
  })

  test("it makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.getMenu("main")
    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("it makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    jest.spyOn(client, "getAccessToken").mockImplementation()

    await client.getMenu("main", { withAuth: true })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: true,
      })
    )
  })
})

describe("getView", () => {
  test("it fetches a view", async () => {
    const client = new DrupalClient(BASE_URL)

    const view = await client.getView("featured_articles--page_1")

    expect(view).toMatchSnapshot()
  })

  test("it fetches a view with params", async () => {
    const client = new DrupalClient(BASE_URL)

    const view = await client.getView("featured_articles--page_1", {
      params: {
        "fields[node--article]": "title",
      },
    })

    expect(view).toMatchSnapshot()
  })

  test("it fetches a view with locale", async () => {
    const client = new DrupalClient(BASE_URL)

    const view = await client.getView("featured_articles--page_1", {
      locale: "es",
      defaultLocale: "en",
      params: {
        "fields[node--article]": "title",
      },
    })

    expect(view).toMatchSnapshot()
  })

  test("it fetches raw data", async () => {
    const client = new DrupalClient(BASE_URL)

    const view = await client.getView("featured_articles--page_1", {
      locale: "es",
      defaultLocale: "en",
      deserialize: false,
      params: {
        "fields[node--article]": "title",
      },
    })

    expect(view).toMatchSnapshot()
  })

  test("it throws an error for invalid view name", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(client.getView("INVALID")).rejects.toThrow("Not Found")
  })

  test("it makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.getView("featured_articles--page_1")
    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("it makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    jest.spyOn(client, "getAccessToken").mockImplementation()

    await client.getView("featured_articles--page_1", { withAuth: true })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: true,
      })
    )
  })

  test("it fetches a view with links for pagination", async () => {
    const client = new DrupalClient(BASE_URL)
    const view = await client.getView("recipes--page_1")

    expect(view.links).toHaveProperty("next")
  })
})

describe("getSearchIndex", () => {
  test("it fetches a search index", async () => {
    const client = new DrupalClient(BASE_URL)

    const search = await client.getSearchIndex("recipes", {
      params: {
        "fields[node--recipe]": "title",
      },
    })

    expect(search).toMatchSnapshot()
  })

  test("it fetches a search index with locale", async () => {
    const client = new DrupalClient(BASE_URL)

    const search = await client.getSearchIndex("recipes", {
      locale: "es",
      defaultLocale: "en",
      params: {
        "fields[node--recipe]": "title",
      },
    })

    expect(search).toMatchSnapshot()
  })

  test("it fetches a search index with facets filters", async () => {
    const client = new DrupalClient(BASE_URL)

    const search = await client.getSearchIndex<JsonApiSearchApiResponse>(
      "recipes",
      {
        deserialize: false,
        params: {
          "filter[difficulty]": "easy",
          "fields[node--recipe]": "title,field_difficulty",
        },
      }
    )

    expect(search).toMatchSnapshot()
    expect(search.meta.facets).not.toBeNull()
  })

  test("it fetches raw data from search index", async () => {
    const client = new DrupalClient(BASE_URL)

    const search = await client.getSearchIndex("recipes", {
      deserialize: false,
      params: {
        "filter[difficulty]": "easy",
        "fields[node--recipe]": "title,field_difficulty",
      },
    })

    expect(search).toMatchSnapshot()
  })

  test("it makes un-authenticated requests by default", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.getSearchIndex("recipes")

    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: false,
    })
  })

  test("it throws an error for invalid index", async () => {
    const client = new DrupalClient(BASE_URL)

    await expect(client.getSearchIndex("INVALID-INDEX")).rejects.toThrow(
      "Not Found"
    )
  })

  test("it makes authenticated requests with withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      useDefaultResourceTypeEntry: true,
      auth: `Bearer sample-token`,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    jest.spyOn(client, "getAccessToken").mockImplementation()

    await client.getSearchIndex("recipes", {
      withAuth: true,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: true,
      })
    )
  })
})

describe("getAuthFromContextAndOptions", () => {
  test("if NOT in preview and withAuth option is provided, it should use the withAuth option", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
      },
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )
    jest.spyOn(client, "getAccessToken").mockImplementation()

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
        withAuth: true,
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
        withAuth: {
          clientId: "foo",
          clientSecret: "bar",
          scope: "baz",
        },
      })
    )
  })

  test("if NOT in preview and no withAuth option provided, it should fallback to the global auth", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
      },
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )

    await client.getResourceFromContext("node--article", {
      preview: false,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: false,
      })
    )

    const client2 = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
      },
      withAuth: true,
    })
    jest.spyOn(client2, "getAccessToken").mockImplementation()

    await client2.getResourceFromContext("node--article", {
      preview: false,
    })

    expect(fetchSpy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        withAuth: true,
      })
    )
  })

  test("if in preview, it should NOT use the global auth", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
      },
      withAuth: true,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )

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

  test("if in preview and using the simple_oauth plugin, it should use the scope from context", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
      },
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )

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
          clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
          clientSecret: "d92Fm^ds",
          scope: "editor",
          url: "/oauth/token",
        },
      })
    )
  })

  test("if in preview and using the simple_oauth plugin, tt should use the scope from context even with global withAuth", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
        scope: "administrator",
      },
      withAuth: true,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )

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
          clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
          clientSecret: "d92Fm^ds",
          scope: "editor",
          url: "/oauth/token",
        },
      })
    )
  })

  test("if in preview and using the jwt plugin, it should use the access_token from context", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
      },
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )

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
        withAuth: `Bearer example-token`,
      })
    )
  })

  test("if in preview and using the jwt plugin, t should use the access token from context even with global withAuth", async () => {
    const client = new DrupalClient(BASE_URL, {
      auth: {
        clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
        clientSecret: "d92Fm^ds",
        scope: "administrator",
      },
      withAuth: true,
    })
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        ) as jest.Mock
      )

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
        withAuth: `Bearer example-token`,
      })
    )
  })
})
