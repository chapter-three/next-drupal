/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
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
  coveragePathIgnorePatterns: ["./src/get-*"],
  coverageReporters: ["lcov", "text", "text-summary"],
  coverageThreshold: {
    global: {
      // @TODO Make these thresholds strict once #608 is completed.
      statements: 50, // 55.1,
      branches: 80, // 84.16,
      functions: 70, // 72.41,
      lines: 50, // 55.1,
    },
  },
}
