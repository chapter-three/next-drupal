import { SiteConfig } from "types"

export const site: SiteConfig = {
  name: "Next.js for Drupal",
  description:
    "Next.js + Drupal for Incremental Static Regeneration and Preview mode.",
  copyright: `© ${new Date().getFullYear()} Next.js for Drupal`,
  links: [
    {
      title: "Docs",
      url: "/docs",
    },
    {
      title: "Examples",
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
    {
      title: "Slack",
      url: "https://drupal.slack.com/archives/C01E36BMU72",
      external: true,
    },
  ],
  social: {
    github: "chapter-three/next-drupal",
  },
}
