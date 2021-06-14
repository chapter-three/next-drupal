import Link from "next/link"
import { useRouter } from "next/router"

export function LocaleSwitcher() {
  const { locales, asPath, locale: currentLocale } = useRouter()

  return (
    <div display="flex">
      {locales.map((locale) => (
        <Link href={asPath} key={locale} locale={locale} passHref>
          <a
            display="block"
            p="2"
            textTransform="uppercase"
            textDecoration="none"
            color={locale === currentLocale ? "text" : "gray"}
            _hover={{
              textDecoration: "underline",
            }}
          >
            {locale}
          </a>
        </Link>
      ))}
    </div>
  )
}
