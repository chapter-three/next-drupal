import { SiteConfig } from "types"

export const site: SiteConfig = {
  name: "Next.js for Drupal",
  description:
    "Everything you expect from Drupal. On a modern stack. Go headless without compromising features.",
  copyright: `Copyright © ${new Date().getFullYear()} Kanopi Studios. All rights reserved.`,
  links: [
    {
      title: "Get Started",
      href: "/learn/quick-start",
      activePathNames: ["/learn/[...slug]"],
    },
    {
      title: "Learn",
      href: "/learn",
      activePathNames: ["/learn/[...slug]"],
    },
    {
      title: "Docs",
      href: "/docs",
      activePathNames: ["/docs/[[...slug]]"],
    },
    {
      title: "Guides",
      href: "/guides",
      activePathNames: ["/guides/[...slug]"],
    },
    {
      title: "API",
      href: "/api/modules",
    },
    {
      title: "Blog",
      href: "/blog",
      activePathNames: ["/blog/[...slug]"],
    },
    {
      title: "Contact",
      href: "https://kanopi.com/contact",
      external: true,
    },
  ],
  social: {
    github: "chapter-three/next-drupal",
    contact: "https://kanopi.com/contact",
    twitter: "chapter_three",
  },
  versions: [
    {
      version: "v2.0.0",
      active: true,
    },
    {
      version: "v1.6.0",
      url: "https://v1-6.next-drupal.org",
    },
    {
      version: "canary",
      url: "https://next.next-drupal.org",
    },
  ],
}
