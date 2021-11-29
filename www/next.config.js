module.exports = {
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/guides/decoupled-drupal-nextjs",
        destination: "/docs/quick-start",
        permanent: true,
      },
      {
        source: "/learn",
        destination: "/learn/quick-start",
        permanent: false,
      },
      {
        source: "/docs/demo",
        destination: "/docs/examples",
        permanent: true,
      },
    ]
  },
}
