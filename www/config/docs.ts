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
          title: "Demo",
          href: "https://demo.next-drupal.org",
          external: true,
        },
        {
          title: "Frequenty Asked Questions",
          href: "/docs/faq",
        },
        {
          title: "Upgrade Guide",
          href: "/docs/upgrade-guide",
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
      items: [
        {
          title: "Introduction",
          href: "/docs/client",
        },
        {
          title: "Configuration",
          href: "/docs/configuration",
        },
        {
          title: "Environment Variables",
          href: "/docs/environment-variables",
        },
        {
          title: "Preview Mode",
          href: "/docs/preview-mode",
        },
      ],
    },
    {
      title: "Customization",
      items: [
        {
          title: "Authentication",
          href: "/docs/auth",
        },
        {
          title: "Fetcher",
          href: "/docs/fetcher",
        },
        {
          title: "Serializer",
          href: "/docs/serializer",
        },
        {
          title: "Caching",
          href: "/docs/cache",
        },
      ],
    },
    {
      title: "Working with JSON:API",
      items: [
        {
          title: "Fetching Resources (GET)",
          href: "/docs/fetching-resources",
        },
        {
          title: "Creating Resources (POST)",
          href: "/docs/creating-resources",
        },
        {
          title: "Updating Resources (PATCH)",
          href: "/docs/updating-resources",
        },
        {
          title: "Deleting Resources (DELETE)",
          href: "/docs/deleting-resources",
        },
      ],
    },
    {
      title: "Building Pages",
      items: [
        {
          title: "Basic Example",
          href: "/docs/pages",
        },
        {
          title: "Dynamic Pages",
          href: "/docs/pages#dynamic-pages",
        },
        {
          title: "Advanced Example",
          href: "/docs/pages#advanced-example",
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
