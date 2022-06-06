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
        source: "/docs/quick-start",
        destination: "/learn",
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
      {
        source: "/docs/search-api",
        destination: "/docs/guides/search-api",
        permanent: true,
      },
      {
        source: "/docs/data-fetching/:slug*",
        destination: "/docs/pages/:slug*",
        permanent: true,
      },
      {
        source: "/docs/guides/:slug*",
        destination: "/guides/:slug*",
        permanent: true,
      },
      {
        source: "/docs/data-fetching/filter-by-site",
        destination: "/guides/filter-by-site",
        permanent: true,
      },
      {
        source: "/docs/client/upgrade",
        destination: "/docs/upgrade-guide",
        permanent: true,
      },
      {
        source: "/docs/client/fetcher",
        destination: "/docs/fetcher",
        permanent: true,
      },
      {
        source: "/docs/client/serializer",
        destination: "/docs/serializer",
        permanent: true,
      },
      {
        source: "/docs/client/cache",
        destination: "/docs/cache",
        permanent: true,
      },
      {
        source: "/docs/client/auth",
        destination: "/docs/authentication",
        permanent: true,
      },
      {
        source: "/docs/auth",
        destination: "/docs/authentication",
        permanent: true,
      },
      {
        source: "/docs/client/configuration",
        destination: "/docs/configuration",
        permanent: true,
      },
      {
        source: "/docs/client/preview-mode",
        destination: "/docs/preview-mode",
        permanent: true,
      },
      {
        source: "/docs/data-fetching",
        destination: "/docs/pages",
        permanent: true,
      },
    ]
  },
}
