import { Experiment_DrupalClient as DrupalClient } from "../src/client"

// Run all tests against this env until we configure CI to setup a Drupal instance.
// TODO: Bootstrap and expose the /drupal env for testing.
export const BASE_URL = process.env.DRUPAL_BASE_URL

const client = new DrupalClient(process.env.DRUPAL_BASE_URL, {
  auth: {
    clientId: process.env.DRUPAL_CLIENT_ID,
    clientSecret: process.env.DRUPAL_CLIENT_SECRET,
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
