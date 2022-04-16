import Link from "next/link"
import { useRouter } from "next/router"
import classNames from "classnames"
import { Menu, Transition } from "@headlessui/react"

import config from "config"

export function LocaleSwitcher() {
  const { locales, asPath, locale: currentLocale } = useRouter()

  if (!locales || locales.length < 2) {
    return null
  }

  return (
    <div className="flex">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button>
          <span className="sr-only">Select language</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className=""
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </Menu.Button>
        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-32 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {locales.map((locale) => (
              <Menu.Item key={locale}>
                <Link href={asPath} locale={locale} passHref>
                  <a
                    data-cy={`local-switcher-${locale}`}
                    className={classNames(
                      "flex items-center px-3 py-2 text-sm",
                      locale === currentLocale ? "text-gray-500" : "text-black"
                    )}
                  >
                    {config.locales[locale]}
                  </a>
                </Link>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
