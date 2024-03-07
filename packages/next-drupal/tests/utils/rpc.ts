import { NextDrupalBase } from "../../src"
import { BASE_URL } from "./index"
import type { BaseUrl, NextDrupalBaseOptions } from "../../src"

class JsonRpc extends NextDrupalBase {
  constructor(baseUrl: BaseUrl, options: NextDrupalBaseOptions = {}) {
    super(baseUrl, options)
    this.apiPrefix = "/jsonrpc"
  }

  async execute(body) {
    const endpoint = await jsonRpc.buildEndpoint()

    const response = await jsonRpc.fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      withAuth: true,
    })

    return response.ok
  }
}

const jsonRpc = new JsonRpc(BASE_URL, {
  auth: {
    clientId: process.env["DRUPAL_CLIENT_ID"] as string,
    clientSecret: process.env["DRUPAL_CLIENT_SECRET"] as string,
  },
})

export async function toggleDrupalModule(name: string, status = true) {
  await jsonRpc.execute({
    jsonrpc: "2.0",
    method: "module.toggle",
    params: {
      name,
      status,
    },
    id: "toggle-drupal-module",
  })
}

export async function deleteTestNodes() {
  await jsonRpc.execute({
    jsonrpc: "2.0",
    method: "test_content.clean",
    id: "clean-test-content",
  })
}
