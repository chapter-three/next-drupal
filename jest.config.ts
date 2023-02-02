import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/tests/**/*.test.{ts,tsx}"],
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
