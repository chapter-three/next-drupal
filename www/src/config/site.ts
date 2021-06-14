import { SiteConfig } from "@/core/types"

export const site: SiteConfig = {
  name: "Next.js for Drupal",
  description:
    "Next.js + Drupal for Incremental Static Regeneration and Preview mode.",
  copyright: `© ${new Date().getFullYear()} Next.js for Drupal - Project maintained by <a href="https://chapterthree.com" target="_blank">Chapter Three</a>.`,
  links: [
    {
      title: "Documentation",
      url: "/",
    },
    {
      title: "Demo",
      url: "/demo",
    },
    {
      title: "GitHub",
      url: "https://github.com/chapter-three/next-drupal",
      external: true,
    },
  ],
  social: {
    github: "chapter-three/next-drupal",
    twitter: "arshadcn",
  },
}
