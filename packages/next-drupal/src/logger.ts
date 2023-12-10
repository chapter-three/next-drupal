import type { Logger } from "./types"

// Default logger. Uses console.
export const logger: Logger = {
  log(message) {
    console.log(`[next-drupal][log]:`, message)
  },
  debug(message) {
    console.debug(`[next-drupal][debug]:`, message)
  },
  warn(message) {
    console.warn(`[next-drupal][debug]:`, message)
  },
  error(message) {
    console.error(`[next-drupal][error]:`, message)
  },
}
