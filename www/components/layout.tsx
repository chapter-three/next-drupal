import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import classNames from "classnames"
import { NextSeo } from "next-seo"
import { DocSearch } from "@docsearch/react"
import "@docsearch/css"

import { site } from "config/site"
import { docsConfig } from "config/docs"
import { SidebarNav } from "components/sidebar-nav"
import { Menu } from "@headlessui/react"

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
      <div className="bg-black">
        <div className="container flex flex-col items-center justify-between px-6 py-2 mx-auto sm:py-2 sm:flex-row xl:px-8">
          <a
            href={`${site.social.contact}?utm_source=next-drupal&utm_medium=banner`}
            rel="noopener noreferrer"
            target="_blank"
            className="mt-2 text-sm font-semibold text-white sm:text-base sm:mt-0 hover:underline"
          >
            <span className="sr-only">Chapter Three</span>
            <svg
              width="120"
              height="15"
              viewBox="4985.5 484.6 300 29"
              xmlSpace="preserve"
            >
              <path
                fill="currentColor"
                d="M4997.9 513.5c4 0 6.9-1.4 9.4-3.7l-1.9-2.1c-2.1 1.9-4.3 3.2-7.3 3.2-5.4 0-9.6-4.7-9.6-11.7v-.2c0-6.8 4.2-11.6 9.6-11.6 3 0 5.2 1.3 7.1 3l1.9-2.3c-2.3-2-4.9-3.3-9-3.3-7.4 0-12.6 5.7-12.6 14.3v.2c0 8.6 5.1 14.2 12.4 14.2zM5012.1 513.4h2.9v-13.7h14.2v13.7h2.9v-28.6h-2.9V497H5015v-12.2h-2.9v28.6zM5038.6 513.4h3.1l2.8-7.6h12.8l2.8 7.6h3.3l-10.9-28.6h-3l-10.9 28.6zm6.9-10.4 5.4-14.3 5.4 14.3h-10.8zM5068.2 513.4h2.9v-10.6h5.9c6.7 0 11.3-3.3 11.3-9.2v-.1c0-5.5-3.9-8.9-10.8-8.9h-9.3v28.8zm3-13.4v-12.5h6.1c4.9 0 8.1 2.1 8.1 6.2 0 3.8-3.2 6.3-8.2 6.3h-6zM5097.9 513.4h2.9v-26h8.3v-2.7h-19.5v2.7h8.3v26zM5115.1 513.6h18v-2.8h-15v-11h13.3V497H5118v-9.5h14.8v-2.8H5115v28.9h.1zM5138.5 513.4h2.9v-10.6h6.9l7.6 10.6h3.6l-7.8-11.2c4.2-1 6.9-3.8 6.9-8.6v-.1c0-2.5-.8-4.7-2.1-6.2-1.6-1.7-4.4-2.7-7.9-2.7h-10v28.8h-.1zm2.9-13.4v-12.5h6.9c4.6 0 7.3 2.2 7.3 6.2v.1c0 3.8-2.7 6.3-7.7 6.3h-6.5v-.1zM5169.7 513.4h6v-23.2h7.4v-5.6h-20.8v5.6h7.4v23.2zM5188.4 513.4h6v-12.3h9.6v12.3h6v-28.6h-6v10.7h-9.6v-10.7h-6v28.6zM5216.5 513.4h6v-9.2h4l5.6 9.2h6.8l-6.1-10.5c3.2-1.5 5.3-4.4 5.3-8.6v-.2c0-2.7-.9-5-2.4-6.6-1.8-1.9-4.5-2.9-8.1-2.9h-11.1v28.8zm6-14.8v-8.4h4.5c3.2 0 5.1 1.4 5.1 4.2 0 2.5-1.7 4.2-5 4.2h-4.6zM5243.1 513.6h19.1V508h-13.1v-6.9h11.4v-5.6h-11.4v-5.4h12.9v-5.6h-18.9v29.1zM5266.5 513.6h19.1V508h-13.1v-6.9h11.4v-5.6h-11.4v-5.4h12.9v-5.6h-18.9v29.1z"
              />
            </svg>
          </a>
          <a
            href={`${site.social.contact}?utm_source=next-drupal&utm_medium=banner`}
            rel="noopener noreferrer"
            target="_blank"
            className="inline mt-2 text-sm text-right text-white sm:mt-0 hover:underline"
          >
            Contact Chapter Three for your next project
          </a>
        </div>
      </div>
      <div
        className={classNames(
          "fixed z-50 block p-6 overflow-auto bg-white bottom-0 transition-transform top-[123px] border-r border-t lg:hidden",
          showMenu ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ul className="grid grid-flow-row gap-2 mb-8 auto-rows-max">
          <li>
            <Link href="/" passHref>
              <a
                className={classNames(
                  "text-sm font-medium hover:underline",
                  pathname === "/" ? "text-blue-700" : "text-gray-700"
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
                      isActive ? "text-blue-700" : "text-gray-900"
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
        <SidebarNav items={docsConfig.links} />
      </div>
      <div className="flex flex-col min-h-screen">
        <header
          className={classNames("sticky lg:static top-0 bg-white z-10", {
            "border-b": pathname !== "/",
            "bg-black text-white": mode === "dark",
          })}
        >
          <div className="container flex items-center justify-between px-6 mx-auto h-14 xl:h-16 xl:px-8">
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
              <div className="flex items-center space-x-8">
                <Link href="/" passHref>
                  <a className="items-center flex-shrink hidden font-semibold sm:flex sm:text-lg">
                    {site.name}
                  </a>
                </Link>
                <div className="flex-grow hidden grid-flow-col gap-6 mr-4 lg:grid lg:mr-4 lg:gap-6 auto-cols-max">
                  {site.links.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      link.activePathNames?.includes(pathname)
                    return (
                      <Link key={link.href} href={link.href} passHref>
                        <a
                          className={classNames(
                            "hover:underline",
                            mode === "dark" ? "text-white" : "hover:text-black",
                            isActive ? "text-black" : "text-gray-600"
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
            </div>
            <div className="flex items-center flex-1 sm:ml-4 md:flex-initial">
              <div className="flex items-center ml-auto space-x-4">
                <DocSearch
                  appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}
                  indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
                  apiKey={process.env.NEXT_PUBLIC_ALGOLIA_API_KEY}
                />
                <a
                  href={`https://drupal.slack.com/archives/C01E36BMU72`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex transition-colors hover:text-primary"
                >
                  <span className="sr-only">Slack</span>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                  </svg>
                </a>
                <a
                  href={`https://drupal.org/project/next`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex transition-colors hover:text-primary"
                >
                  <span className="sr-only">Drupal</span>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M15.78 5.113C14.09 3.425 12.48 1.815 11.998 0c-.48 1.815-2.09 3.425-3.778 5.113-2.534 2.53-5.405 5.4-5.405 9.702a9.184 9.185 0 1 0 18.368 0c0-4.303-2.871-7.171-5.405-9.702M6.72 16.954c-.563-.019-2.64-3.6 1.215-7.416l2.55 2.788a.218.218 0 0 1-.016.325c-.61.625-3.204 3.227-3.527 4.126-.066.186-.164.18-.222.177M12 21.677a3.158 3.158 0 0 1-3.158-3.159 3.291 3.291 0 0 1 .787-2.087c.57-.696 2.37-2.655 2.37-2.655s1.774 1.988 2.367 2.649a3.09 3.09 0 0 1 .792 2.093A3.158 3.158 0 0 1 12 21.677m6.046-5.123c-.068.15-.223.398-.431.405-.371.014-.411-.177-.686-.583-.604-.892-5.864-6.39-6.848-7.455-.866-.935-.122-1.595.223-1.94C10.736 6.547 12 5.285 12 5.285s3.766 3.574 5.336 6.016c1.57 2.443 1.029 4.556.71 5.253" />
                  </svg>
                </a>
                <a
                  href={`https://github.com/${site.social.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex transition-colors hover:text-primary"
                >
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-50 rounded-2xl">
                    {site.versions.find((version) => version.active)?.version}
                    <svg
                      className="w-2 h-[3px] opacity-70 ml-2 overflow-visible"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 0L3 3L6 0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                  </Menu.Button>
                  <Menu.Items
                    as="div"
                    className="absolute right-0 flex flex-col w-32 py-1 mt-1 bg-white border rounded-md shadow-md"
                  >
                    {site.versions.map((version) => (
                      <Menu.Item key={version.version}>
                        {({ active }) =>
                          version.url ? (
                            <Link href={version.url} passHref>
                              <a
                                className={classNames(
                                  "text-sm px-3 py-1 hover:bg-blue-50",
                                  {
                                    "bg-blue-50": active,
                                  }
                                )}
                              >
                                {version.version}
                              </a>
                            </Link>
                          ) : (
                            <span
                              className={classNames(
                                "text-sm px-3 py-1 hover:bg-blue-50",
                                {
                                  "bg-blue-50": active,
                                }
                              )}
                            >
                              {version.version}
                            </span>
                          )
                        }
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer>
          <div className="container flex items-center justify-center px-6 py-8 mx-auto text-sm border-t md:justify-between xl:px-8">
            <div className="flex flex-col items-center md:items-start">
              <a
                href={`${site.social.contact}?utm_source=next-drupal&utm_medium=footer`}
                rel="noopener noreferrer"
              >
                <span className="sr-only">Chapter Three</span>
                <svg
                  width="120"
                  height="20"
                  viewBox="4985.5 484.6 300 29"
                  xmlSpace="preserve"
                  className="text-black"
                >
                  <path
                    fill="currentColor"
                    d="M4997.9 513.5c4 0 6.9-1.4 9.4-3.7l-1.9-2.1c-2.1 1.9-4.3 3.2-7.3 3.2-5.4 0-9.6-4.7-9.6-11.7v-.2c0-6.8 4.2-11.6 9.6-11.6 3 0 5.2 1.3 7.1 3l1.9-2.3c-2.3-2-4.9-3.3-9-3.3-7.4 0-12.6 5.7-12.6 14.3v.2c0 8.6 5.1 14.2 12.4 14.2zM5012.1 513.4h2.9v-13.7h14.2v13.7h2.9v-28.6h-2.9V497H5015v-12.2h-2.9v28.6zM5038.6 513.4h3.1l2.8-7.6h12.8l2.8 7.6h3.3l-10.9-28.6h-3l-10.9 28.6zm6.9-10.4 5.4-14.3 5.4 14.3h-10.8zM5068.2 513.4h2.9v-10.6h5.9c6.7 0 11.3-3.3 11.3-9.2v-.1c0-5.5-3.9-8.9-10.8-8.9h-9.3v28.8zm3-13.4v-12.5h6.1c4.9 0 8.1 2.1 8.1 6.2 0 3.8-3.2 6.3-8.2 6.3h-6zM5097.9 513.4h2.9v-26h8.3v-2.7h-19.5v2.7h8.3v26zM5115.1 513.6h18v-2.8h-15v-11h13.3V497H5118v-9.5h14.8v-2.8H5115v28.9h.1zM5138.5 513.4h2.9v-10.6h6.9l7.6 10.6h3.6l-7.8-11.2c4.2-1 6.9-3.8 6.9-8.6v-.1c0-2.5-.8-4.7-2.1-6.2-1.6-1.7-4.4-2.7-7.9-2.7h-10v28.8h-.1zm2.9-13.4v-12.5h6.9c4.6 0 7.3 2.2 7.3 6.2v.1c0 3.8-2.7 6.3-7.7 6.3h-6.5v-.1zM5169.7 513.4h6v-23.2h7.4v-5.6h-20.8v5.6h7.4v23.2zM5188.4 513.4h6v-12.3h9.6v12.3h6v-28.6h-6v10.7h-9.6v-10.7h-6v28.6zM5216.5 513.4h6v-9.2h4l5.6 9.2h6.8l-6.1-10.5c3.2-1.5 5.3-4.4 5.3-8.6v-.2c0-2.7-.9-5-2.4-6.6-1.8-1.9-4.5-2.9-8.1-2.9h-11.1v28.8zm6-14.8v-8.4h4.5c3.2 0 5.1 1.4 5.1 4.2 0 2.5-1.7 4.2-5 4.2h-4.6zM5243.1 513.6h19.1V508h-13.1v-6.9h11.4v-5.6h-11.4v-5.4h12.9v-5.6h-18.9v29.1zM5266.5 513.6h19.1V508h-13.1v-6.9h11.4v-5.6h-11.4v-5.4h12.9v-5.6h-18.9v29.1z"
                  />
                </svg>
              </a>
              {site.copyright && (
                <p
                  dangerouslySetInnerHTML={{ __html: site.copyright }}
                  className="w-full mt-2 text-center text-gray-600 sm:w-auto md:text-left"
                />
              )}
            </div>
            {site.links?.length && (
              <div className="hidden grid-flow-col gap-6 md:grid auto-cols-max">
                {site.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target={link.external ? "_blank" : "_self"}
                    className="text-gray-600"
                    rel="noreferrer"
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
