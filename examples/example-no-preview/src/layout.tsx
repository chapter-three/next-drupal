import Link from "next/link"

export function Layout({ children }) {
  return (
    <div className="max-w-2xl mx-auto px-4">
      <header>
        <div className="container py-4 flex justify-between align-center">
          <Link href="/" passHref>
            <a className="text-xl">Next.js + Drupal</a>
          </Link>
          <nav>
            <ul className="grid grid-cols-2 gap-4">
              <li>
                <Link href="/">
                  <a>Home</a>
                </Link>
              </li>
              <li>
                <Link href="https://github.com/arshad/next-drupal">
                  <a target="_blank">GitHub</a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="py-10">
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  )
}
