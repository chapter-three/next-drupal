import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/tests/**/*.test.{ts,tsx}"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/fixtures/",
    "/dist/",
    "/.cache/",
    "/drupal/",
  ],
}

export default config
