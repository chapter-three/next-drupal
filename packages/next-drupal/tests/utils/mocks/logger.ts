import { Logger } from "../../../src"

export function mockLogger(): Logger {
  return {
    log: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }
}
