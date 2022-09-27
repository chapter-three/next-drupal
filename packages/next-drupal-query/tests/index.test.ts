// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { expect } from "@jest/globals"

import { queries } from "./queries"

describe("getParams", () => {
  test("it returns params for a query", () => {
    const params = queries.getParams("params-only")

    expect(params.getQueryObject()).toMatchSnapshot()
  })

  test("it accepts params options", () => {
    const params = queries.getParams("params-with-opts", {
      fields: ["foo", "bar"],
    })

    expect(params.getQueryObject()).toMatchSnapshot()
  })

  test("it allows params to be nested", () => {
    const params = queries.getParams("params-nested")

    expect(params.getQueryObject()).toMatchSnapshot()
  })

  test("it throws an error if query does not exist", () => {
    expect(() => queries.getParams("does-not-exist")).toThrow(
      "Query with id 'does-not-exist' not found."
    )
  })

  test("it throws an error if query does not define params", () => {
    expect(() => queries.getParams("data-only")).toThrow(
      "No params defined for query with id 'data-only'."
    )
  })
})

describe("getData", () => {
  test("it returns data for a query", async () => {
    const data = await queries.getData("data-only")

    expect(data).toMatchSnapshot()
  })

  test("it accepts data options", async () => {
    const data = await queries.getData("data-with-opts", { id: "ID" })

    expect(data).toMatchSnapshot()
  })

  test("it throws an error if query does not exist", async () => {
    await expect(queries.getData("does-not-exist")).rejects.toThrow(
      "Query with id 'does-not-exist' not found."
    )
  })

  test("it throws an error if query does not define data", async () => {
    await expect(queries.getData("params-only")).rejects.toThrow(
      "No data or placeholder defined for query with id 'params-only'."
    )
  })

  test("it does NOT throw error if a query does not define data but defines a placeholder", async () => {
    await expect(queries.getData("placeholder-only")).resolves.not.toThrow()
  })

  test("it returns placeholder data if a query does not define data", async () => {
    const data = await queries.getData("placeholder-only")

    expect(data).toMatchSnapshot()
  })

  test("it accepts placeholder options", async () => {
    const data = await queries.getData("placeholder-with-opts", {
      email: "name@example.com",
    })

    expect(data).toMatchSnapshot()
  })

  test("it returns data when both data and placeholder is defined", async () => {
    const data = await queries.getData("data-with-placeholder", {
      email: "foo@example.com",
    })

    expect(data).toMatchSnapshot()
  })

  test("it returns formatted data if a formatter is defined", async () => {
    const data = await queries.getData("data-with-formatter", {
      email: "foo@example.com",
    })

    expect(data).toMatchSnapshot()
  })
})

describe("formatData", () => {
  test("it formats data", () => {
    expect(
      queries.formatData("formatter-only", {
        firstName: "First",
        lastName: "Last",
      })
    ).toMatchSnapshot()
  })
})
