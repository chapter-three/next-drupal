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
            href={`${site.social.contact}`}
            rel="noopener noreferrer"
            target="_blank"
            className="mt-2 text-sm font-semibold text-white sm:text-base sm:mt-0 hover:underline"
          >
            <span className="sr-only">Kanopi Studios</span>
            <svg
              width="120.011"
              height="55.378"
              viewBox="0 0 120.011 55.378"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#a)" fill="#fff">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M33 19.362c-1.633-1.494-3.776-2.316-6.175-2.316-5.364 0-9.566 4.231-9.566 9.632s4.202 9.632 9.566 9.632c2.398 0 4.541-.821 6.175-2.316v1.95h3.624V17.41H33zm0 7.317c0 3.425-2.654 6.108-6.042 6.108-3.406 0-6.075-2.683-6.075-6.108s2.668-6.108 6.075-6.108c3.388 0 6.042 2.683 6.042 6.108m16.376-9.632c-1.988 0-3.67.578-4.979 1.694v-1.329h-3.591v18.534h3.591v-9.732c0-3.586 1.766-5.643 4.846-5.643 2.489 0 3.916 1.488 3.916 4.083v11.292h3.624V24.654c0-4.55-2.977-7.607-7.407-7.607m20.056 0c-5.438 0-9.699 4.231-9.699 9.632s4.26 9.632 9.699 9.632 9.665-4.231 9.665-9.632-4.246-9.632-9.665-9.632m0 3.524c3.388 0 6.041 2.683 6.041 6.108s-2.654 6.108-6.041 6.108c-3.406 0-6.075-2.683-6.075-6.108s2.668-6.108 6.075-6.108m22.17-3.524c-2.378 0-4.544.851-6.174 2.361v-1.996h-3.591v27.191l3.591-2.269v-8.385c1.63 1.51 3.796 2.361 6.174 2.361 5.364 0 9.566-4.231 9.566-9.632s-4.202-9.632-9.566-9.632m5.975 9.632c0 3.425-2.668 6.108-6.075 6.108s-6.075-2.683-6.075-6.108 2.668-6.108 6.075-6.108 6.075 2.683 6.075 6.108m6.45 9.267h3.59V18.241l-3.59 2.27zm6.035-27.203-4.446 2.794s-1.448.753-1.656 2.212l-.004-.003a2.5 2.5 0 0 0-.026.347v4.61q.001.18.026.347l3.448-2.208-.001-.001 3.752-2.413s.975-.614.975-2.018v-5.5s-.703.858-2.068 1.833"
                />
                <path d="m8.049 26.363 9.675-8.993H12.67l-8.879 8.11V13.307A3.61 3.61 0 0 0 .183 9.699V36h3.608l-.144-8.92L12.88 36h5.087zM-.002 50.926l.657-1.386c.924.835 2.506 1.439 4.105 1.439 2.15 0 3.074-.835 3.074-1.919C7.834 46.021.3 47.94.3 43.321c0-1.919 1.492-3.554 4.762-3.554 1.457 0 2.968.391 3.998 1.102l-.586 1.422a6.4 6.4 0 0 0-3.412-1.013c-2.114 0-3.021.889-3.021 1.972 0 3.039 7.534 1.137 7.534 5.704 0 1.902-1.528 3.536-4.816 3.536-1.901 0-3.767-.64-4.762-1.564zm19.41.871c-.515.444-1.297.657-2.061.657-1.901 0-2.985-1.048-2.985-2.95v-5.171h-1.6v-1.404h1.599v-2.061h1.706v2.061h2.701v1.404h-2.701v5.1c0 1.013.533 1.581 1.475 1.581.498 0 .977-.16 1.333-.444zm12.858-8.867v9.418h-1.617v-1.422c-.693.978-1.866 1.528-3.199 1.528-2.435 0-4.051-1.333-4.051-4.105v-5.42h1.706v5.224c0 1.848.924 2.772 2.541 2.772 1.777 0 2.914-1.102 2.914-3.127v-4.869zm13.562-3.928v13.346h-1.635v-1.492c-.764 1.066-1.972 1.599-3.359 1.599-2.754 0-4.762-1.937-4.762-4.816s2.008-4.798 4.762-4.798c1.333 0 2.506.498 3.287 1.511v-4.279l1.706-1.07zm-1.688 8.637c0-2.008-1.368-3.305-3.163-3.305-1.813 0-3.181 1.297-3.181 3.305s1.368 3.323 3.181 3.323c1.795 0 3.163-1.315 3.163-3.323m6.755-7.623c0-.622.498-1.12 1.155-1.12s1.155.48 1.155 1.084c0 .64-.48 1.137-1.155 1.137-.657 0-1.155-.48-1.155-1.102m.302 2.914h1.706v9.418h-1.706zm5.851 4.709c0-2.808 2.079-4.798 4.905-4.798s4.887 1.99 4.887 4.798-2.061 4.816-4.887 4.816-4.905-2.008-4.905-4.816m8.067 0c0-2.008-1.351-3.305-3.163-3.305s-3.181 1.297-3.181 3.305 1.368 3.323 3.181 3.323 3.163-1.315 3.163-3.323m5.031 3.714.711-1.351c.8.569 2.079.978 3.305.978 1.581 0 2.239-.48 2.239-1.28 0-2.114-5.953-.284-5.953-4.034 0-1.688 1.511-2.825 3.927-2.825 1.226 0 2.612.32 3.43.853l-.729 1.351c-.853-.551-1.795-.746-2.719-.746-1.493 0-2.221.551-2.221 1.297 0 2.221 5.971.409 5.971 4.069 0 1.706-1.564 2.79-4.069 2.79-1.564 0-3.11-.48-3.892-1.102m45.341-41.405h-.502V7.308h-.903v-.43h2.307v.43h-.903zm2.699 0-.89-2.563h-.017q.036.571.036 1.071v1.493h-.456V6.877h.708l.852 2.441h.013l.877-2.441h.71v3.069h-.483V8.428q0-.229.011-.596.012-.367.02-.445h-.017l-.922 2.559z" />
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="#fff" d="M0 0h120.011v55.378H0z" />
                </clipPath>
              </defs>
            </svg>
          </a>
          <a
            href={`${site.social.contact}`}
            rel="noopener noreferrer"
            target="_blank"
            className="inline mt-2 text-sm text-right text-white sm:mt-0 hover:underline"
          >
            Contact Kanopi Studios for your next project
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
            <Link
              href="/"
              passHref
              className={classNames(
                "text-sm font-medium hover:underline",
                pathname === "/" ? "text-blue-700" : "text-gray-700"
              )}
            >
              Home
            </Link>
          </li>
          {site.links.map((link, index) => {
            const isActive =
              pathname === link.href || link.activePathNames?.includes(pathname)
            return (
              <li key={index}>
                <Link
                  href={link.href}
                  passHref
                  className={classNames(
                    "text-sm font-medium hover:underline",
                    isActive ? "text-blue-700" : "text-gray-900"
                  )}
                  target={link.external ? "_blank" : "_self"}
                  rel={link.external ? "noreferrer" : ""}
                >
                  {link.title}
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
                <Link
                  href="/"
                  passHref
                  className="items-center flex-shrink hidden font-semibold sm:flex sm:text-lg lg:text-base xl:text-lg"
                >
                  {site.name}
                </Link>
                <div className="flex-grow hidden grid-flow-col gap-6 mr-4 lg:grid lg:mr-4 lg:gap-4 xl:gap-6 auto-cols-max">
                  {site.links.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      link.activePathNames?.includes(pathname)
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        passHref
                        className={classNames(
                          "hover:underline",
                          mode === "dark" ? "text-white" : "hover:text-black",
                          isActive ? "text-black" : "text-gray-600"
                        )}
                        target={link.external ? "_blank" : "_self"}
                        rel={link.external ? "noreferrer" : ""}
                      >
                        {link.title}
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
                            <Link
                              href={version.url}
                              passHref
                              className={classNames(
                                "text-sm px-3 py-1 hover:bg-blue-50",
                                {
                                  "bg-blue-50": active,
                                }
                              )}
                            >
                              {version.version}
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
              <a href={`${site.social.contact}`} rel="noopener noreferrer">
                <span className="sr-only">Kanopi Studios</span>
                <svg
                  width="120"
                  height="55.219"
                  viewBox="0 0 120 55.219"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#a)" fill="#000">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M32.997 19.301c-1.633-1.494-3.776-2.315-6.174-2.315-5.363 0-9.565 4.23-9.565 9.631s4.201 9.631 9.565 9.631c2.398 0 4.541-.821 6.174-2.315v1.95h3.623V17.351h-3.623zm0 7.316c0 3.425-2.653 6.108-6.041 6.108-3.406 0-6.074-2.683-6.074-6.108s2.668-6.107 6.074-6.107c3.388 0 6.041 2.683 6.041 6.107m16.374-9.631c-1.988 0-3.67.578-4.978 1.694v-1.329h-3.59v18.532h3.59v-9.731c0-3.586 1.766-5.642 4.846-5.642 2.489 0 3.916 1.488 3.916 4.082v11.291h3.623V24.592c0-4.549-2.976-7.606-7.407-7.606m20.054 0c-5.438 0-9.698 4.23-9.698 9.631s4.26 9.631 9.698 9.631 9.664-4.231 9.664-9.631-4.245-9.631-9.664-9.631m0 3.524c3.387 0 6.041 2.683 6.041 6.107s-2.653 6.108-6.041 6.108c-3.406 0-6.074-2.683-6.074-6.108s2.668-6.107 6.074-6.107m22.168-3.524c-2.378 0-4.544.851-6.174 2.361v-1.996h-3.59V44.54l3.59-2.269v-8.384c1.63 1.51 3.796 2.361 6.174 2.361 5.363 0 9.565-4.231 9.565-9.631s-4.201-9.631-9.565-9.631m5.975 9.631c0 3.425-2.668 6.108-6.074 6.108s-6.074-2.683-6.074-6.108 2.668-6.107 6.074-6.107 6.074 2.683 6.074 6.107m6.449 9.266h3.59V18.18l-3.59 2.27zm6.034-27.202-4.446 2.794s-1.448.753-1.656 2.212l-.004-.003a2.5 2.5 0 0 0-.026.347v4.609q.001.18.026.347l3.448-2.208-.001-.001 3.752-2.413s.975-.614.975-2.018V6.849s-.702.858-2.067 1.833"
                    />
                    <path d="m8.048 26.302 9.674-8.993h-5.053l-8.879 8.11V13.246A3.607 3.607 0 0 0 .183 9.639v26.298H3.79l-.144-8.919 9.232 8.919h5.086zm-8.05 24.559.657-1.386c.924.835 2.506 1.439 4.105 1.439 2.15 0 3.074-.835 3.074-1.919C7.834 45.957.3 47.876.3 43.256c0-1.919 1.492-3.554 4.762-3.554 1.457 0 2.967.391 3.998 1.102l-.586 1.421a6.4 6.4 0 0 0-3.412-1.013c-2.114 0-3.021.889-3.021 1.972 0 3.038 7.534 1.137 7.534 5.704 0 1.901-1.528 3.536-4.815 3.536-1.901 0-3.767-.64-4.762-1.564zm19.409.871c-.515.444-1.297.657-2.061.657-1.901 0-2.985-1.048-2.985-2.949v-5.171h-1.6v-1.403h1.599v-2.061h1.706v2.061h2.701v1.403h-2.701v5.1c0 1.013.533 1.581 1.475 1.581.498 0 .977-.16 1.333-.444zm12.857-8.866v9.417h-1.617v-1.421c-.693.977-1.866 1.528-3.198 1.528-2.434 0-4.051-1.333-4.051-4.105v-5.419h1.706v5.224c0 1.848.924 2.772 2.541 2.772 1.777 0 2.914-1.101 2.914-3.127v-4.868zm13.561-3.928v13.345H44.19v-1.492c-.764 1.066-1.972 1.599-3.358 1.599-2.754 0-4.762-1.937-4.762-4.815s2.008-4.797 4.762-4.797c1.333 0 2.506.498 3.287 1.51v-4.279zm-1.688 8.636c0-2.008-1.368-3.305-3.163-3.305-1.812 0-3.181 1.297-3.181 3.305s1.368 3.323 3.181 3.323c1.794 0 3.163-1.315 3.163-3.323m6.755-7.622c0-.622.498-1.119 1.155-1.119s1.155.48 1.155 1.084c0 .64-.48 1.137-1.155 1.137-.657 0-1.155-.48-1.155-1.101m.302 2.914H52.9v9.417h-1.706zm5.851 4.708c0-2.807 2.079-4.797 4.904-4.797s4.886 1.99 4.886 4.797-2.061 4.815-4.886 4.815-4.904-2.008-4.904-4.815m8.067 0c0-2.008-1.35-3.305-3.163-3.305s-3.181 1.297-3.181 3.305 1.368 3.323 3.181 3.323 3.163-1.315 3.163-3.323m5.03 3.714.711-1.35c.8.569 2.079.977 3.305.977 1.581 0 2.239-.48 2.239-1.28 0-2.114-5.952-.284-5.952-4.033 0-1.688 1.51-2.825 3.927-2.825 1.226 0 2.612.32 3.429.853l-.728 1.35c-.853-.551-1.794-.746-2.718-.746-1.493 0-2.221.551-2.221 1.297 0 2.221 5.97.409 5.97 4.069 0 1.706-1.564 2.79-4.069 2.79-1.564 0-3.109-.48-3.891-1.102zm45.337-41.402h-.502V7.248h-.903v-.431h2.307v.43h-.903zm2.699 0-.89-2.563h-.017q.036.571.036 1.07v1.492h-.455V6.817h.708l.852 2.441h.013l.877-2.441h.71v3.069h-.483V8.368q0-.229.011-.596.012-.367.02-.445h-.017l-.921 2.559z" />
                  </g>
                  <defs>
                    <clipPath id="a">
                      <path fill="#fff" d="M0 0h120v55.219H0z" />
                    </clipPath>
                  </defs>
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
