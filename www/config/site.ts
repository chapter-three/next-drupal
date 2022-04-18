import { SiteConfig } from "types"

export const site: SiteConfig = {
  name: "Next.js for Drupal",
  description:
    "Everything you expect from Drupal. On a modern stack. Go headless without compromising features.",
  copyright: `Copyright © ${new Date().getFullYear()} Chapter Three. All rights reserved.`,
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
      title: "Contact",
      href: "https://www.chapterthree.com/contact?utm_source=next-drupal&utm_medium=banner",
      external: true,
    },
  ],
  social: {
    github: "chapter-three/next-drupal",
    contact: "https://www.chapterthree.com/contact",
    twitter: "shadcn",
  },
}
