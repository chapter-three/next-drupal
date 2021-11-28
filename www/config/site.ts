import { SiteConfig } from "types"

export const site: SiteConfig = {
  name: "Next.js for Drupal",
  description:
    "Next.js + Drupal for Incremental Static Regeneration and Preview mode.",
  copyright: `© ${new Date().getFullYear()} Next.js for Drupal`,
  links: [
    {
      title: "Get Started",
      href: "/learn/quick-start",
    },
    {
      title: "Docs",
      href: "/docs",
      activePathNames: ["/docs/[[...slug]]"],
    },
    {
      title: "Examples",
      href: "/docs/demo",
    },
  ],
  social: {
    github: "chapter-three/next-drupal",
  },
}
