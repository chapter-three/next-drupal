import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import classNames from "classnames"
import { NextSeo } from "next-seo"

import { site } from "config/site"
import { docs } from "config/docs"
import { DocSearch } from "components/doc-search"
import { SidebarNav } from "components/sidebar-nav"

interface LayoutProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function Layout({
  title = "",
  description = "",
  children,
}: LayoutProps) {
  const [showMenu, setShowMenu] = React.useState<boolean>(false)

  const { asPath: path, pathname } = useRouter()
  return (
    <>
      <NextSeo
        title={path === "/" ? site.name : `${title} - ${site.name}`}
        description={description}
        canonical={`${process.env.NEXT_PUBLIC_BASE_URL}${path}`}
        openGraph={{
          title,
          description,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}${path}`,
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/meta.jpg`,
              width: 800,
              height: 600,
            },
          ],
        }}
      />
      <div
        className={classNames(
          "fixed z-50 block p-6 overflow-auto bg-white bottom-0 transition-transform top-14 border-r border-t lg:hidden",
          showMenu ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ul className="grid grid-flow-row gap-2 mb-8 auto-rows-max">
          <li>
            <Link href="/" passHref>
              <a
                className={classNames(
                  "text-sm font-medium hover:underline",
                  pathname === "/" ? "text-blue-600" : "text-gray-700"
                )}
              >
                Home
              </a>
            </Link>
          </li>
          {site.links.map((link, index) => {
            const isActive =
              pathname === link.href || link.activePathNames?.includes(pathname)
            return (
              <li key={index}>
                <Link href={link.href} passHref>
                  <a
                    className={classNames(
                      "text-sm font-medium hover:underline",
                      isActive ? "text-blue-600" : "text-gray-700"
                    )}
                    target={link.external ? "_blank" : "_self"}
                    rel={link.external ? "noreferrer" : ""}
                  >
                    {link.title}
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
        <SidebarNav items={docs.links} />
      </div>
      <div className="flex flex-col min-h-screen">
        <header
          className={classNames("sticky lg:static top-0 bg-white z-10", {
            "border-b": pathname !== "/",
          })}
        >
          <div className="container flex items-center justify-between px-6 mx-auto h-14 xl:h-20 xl:px-4">
            <div className="flex items-center justify-between">
              <button
                className="relative flex w-6 h-6 mr-4 transition-all lg:hidden"
                onClick={() => setShowMenu(!showMenu)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={classNames(
                    "w-6 h-6 absolute top-0 left-0 transition-all",
                    showMenu ? "opacity-0" : "opacity-100"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={classNames(
                    "w-6 h-6 absolute top-0 left-0 transition-all",
                    showMenu ? "opacity-100" : "opacity-0"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="sr-only">Toggle Menu</span>
              </button>
              <Link href="/" passHref>
                <a className="items-center hidden text-lg font-semibold sm:flex">
                  <svg
                    className="hidden w-5 h-5 mr-2 lg:block"
                    viewBox="0 0 187 244"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0)">
                      <path
                        d="M131.64 51.91C114.491 34.769 98.13 18.428 93.26 0c-4.87 18.429-21.234 34.769-38.38 51.91C29.16 77.612 0 106.743 0 150.434a93.258 93.258 0 0057.566 86.191A93.258 93.258 0 00159.22 216.4a93.248 93.248 0 0027.305-65.966c0-43.688-29.158-72.821-54.885-98.524zm-92 120.256c-5.719-.194-26.824-36.571 12.329-75.303l25.909 28.301a2.212 2.212 0 01.413 2.586 2.226 2.226 0 01-.586.719c-6.183 6.34-32.534 32.765-35.81 41.902-.675 1.886-1.663 1.815-2.256 1.795zm53.623 47.943a32.074 32.074 0 01-32.076-32.075 33.423 33.423 0 017.995-21.187c5.784-7.072 24.076-26.963 24.076-26.963s18.013 20.183 24.034 26.896a31.366 31.366 0 018.046 21.254 32.078 32.078 0 01-9.394 22.681 32.078 32.078 0 01-22.681 9.394zm61.392-52.015c-.691 1.512-2.259 4.036-4.376 4.113-3.773.138-4.176-1.796-6.965-5.923-6.122-9.06-59.551-64.9-69.545-75.699-8.79-9.498-1.238-16.195 2.266-19.704C80.43 66.478 93.26 53.656 93.26 53.656s38.254 36.296 54.19 61.096c15.935 24.8 10.443 46.26 7.205 53.342"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <path fill="#fff" d="M0 0h186.525v243.713H0z" />
                      </clipPath>
                    </defs>
                  </svg>
                  {site.name}
                </a>
              </Link>
              <div className="hidden grid-flow-col gap-6 ml-6 lg:grid lg:ml-10 lg:gap-8 auto-cols-max">
                {site.links.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    link.activePathNames?.includes(pathname)
                  return (
                    <Link key={link.href} href={link.href} passHref>
                      <a
                        className={classNames(
                          "text-black text-sm font-medium hover:underline",
                          isActive ? "text-blue-600" : "text-gray-700"
                        )}
                        target={link.external ? "_blank" : "_self"}
                        rel={link.external ? "noreferrer" : ""}
                      >
                        {link.title}
                      </a>
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center flex-1 sm:ml-4 md:flex-initial">
              <DocSearch />
              <a
                href={`https://github.com/${site.social.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex ml-4"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer>
          <div className="container flex items-center justify-between px-6 py-10 mx-auto text-sm border-t xl:px-4">
            {site.copyright && (
              <p
                dangerouslySetInnerHTML={{ __html: site.copyright }}
                className="w-full text-center text-gray-600 sm:w-auto sm:text-left"
              />
            )}
            {site.links?.length && (
              <div className="hidden grid-flow-col gap-6 sm:grid auto-cols-max">
                {site.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target={link.external ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="text-gray-600"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </footer>
      </div>
    </>
  )
}
