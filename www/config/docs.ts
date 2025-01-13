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
      title: "NextDrupal Client",
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
          title: "Draft Mode",
          href: "/docs/draft-mode",
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
        {
          title: "Pages Router",
          href: "/docs/pages#pages-router",
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
          title: "Deserializer",
          href: "/docs/deserializer",
        },
        {
          title: "Caching",
          href: "/docs/cache",
        },
      ],
    },
    {
      title: "API",
      items: [
        {
          title: "API Reference",
          href: "/docs/api/globals",
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
        {
          title: "Revalidator",
          href: "/docs/revalidator",
        },
        {
          title: "Entity Events",
          href: "/docs/entity-events",
        },
      ],
    },
  ],
}
