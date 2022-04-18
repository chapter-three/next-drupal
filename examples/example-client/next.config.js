module.exports = {
  swcMinify: true,
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
        source: "/blog",
        destination: "/blog/page/0",
      },
      {
        source: "/es",
        destination: "/es/home",
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
