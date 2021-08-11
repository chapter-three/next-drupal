import { DocsConfig } from "@/core/types"

export const docs: DocsConfig = {
  links: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          url: "/docs",
        },
        {
          title: "Quick Start",
          url: "/docs/quick-start",
        },
      ],
    },
    {
      title: "Examples",
      items: [
        {
          title: "List of nodes",
          url: "/docs/examples#list-of-nodes",
        },
        {
          title: "Node page",
          url: "/docs/examples#node-page",
        },
      ],
    },
    {
      title: "Reference",
      items: [
        {
          title: "getPathsFromContext",
          url: "/docs/reference#getpathsfromcontext",
        },

        {
          title: "getResourceTypeFromContext",
          url: "/docs/reference#getresourcetypefromcontext",
        },
        {
          title: "getResource",
          url: "/docs/reference#getresource",
        },
        {
          title: "getResourceFromContext",
          url: "/docs/reference#getresourcefromcontext",
        },
        {
          title: "getResourceByPath",
          url: "/docs/reference#getresourcebypath",
        },
        {
          title: "getResourceCollection",
          url: "/docs/reference#getresourcecollection",
        },
        {
          title: "getResourceCollectionFromContext",
          url: "/docs/reference#getresourcecollectionfromContext",
        },
        {
          title: "getMenu",
          url: "/docs/reference#getmenu",
        },
      ],
    },
    {
      title: "Hooks",
      items: [
        {
          title: "useMenu",
          url: "/docs/hooks#useMenu",
        },
      ],
    },
    {
      title: "Guides",
      items: [
        {
          title: "Inline Images",
          url: "/docs/guides/inline-images",
        },
        {
          title: "Route Syncing",
          url: "/docs/guides/route-syncing",
        },
      ],
    },
    {
      title: "Drupal",
      items: [
        {
          title: "SitePreviewer",
          url: "/docs/site-previewer",
        },
        {
          title: "SiteResolver",
          url: "/docs/site-resolver",
        },
      ],
    },
  ],
}
