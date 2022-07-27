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
        {
          title: "Known Issues",
          href: "/docs/known-issues",
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
        {
          title: "TypeScript",
          href: "/docs/typescript",
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
      title: "Customization",
      items: [
        {
          title: "Authentication",
          href: "/docs/authentication",
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
      title: "Reference",
      items: [
        {
          title: "getResource",
          href: "/docs/reference/getresource",
        },
        {
          title: "getResourceFromContext",
          href: "/docs/reference/getresourcefromcontext",
        },
        {
          title: "getResourceByPath",
          href: "/docs/reference/getresourcebypath",
        },
        {
          title: "getResourceCollection",
          href: "/docs/reference/getresourcecollection",
        },
        {
          title: "getResourceCollectionFromContext",
          href: "/docs/reference/getresourcecollectionfromcontext",
        },
        {
          title: "createResource",
          href: "/docs/reference/createresource",
        },
        {
          title: "createFileResource",
          href: "/docs/reference/createfileresource",
        },
        {
          title: "updateResource",
          href: "/docs/reference/updateresource",
        },
        {
          title: "deleteResource",
          href: "/docs/reference/deleteresource",
        },
        {
          title: "getStaticPathsFromContext",
          href: "/docs/reference/getstaticpathsfromcontext",
        },
        {
          title: "translatePath",
          href: "/docs/reference/translatepath",
        },
        {
          title: "translatePathFromContext",
          href: "/docs/reference/translatepathfromcontext",
        },
        {
          title: "getPathFromContext",
          href: "/docs/reference/getpathfromcontext",
        },
        {
          title: "getEntryForResourceType",
          href: "/docs/reference/getentryforresourcetype",
        },
        {
          title: "preview",
          href: "/docs/reference/preview",
        },
        {
          title: "getAccessToken",
          href: "/docs/reference/getaccesstoken",
        },
        {
          title: "getMenu",
          href: "/docs/reference/getmenu",
        },
        {
          title: "getView",
          href: "/docs/reference/getview",
        },
        {
          title: "getSearchIndex",
          href: "/docs/reference/getsearch",
        },
        {
          title: "buildUrl",
          href: "/docs/reference/buildurl",
        },
        {
          title: "fetch",
          href: "/docs/reference/fetch",
        },
        {
          title: "deserialize",
          href: "/docs/reference/deserialize",
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
