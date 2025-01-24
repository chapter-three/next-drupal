import { Link } from "@/components/navigation/Link"

export function HeaderNav() {
  return (
    <header>
      <div className="container flex items-center justify-between py-6 mx-auto">
        <Link href="/" className="text-2xl font-semibold no-underline">
          Next.js for Drupal
        </Link>
        <Link
          href="https://next-drupal.org/docs"
          target="_blank"
          rel="external"
          className="hover:text-blue-600"
        >
          Read the docs
        </Link>
      </div>
    </header>
  )
}
