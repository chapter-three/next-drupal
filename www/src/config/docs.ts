import { NavLinks } from "types"

interface DocsConfig {
  links: NavLinks
}

export const docs: DocsConfig = {
  links: [
    {
      title: "Links",
      items: [
        {
          title: "Demo",
          url: "/demo",
        },
        {
          title: "Drupal module",
          url: "https://drupal.org/project/next",
          external: true,
        },
      ],
    },
    {
      title: "Drupal",
      items: [
        {
          title: "Installation",
          url: "/installation",
        },
        {
          title: "Preview Mode",
          url: "/preview-mode",
        },
        {
          title: "Plugins",
          items: [
            {
              title: "SitePreviewer",
              url: "/site-previewer",
            },
            {
              title: "SiteResolver",
              url: "/site-resolver",
            },
          ],
        },
      ],
    },
    {
      title: "Next.js",
      items: [
        {
          title: "Installation",
          url: "/nextjs-installation",
        },
        {
          title: "Preview Mode",
          url: "/nextjs-preview-mode",
        },
        {
          title: "Reference",
          url: "/nextjs-reference",
        },
      ],
    },
  ],
}
