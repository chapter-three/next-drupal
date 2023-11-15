import type { Config } from "@jest/types"

let mappedModule: string
switch (process.env.TEST_ENV) {
  // Depending on the TEST_ENV, we test the src or one of the builds.
  case "esm":
    mappedModule = "<rootDir>/packages/next-drupal/dist/index.modern.js"
    break
  case "cjs":
    mappedModule = "<rootDir>/packages/next-drupal/dist/index.cjs"
    break
  default:
    mappedModule = "<rootDir>/packages/next-drupal/src/index.ts"
}

const config: Config.InitialOptions = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/tests/**/*.test.{ts,tsx}"],
  moduleNameMapper: {
    "^next-drupal-build-testing$": mappedModule,
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/fixtures/",
    "/dist/",
    "/.cache/",
    "/drupal/",
  ],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
}

export default config
