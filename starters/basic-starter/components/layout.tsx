import Link from "next/link"
import { useRouter } from "next/router"
import { DrupalMenuLinkContent } from "next-drupal"

import { PreviewAlert } from "@/components/preview-alert"

export interface LayoutProps {
  menus: {
    main: DrupalMenuLinkContent[]
  }
}

export function Layout({ menus, children }) {
  const { asPath } = useRouter()

  return (
    <>
      <PreviewAlert />
      <div className="max-w-screen-md px-6 mx-auto">
        <header>
          <div className="container flex items-center justify-between py-6 mx-auto">
            <Link href="/" passHref>
              <a className="text-2xl font-semibold no-underline">Brand.</a>
            </Link>
            {menus?.main && (
              <nav>
                <ul className={`flex`}>
                  {menus.main?.map((link) => (
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
            )}
          </div>
        </header>
        <main className="container py-10 mx-auto">{children}</main>
      </div>
    </>
  )
}
