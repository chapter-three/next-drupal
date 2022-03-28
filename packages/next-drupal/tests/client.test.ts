import { Unstable_DrupalClient as DrupalClient } from "../src/client"
import type { DataFormatter, DrupalNode, Logger } from "../src/types"

const BASE_URL = "https://dev-next-drupal-tests.pantheonsite.io"

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
    expect(() => new DrupalClient()).toThrow(
      "Error: The 'baseUrl' param is required."
    )

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => new DrupalClient({})).toThrow(
      "Error: The 'baseUrl' param is required."
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
  test("it accepts custom auth", async () => {
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
    expect(customFetch).toHaveBeenCalledWith(url, {
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        Authorization: "Basic YXJzaGFkQG5leHQtZHJ1cGFsLm9yZzphYmMxMjM=",
      },
      withAuth: true,
    })
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
    ).toThrow("Error: 'clientId' and 'clientSecret' are required for 'auth'")

    expect(() => {
      const client = new DrupalClient(BASE_URL)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      client.auth = {
        clientSecret: "d92Fm^ds",
      }
    }).toThrow("Error: 'clientId' and 'clientSecret' are required for 'auth'")
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
})

describe("headers", () => {
  test("it allows setting custom headers", async () => {
    const customFetch = jest.fn()
    const client = new DrupalClient(BASE_URL, { fetcher: customFetch })
    client.headers = {
      foo: "bar",
    }

    const url = "http://example.com"

    await client.fetch(url)
    expect(customFetch).toHaveBeenCalledWith(url, {
      headers: { foo: "bar" },
    })
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

    expect(customFetch).toHaveBeenCalledWith(url, {
      headers: {
        foo: "bar",
        Authorization: "Basic YXJzaGFkQG5leHQtZHJ1cGFsLm9yZzphYmMxMjM=",
      },
      withAuth: true,
    })
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

  test("it properly handles errors", async () => {
    const client = new DrupalClient(BASE_URL)
    const url = client
      .buildUrl("/jsonapi/node/article", { "filter[foo]": "bar" })
      .toString()

    await expect(client.fetch(url)).rejects.toThrow(
      "400 Bad Request\nInvalid nested filtering. The field `foo`, given in the path `foo`, does not exist."
    )
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
      .mockImplementation(() => null)

    await client.fetch(url.toString(), {
      withAuth: true,
    })

    expect(getAccessTokenSpy).toHaveBeenCalled()
  })

  test("it allows for custom fetcher", async () => {
    const customFetch = jest.fn()

    const client = new DrupalClient(BASE_URL, {
      fetcher: customFetch,
    })
    const url = client.buildUrl("/jsonapi").toString()

    await client.fetch(url)
    expect(customFetch).toHaveBeenCalledWith(url, {
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
    })

    await client.fetch(url, {
      headers: {
        foo: "bar",
      },
    })
    expect(customFetch).toHaveBeenLastCalledWith(url, {
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        foo: "bar",
      },
    })
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

  test("it allows for custom data formatter", async () => {
    const formatter: DataFormatter = {
      deserialize: (
        body: { data: { id: string; attributes: { title: string } } },
        options: { prefix: string }
      ) => {
        return {
          id: body.data.id,
          title: `${options.prefix}: ${body.data.attributes.title}`,
        }
      },
    }
    const client = new DrupalClient(BASE_URL, {
      formatter,
    })
    const url = client.buildUrl(
      "/jsonapi/node/article/52837ad0-f218-46bd-a106-5710336b7053"
    )

    const response = await client.fetch(url.toString())
    const json = await response.json()
    const article = client.deserialize(json, { prefix: "TITLE" }) as DrupalNode

    expect(article).toMatchSnapshot()
    expect(article.id).toEqual("52837ad0-f218-46bd-a106-5710336b7053")
    expect(article.title).toEqual(`TITLE: ${json.data.attributes.title}`)
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
      "Error: Failed to fetch JSON:API index at https://example.com/jsonapi"
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
    ).rejects.toThrow(
      "Error: Resource of type RESOURCE-DOES-NOT-EXIST not found."
    )
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
    ).rejects.toThrow(
      "Error: Resource of type RESOURCE-DOES-NOT-EXIST not found."
    )
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

    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {})
  })

  test("it makes authenticated requests with withAuth", async () => {
    const client = new DrupalClient(BASE_URL)
    const fetchSpy = jest.spyOn(client, "fetch")

    await client.getResource(
      "node--recipe",
      "71e04ead-4cc7-416c-b9ca-60b635fdc50f",
      {
        withAuth: true,
      }
    )

    expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
      withAuth: true,
    })
  })
})
