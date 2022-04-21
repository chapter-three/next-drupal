export function absoluteURL(uri: string) {
  return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${uri}`
}

export function formatDate(input: string): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}
