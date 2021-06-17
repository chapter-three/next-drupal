import { SiteConfig } from "@/core/types"

export const site: SiteConfig = {
  name: "Next.js for Drupal",
  description:
    "Next.js + Drupal for Incremental Static Regeneration and Preview mode.",
  copyright: `© ${new Date().getFullYear()} Next.js for Drupal - Development sponsored by <a href="https://chapterthree.com" target="_blank">Chapter Three</a>.`,
  links: [
    {
      title: "Docs",
      url: "/docs",
    },
    {
      title: "Demo",
      url: "/docs/demo",
    },
    {
      title: "GitHub",
      url: "https://github.com/chapter-three/next-drupal",
      external: true,
    },
    {
      title: "Drupal",
      url: "https://drupal.org/project/next",
      external: true,
    },
  ],
  social: {
    github: "chapter-three/next-drupal",
  },
}
