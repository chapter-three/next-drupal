import Link from "next/link"
import { useRouter } from "next/router"
import classNames from "classnames"

import config from "site.config"

export function LocaleSwitcher({ ...props }) {
  const { locales, asPath, locale: currentLocale } = useRouter()

  if (!locales || locales.length < 2) {
    return null
  }

  return (
    <nav {...props}>
      <ul className="flex space-x-4">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              href={asPath}
              locale={locale}
              passHref
              data-cy={`local-switcher-${locale}`}
              className={classNames(
                locale === currentLocale ? "font-semibold" : "font-normal"
              )}
            >
              {config.locales[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
