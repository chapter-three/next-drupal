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
  coveragePathIgnorePatterns: [
    "./src/deprecated/*",
    "./src/deprecated.ts",
    "./src/navigation.ts",
    "./src/types/*",
  ],
  coverageReporters: ["lcov", "text", "text-summary"],
  coverageThreshold: {
    global: {
      statements: 82.07,
      branches: 86.9,
      functions: 80.76,
      lines: 82.07,
    },
  },
}
