import { SiteConfig } from "types"

export const site: SiteConfig = {
  name: "Next.js for Drupal",
  description:
    "Everything you expect from Drupal. On a modern stack. Go headless without compromising features.",
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
      href: "/docs/examples",
    },
  ],
  social: {
    github: "chapter-three/next-drupal",
    twitter: "shadcn",
  },
}
