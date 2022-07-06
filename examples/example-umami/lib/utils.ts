import siteConfig from "site.config"

export function truncate(value: string, length: number, suffix = "...") {
  if (value.length < length) {
    return value
  }

  return value.slice(0, length) + suffix
}

export function absoluteURL(uri: string) {
  return `${siteConfig.drupalBaseUrl}${uri}`
}

export function formatDate(input: string): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function isRelative(url: string) {
  return !new RegExp("^(?:[a-z]+:)?//", "i").test(url)
}
