import { SiteConfig } from "types"

export const site: SiteConfig = {
  name: "Next.js for Drupal",
  description:
    "Everything you expect from Drupal. On a modern stack. Go headless without compromising features.",
  copyright: {
    text: `© ${new Date().getFullYear()} Next.js for Drupal by %link`,
    link: {
      title: "Chapter Three",
      href: "https://www.chapterthree.com",
    },
  },
  contact: {
    text: `Contact %link for your Next Project`,
    link: {
      href: "https://www.chapterthree.com/contact",
      title: "Chapter Three",
    },
  },
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
    {
      title: "Contact",
      href: "https://www.chapterthree.com/contact",
    },
  ],
  social: {
    github: "chapter-three/next-drupal",
    twitter: "shadcn",
  },
}
