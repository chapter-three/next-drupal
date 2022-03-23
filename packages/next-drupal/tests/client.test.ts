import { Unstable_DrupalClient as DrupalClient } from "../src/client"
import { DataFormatter, DrupalNode, FetchOptions } from "../src/types"

const BASE_URL = "https://dev-next-drupal-tests.pantheonsite.io"

describe("DrupalClient", () => {
  test("it properly constructs a DrupalClient", () => {
    expect(new DrupalClient({ baseUrl: BASE_URL })).toBeInstanceOf(DrupalClient)
  })

  test("it throws error for invalid constructor arguments", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => new DrupalClient()).toThrow(
      "Error: The 'baseUrl' option is required."
    )

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => new DrupalClient({})).toThrow(
      "Error: The 'baseUrl' option is required."
    )
  })

  test("it correctly formats apiPrefix", () => {
    const client = new DrupalClient({ baseUrl: BASE_URL })
    expect(client.apiPrefix).toBe("/jsonapi")

    const client2 = new DrupalClient({
      baseUrl: BASE_URL,
      apiPrefix: "/api",
    })
    expect(client2.apiPrefix).toBe("/api")

    const client3 = new DrupalClient({
      baseUrl: BASE_URL,
      apiPrefix: "api",
    })
    expect(client3.apiPrefix).toBe("/api")
  })

  test("it has a debug mode", async () => {
    const consoleSpy = jest.spyOn(console, "log")

    const client = new DrupalClient({
      baseUrl: BASE_URL,
      debug: true,
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      "[next-drupal][debug]: Debug mode is on."
    )
    expect(client.debug).toBe(true)
  })
})

describe("getIndex", () => {
  test("it fetches the JSON:API index", async () => {
    const client = new DrupalClient({ baseUrl: BASE_URL })
    const index = await client.getIndex()

    expect(index).toMatchSnapshot()
  })

  test("it fetches the JSON:API index with locale", async () => {
    const client = new DrupalClient({ baseUrl: BASE_URL })
    const index = await client.getIndex("es")

    expect(index).toMatchSnapshot()
  })

  test("it throws error for invalid base url", async () => {
    const client = new DrupalClient({
      baseUrl: "https://next-drupal.org",
    })

    await expect(client.getIndex()).rejects.toThrow(
      "Error: Failed to fetch JSON:API index at https://next-drupal.org/jsonapi"
    )
  })
})

describe("getEntryForResourceType", () => {
  test("it returns the JSON:API entry for a resource type", async () => {
    const client = new DrupalClient({ baseUrl: BASE_URL })
    const getIndexSpy = jest.spyOn(client, "getIndex")

    const recipeEntry = await client.getEntryForResourceType("node--recipe")
    expect(recipeEntry).toMatch(`${BASE_URL}/en/jsonapi/node/recipe`)
    expect(getIndexSpy).toHaveBeenCalledTimes(1)

    const articleEntry = await client.getEntryForResourceType("node--article")
    expect(articleEntry).toMatch(`${BASE_URL}/en/jsonapi/node/article`)
    expect(getIndexSpy).toHaveBeenCalledTimes(2)
  })

  test("it assembles JSON:API entry without fetching index", async () => {
    const client = new DrupalClient({
      baseUrl: BASE_URL,
      useDefaultResourceTypeEntry: true,
    })
    const getIndexSpy = jest.spyOn(client, "getIndex")

    const recipeEntry = await client.getEntryForResourceType("node--article")
    expect(recipeEntry).toMatch(`${BASE_URL}/jsonapi/node/article`)
    expect(getIndexSpy).toHaveBeenCalledTimes(0)
  })

  test("it throws an error if resource type does not exist", async () => {
    const client = new DrupalClient({ baseUrl: BASE_URL })

    await expect(
      client.getEntryForResourceType("RESOURCE-DOES-NOT-EXIST")
    ).rejects.toThrow(
      "Error: Resource of type RESOURCE-DOES-NOT-EXIST not found."
    )
  })
})

describe("buildUrl", () => {
  const client = new DrupalClient({ baseUrl: BASE_URL })

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
    const client = new DrupalClient({ baseUrl: BASE_URL })
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
    const client = new DrupalClient({ baseUrl: BASE_URL })
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
    const dataFormatter: DataFormatter = {
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
    const client = new DrupalClient({
      baseUrl: BASE_URL,
      dataFormatter,
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

describe("fetch", () => {
  test("it allows fetching custom url", async () => {
    const client = new DrupalClient({ baseUrl: BASE_URL })
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
    const client = new DrupalClient({ baseUrl: BASE_URL })
    const url = client
      .buildUrl("/jsonapi/node/article", { "filter[foo]": "bar" })
      .toString()

    await expect(client.fetch(url)).rejects.toThrow(
      "400 Bad Request\nInvalid nested filtering. The field `foo`, given in the path `foo`, does not exist."
    )
  })

  test("it allows authenticated requests", async () => {
    const client = new DrupalClient({
      baseUrl: BASE_URL,
      clientId: "7795065e-8ad0-45eb-a64d-73d9f3a5e943",
      clientSecret: "d92Fm^ds",
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

    const client = new DrupalClient({
      baseUrl: BASE_URL,
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

    const customFetch2 = jest.fn()
    client.fetcher = customFetch2

    await client.fetch(url, {
      headers: {
        foo: "bar",
      },
    })
    expect(customFetch2).toHaveBeenCalledWith(url, {
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        foo: "bar",
      },
    })
  })

  test("it accepts custom auth", async () => {
    const customAuth = jest
      .fn()
      .mockReturnValue("Basic YXJzaGFkQG5leHQtZHJ1cGFsLm9yZzphYmMxMjM=")
    const customFetch = jest.fn()

    const client = new DrupalClient({
      baseUrl: BASE_URL,
      auth: customAuth,
      fetcher: customFetch,
    })
    const url = client.buildUrl("/jsonapi").toString()

    await client.fetch(url, { withAuth: true })
    expect(customAuth).toHaveBeenCalled()
    expect(customFetch).toHaveBeenCalledWith(url, {
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        Authorization: "Basic YXJzaGFkQG5leHQtZHJ1cGFsLm9yZzphYmMxMjM=",
      },
    })
  })
})
