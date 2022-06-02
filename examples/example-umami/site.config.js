module.exports = {
  name: "Umami",
  slogan: "The Umami demo site built as a headless Drupal with Next.js",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  drupalBaseUrl: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  defaultLocale: "en",
  locales: {
    en: "English",
    es: "Español",
  },
}
