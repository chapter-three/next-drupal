import Link from "next/link"
import { useMenu } from "next-drupal"
import { useRouter } from "next/dist/client/router"

export function Layout({ children }) {
  const { asPath } = useRouter()
  const { tree } = useMenu("main")
  return (
    <div className="max-w-screen-md mx-auto">
      <header>
        <div className="container mx-auto flex items-center justify-between py-6">
          <Link href="/" passHref>
            <a className="no-underline text-2xl font-semibold">Brand.</a>
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
      <main className="container mx-auto py-10">{children}</main>
    </div>
  )
}
