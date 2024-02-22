import { DrupalClient } from "../../src"
import { BASE_URL } from "./index"

const client = new DrupalClient(BASE_URL, {
  auth: {
    clientId: process.env["DRUPAL_CLIENT_ID"] as string,
    clientSecret: process.env["DRUPAL_CLIENT_SECRET"] as string,
  },
})

export async function executeRPC(body) {
  const url = client.buildUrl("/jsonrpc")

  const response = await client.fetch(url.toString(), {
    method: "POST",
    body: JSON.stringify(body),
    withAuth: true,
  })

  return response.ok
}

export async function toggleDrupalModule(name: string, status = true) {
  await executeRPC({
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
  await executeRPC({
    jsonrpc: "2.0",
    method: "test_content.clean",
    id: "clean-test-content",
  })
}
