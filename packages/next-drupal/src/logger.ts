import type { Logger } from "./types"

export const LOG_MESSAGE_PREFIX = "[next-drupal][log]:"
export const DEBUG_MESSAGE_PREFIX = "[next-drupal][debug]:"
export const WARN_MESSAGE_PREFIX = "[next-drupal][warn]:"
export const ERROR_MESSAGE_PREFIX = "[next-drupal][error]:"

// Default logger. Uses console.
export const logger: Logger = {
  log(message) {
    console.log(LOG_MESSAGE_PREFIX, message)
  },
  debug(message) {
    console.debug(DEBUG_MESSAGE_PREFIX, message)
  },
  warn(message) {
    console.warn(WARN_MESSAGE_PREFIX, message)
  },
  error(message) {
    console.error(ERROR_MESSAGE_PREFIX, message)
  },
}
