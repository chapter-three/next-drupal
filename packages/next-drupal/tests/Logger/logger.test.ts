import { describe, expect, jest, test } from "@jest/globals"
import {
  LOG_MESSAGE_PREFIX,
  DEBUG_MESSAGE_PREFIX,
  WARN_MESSAGE_PREFIX,
  ERROR_MESSAGE_PREFIX,
  logger,
} from "../../src/logger"
import type { Logger } from "../../src"

test("is type Logger", () => {
  // At compile time, compilation will fail if not a Logger type.
  const test: Logger = logger

  // At run-time, we just check for object.
  expect(typeof test === "object").toBe(true)
})

describe("method: debug", () => {
  test("logs a message", () => {
    const consoleSpy = jest
      .spyOn(console, "debug")
      .mockImplementation((message) => message)
    const message = "Test debug message"

    logger.debug(message)

    expect(consoleSpy).toHaveBeenCalledWith(DEBUG_MESSAGE_PREFIX, message)
  })
})

describe("method: error", () => {
  test("logs a message", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation((message) => message)
    const message = "Test error message"

    logger.error(message)

    expect(consoleSpy).toHaveBeenCalledWith(ERROR_MESSAGE_PREFIX, message)
  })
})

describe("method: log", () => {
  test("logs a message", () => {
    const consoleSpy = jest
      .spyOn(console, "log")
      .mockImplementation((message) => message)
    const message = "Test log message"

    logger.log(message)

    expect(consoleSpy).toHaveBeenCalledWith(LOG_MESSAGE_PREFIX, message)
  })
})

describe("method: warn", () => {
  test("logs a message", () => {
    const consoleSpy = jest
      .spyOn(console, "warn")
      .mockImplementation((message) => message)
    const message = "Test warn message"

    logger.warn(message)

    expect(consoleSpy).toHaveBeenCalledWith(WARN_MESSAGE_PREFIX, message)
  })
})
