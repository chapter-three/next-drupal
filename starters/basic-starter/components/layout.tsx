import Link from "next/link"
import { useMenu } from "next-drupal"
import { useRouter } from "next/router"

import { PreviewAlert } from "@/components/preview-alert"

export function Layout({ children }) {
  const { asPath } = useRouter()
  const { tree } = useMenu("main")

  return (
    <>
      <PreviewAlert />
      <div className="max-w-screen-md px-6 mx-auto">
        <header>
          <div className="container flex items-center justify-between py-6 mx-auto">
            <Link href="/" passHref>
              <a className="text-2xl font-semibold no-underline">Brand.</a>
            </Link>
            <nav>
              <ul className={`flex`}>
                {tree?.map((link) => (
                  <li key={link.url}>
                    <Link href={link.url} passHref>
                      <a
                        className={`ml-10 hover:text-blue-600 ${
                          asPath === link.url ? "underline" : "no-underline"
                        }`}
                      >
                        {link.title}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main className="container py-10 mx-auto">{children}</main>
      </div>
    </>
  )
}
