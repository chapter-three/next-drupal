module.exports = {
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "en",
  },
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN],
  },
  async rewrites() {
    return [
      {
        source: "/es",
        destination: "/es/principal",
        locale: false,
      },
      {
        source: "/en/principal",
        destination: "/",
        locale: false,
      },
    ]
  },
}
