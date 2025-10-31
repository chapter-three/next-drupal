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
        source: "/docs/client/deserializer",
        destination: "/docs/deserializer",
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
        destination: "/docs/draft-mode",
        permanent: true,
      },
      {
        source: "/docs/data-fetching",
        destination: "/docs/pages",
        permanent: true,
      },
      {
        source: "/docs/reference",
        destination: "/docs/reference/getresource",
        permanent: true,
      },
      {
        source: "/guides/typescript",
        destination: "/docs/typescript",
        permanent: true,
      },
      {
        source: "/guides/on-demand-revalidation",
        destination: "/learn/on-demand-revalidation",
        permanent: true,
      },
      {
        source: "/docs/on-demand-revalidation",
        destination: "/learn/on-demand-revalidation",
        permanent: true,
      },
      {
        source: "/docs/api/:path*.mdx",
        destination: "/docs/api/:path*",
        permanent: true,
      },
      {
        source: "/api/:path*.html",
        destination: "/api/:path*",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/api/:slug*",
        destination: "/api/:slug*.html", // Matched parameters can be used in the destination
      },
    ]
  },
}
