import Link from "next/link"

const links = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "GitHub",
    href: "https://github.com/arshad/next-drupal",
  },
  {
    title: "Twitter",
    href: "https://twitter.com/arshadcn",
  },
]

export function Layout({ children }) {
  return (
    <div maxW="640px" mx="auto">
      <header>
        <div
          variant="container"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py="4"
        >
          <Link href="/" passHref>
            <a
              textDecoration="none"
              color="text"
              fontSize="lg"
              fontWeight="semibold"
            >
              Next.js + Drupal
            </a>
          </Link>
          <nav>
            <ul display="grid" col={links.length} gap="4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} passHref>
                    <a textDecoration="none" color="text" fontSize="sm">
                      {link.title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main variant="container" py="10">
        {children}
      </main>
    </div>
  )
}
