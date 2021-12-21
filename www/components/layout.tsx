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
  mode?: "light" | "dark"
}

export function Layout({
  title = "",
  description = "",
  children,
  mode = "light",
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
                  pathname === "/" ? "text-purple-700" : "text-gray-700"
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
                      isActive ? "text-purple-700" : "text-gray-700"
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
            "bg-black text-white": mode === "dark",
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
                <a className="items-center flex-shrink hidden text-lg font-semibold sm:flex">
                  <Logo classes="hidden mr-2 sm:block w-10 h-10" />
                  {site.name}
                </a>
              </Link>
              <div className="flex-grow hidden grid-flow-col gap-6 ml-4 lg:grid lg:ml-8 lg:gap-8 auto-cols-max">
                {site.links.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    link.activePathNames?.includes(pathname)
                  return (
                    <Link key={link.href} href={link.href} passHref>
                      <a
                        className={classNames(
                          "text-sm font-medium hover:underline",
                          mode === "dark" ? "text-white" : "text-black",
                          {
                            underline: isActive,
                          }
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
                <span className="sr-only">GitHub</span>
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
                dangerouslySetInnerHTML={{
                  __html: site.copyright.text.replace(
                    "%link",
                    `<a class="underline hover:no-underline" target="_blank" href="${site.copyright.link.href}">${site.copyright.link.title}</a>`
                  ),
                }}
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

function Logo({ classes }) {
  return (
    <svg
      className={classNames("text-purple-700", classes)}
      viewBox="0 0 252 252"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="126.2" cy="124.5" r="103" fill="currentColor" />
      <g transform="translate(42 71)">
        <path
          d="m83.7 101.7v-93.2h34.9c10.4 0 19.4 1.9 26.9 5.6s13.2 9 17.2 15.9 6 15.2 6 24.9c0 9.9-2 18.3-6.1 25.2s-10 12.3-17.7 15.9c-7.7 3.7-17.1 5.5-28.1 5.5h-33.1zm33.1-80.5h-17.9v67.9h17.8c24 0 36-11.3 36-33.9s-12-34-35.9-34z"
          fill="#FFFFFF"
        />
        <path
          d="M15.5,101.7V8.5h14l53.7,71v-71h14v93.1h-14L29.6,30.8v70.8H15.5z"
          fill="#FFFFFF"
        />
        <path
          d="M80.3,75.3l9.9,13.7h9.9V71.8L80.3,49.1V75.3z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}
