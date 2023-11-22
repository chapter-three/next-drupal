/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/tests/**/*.test.{ts,tsx}"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  coverageProvider: "v8",
  collectCoverage: true,
  collectCoverageFrom: ["./src/**"],
  coverageReporters: ["lcov", "text", "text-summary"],
  coverageThreshold: {
    global: {
      statements: 85.11,
      branches: 58,
      functions: 70,
      lines: 85.11,
    },
  },
}
