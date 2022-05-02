import { DocsConfig } from "types"

export const docsConfig: DocsConfig = {
  links: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "Examples",
          href: "/docs/examples",
        },
        {
          title: "Get Started",
          href: "/learn/quick-start",
        },
        {
          title: "Environment Variables",
          href: "/docs/environment-variables",
        },
        {
          title: "FAQ",
          href: "/docs/faq",
        },
        {
          title: "Changelog",
          href: "https://github.com/chapter-three/next-drupal/blob/main/CHANGELOG.md",
          external: true,
        },
      ],
    },
    {
      title: "Drupal Client",
      badge: "Experimental",
      items: [
        {
          title: "Introduction",
          href: "/docs/client",
        },
        {
          title: "Configuration",
          href: "/docs/client/configuration",
        },
        {
          title: "Authentication",
          href: "/docs/client/auth",
        },
        {
          title: "Fetcher",
          href: "/docs/client/fetcher",
        },
        {
          title: "Serializer",
          href: "/docs/client/serializer",
        },
        {
          title: "Caching",
          href: "/docs/client/cache",
        },
        {
          title: "Preview Mode",
          href: "/docs/client/preview-mode",
        },
        {
          title: "Upgrade Guide",
          href: "/docs/client/upgrade",
        },
      ],
    },
    {
      title: "Data Fetching",
      items: [
        {
          title: "Basic Example",
          href: "/docs/data-fetching",
        },
        {
          title: "Dynamic Pages",
          href: "/docs/data-fetching#dynamic-pages",
        },
        {
          title: "Advanced Example",
          href: "/docs/data-fetching#advanced-example",
        },
        {
          title: "Menus",
          href: "/docs/data-fetching/menus",
        },
        {
          title: "Blocks",
          href: "/docs/data-fetching/blocks",
        },
        {
          title: "Views",
          href: "/docs/data-fetching/views",
        },
        {
          title: "Filter by Site",
          href: "/docs/data-fetching/filter-by-site",
        },
      ],
    },
    {
      title: "Authentication",
      items: [
        {
          title: "Introduction",
          href: "/docs/authentication",
        },
        {
          title: "Password Grant",
          href: "/docs/authentication/password-grant",
        },
        {
          title: "Authorization Code Grant",
          href: "/docs/authentication/authorization-code-grant",
        },
        {
          title: "Refresh Token Rotation",
          href: "/docs/authentication/refresh-token",
        },
      ],
    },
    {
      title: "Reference",
      items: [
        {
          title: "getPathsFromContext",
          href: "/docs/reference#getpathsfromcontext",
        },

        {
          title: "getResourceTypeFromContext",
          href: "/docs/reference#getresourcetypefromcontext",
        },
        {
          title: "getResource",
          href: "/docs/reference#getresource",
        },
        {
          title: "getResourceFromContext",
          href: "/docs/reference#getresourcefromcontext",
        },
        {
          title: "getResourceByPath",
          href: "/docs/reference#getresourcebypath",
        },
        {
          title: "getResourceCollection",
          href: "/docs/reference#getresourcecollection",
        },
        {
          title: "getResourceCollectionFromContext",
          href: "/docs/reference#getresourcecollectionfromcontext",
        },
        {
          title: "getMenu",
          href: "/docs/reference#getmenu",
        },
        {
          title: "getView",
          href: "/docs/reference#getview",
        },
        {
          title: "translatePath",
          href: "/docs/reference#translatepath",
        },
        {
          title: "translatePathFromContext",
          href: "/docs/reference#translatepathfromcontext",
        },
      ],
    },
    {
      title: "Hooks",
      items: [
        {
          title: "useMenu",
          href: "/docs/hooks#useMenu",
        },
      ],
    },
    {
      title: "Drupal",
      items: [
        {
          title: "SitePreviewer",
          href: "/docs/site-previewer",
        },
        {
          title: "SiteResolver",
          href: "/docs/site-resolver",
        },
      ],
    },
  ],
}
