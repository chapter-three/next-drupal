import Link from "next/link"

import { PreviewAlert } from "components/preview-alert"

export function Layout({ children }) {
  return (
    <>
      <PreviewAlert />
      <header>
        <div className="container flex items-center justify-between max-w-4xl py-6 mx-auto">
          <Link href="/" passHref>
            <a className="text-2xl font-semibold no-underline">
              Next.js for Drupal
            </a>
          </Link>
          <Link href="https://next-drupal.org/docs" passHref>
            <a target="_blank" rel="external" className="hover:text-blue-600">
              Read the docs
            </a>
          </Link>
        </div>
      </header>
      <main className="container max-w-4xl py-10 mx-auto">{children}</main>
    </>
  )
}
