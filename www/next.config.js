module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/docs",
        permanent: false,
      },
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
    ]
  },
}
