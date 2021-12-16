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
        <Link href="/" passHref>
          <a className="block mb-6 sm:hidden">
            <Logo classes={"h-11"} />
          </a>
        </Link>
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
                <a className="items-center hidden text-lg font-semibold sm:block flex-shrink">
                  <Logo classes={"hidden mr-2 sm:block h-12"} />
                </a>
              </Link>
              <div className="hidden flex-grow grid-flow-col gap-6 ml-4 lg:grid lg:ml-8 lg:gap-8 auto-cols-max">
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
      className={classes}
      viewBox="0 0 1052 252"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="-299" y="-250" width="3" height="3" />
      <g transform="translate(305 63)" fill="currentColor">
        <path d="M-22,107.1V15.9h7.3L47,96.5V15.9h7v91.2h-7.3L-15,26.3v80.8H-22z" />
        <path d="M83.3,107.1V15.9h52.8v6.5H90.7v34.6h40.6v6.4H90.7v37.3h47.2v6.5L83.3,107.1z" />
        <path d="m151 107.1 35.2-47.8-31.8-43.4h8.9l27.3 38.1 27.6-38.2h8.3l-31.8 43.4 34.9 47.8h-9l-30.5-42.5-30.7 42.5h-8.4z" />
        <path d="M270,107.1V22.4h-31.2v-6.5h69.8v6.5h-31.2v84.7H270z" />
        <path d="m325 107.1v-91.2h34.9c10.6 0 19.6 1.8 27.1 5.4s13.2 8.8 17.1 15.5 5.9 14.9 5.9 24.5-2 17.8-6.1 24.7-9.9 12.1-17.5 15.7-16.9 5.4-27.8 5.4h-33.6zm33.2-76.5h-15.1v61.7h15.1c21.8 0 32.8-10.3 32.8-30.8s-11-30.9-32.8-30.9z" />
        <path d="m424.7 107.1v-61.1h16l0.1 12.1c1.4-4.2 3.6-7.5 6.5-9.8s6.3-3.4 10.3-3.4c1.3 0 2.6 0.1 3.9 0.4s2.4 0.6 3.2 1l-1.5 15.7c-1-0.4-2.3-0.8-3.7-1.1s-2.8-0.5-4-0.5c-4.6 0-8.1 1.6-10.6 4.9-2.5 3.2-3.7 7.9-3.7 14v27.8h-16.5z" />
        <path d="m504.4 109c-9 0-16-2.4-20.8-7.1s-7.3-11.4-7.3-20.2v-35.7h16.7v35.4c0 8.6 3.8 12.8 11.5 12.8 7.6 0 11.4-4.3 11.4-12.8v-35.4h16.7v35.8c0 8.7-2.4 15.4-7.3 20.2s-11.9 7-20.9 7z" />
        <path d="m549.7 136.5v-90.5h15.6l0.2 9.6c2.2-3.7 5-6.5 8.6-8.5s7.7-3 12.3-3c5.4 0 10.3 1.4 14.5 4.1s7.6 6.6 10 11.4 3.6 10.4 3.6 16.7c0 6.2-1.3 11.7-3.8 16.6s-6 8.8-10.4 11.7-9.3 4.3-14.7 4.3c-8.5 0-14.9-3.4-19.3-10.2v37.7h-16.6zm31.9-42.4c4.7 0 8.6-1.6 11.6-4.9s4.6-7.5 4.6-12.6c0-5.2-1.5-9.4-4.6-12.7-3-3.3-6.9-4.9-11.6-4.9-4.8 0-8.7 1.6-11.8 4.9s-4.6 7.5-4.6 12.7c0 5.1 1.5 9.3 4.6 12.6s7 4.9 11.8 4.9z" />
        <path d="m653.3 109c-5.4 0-10.3-1.4-14.5-4.1s-7.5-6.6-9.9-11.5-3.6-10.4-3.6-16.7c0-6.2 1.3-11.7 3.8-16.6s6-8.8 10.4-11.7 9.3-4.3 14.7-4.3c4.2 0 8.1 1 11.6 2.9s6.2 4.7 8.2 8.3l0.2-9.4h15.8v61.1h-15.8l-0.2-9.4c-4.2 7.6-11.1 11.4-20.7 11.4zm4.9-14.9c4.7 0 8.6-1.6 11.6-4.9s4.6-7.5 4.6-12.6c0-5.2-1.5-9.4-4.6-12.7-3-3.3-6.9-4.9-11.6-4.9s-8.6 1.6-11.6 4.9-4.6 7.5-4.6 12.7c0 5.1 1.5 9.3 4.6 12.6s6.9 4.9 11.6 4.9z" />
        <path d="M707.9,107.1V9.9h16.6v97.2H707.9z" />
      </g>

      <circle cx="126.2" cy="124.5" r="103" fill="#6D28D9" />
      <g transform="translate(42 71)">
        <path
          d="m83.7 101.7v-93.2h34.9c10.4 0 19.4 1.9 26.9 5.6s13.2 9 17.2 15.9 6 15.2 6 24.9c0 9.9-2 18.3-6.1 25.2s-10 12.3-17.7 15.9c-7.7 3.7-17.1 5.5-28.1 5.5h-33.1zm33.1-80.5h-17.9v67.9h17.8c24 0 36-11.3 36-33.9s-12-34-35.9-34z"
          fill="#FFFFFF"
        />
        <path
          d="M15.5,101.7V8.5h14l53.7,71v-71h14v93.1h-14L29.6,30.8v70.8H15.5z"
          fill="#FFFFFF"
        />
        <path d="M80.3,75.3l9.9,13.7h9.9V71.8L80.3,49.1V75.3z" fill="#6D28D9" />
      </g>
    </svg>
  )
}
