import Link from "next/link"
import { DrupalMenuLinkContent } from "next-drupal"

import { Logo } from "components/logo"
import { FooterNewsletter } from "components/footer-newsletter"
import { useTranslation } from "next-i18next"

export interface FooterProps {
  menu: DrupalMenuLinkContent[]
}

export function Footer({ menu }: FooterProps) {
  const { t } = useTranslation("common")

  return (
    <footer className="pt-16">
      <div className="container px-4 mx-auto lg:px-8">
        <FooterNewsletter
          heading={t("deliciousness-inbox")}
          text=" Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqut enim
                ad minim"
        />
      </div>
      <div className="container flex flex-col items-center px-8 py-16 mx-auto space-y-6 lg:flex-row lg:justify-between">
        <div className="flex flex-col items-center space-y-2 text-center lg:items-start">
          <Link href="/" passHref>
            <a className="flex justify-start w-32">
              <Logo />
            </a>
          </Link>
          <p className="font-light text-gray-500">
            Lorem ipsum dolor sit amet, consectetuipisicing elit
          </p>
        </div>
        <ul className="flex flex-col space-y-4 text-center lg:space-y-0 lg:space-x-12 lg:flex-row">
          {menu.map((item) => (
            <li key={item.id}>
              <Link href={item.url} passHref>
                <a className="text-base font-medium transition-colors hover:text-primary">
                  {item.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 py-10 text-center text-gray-600 border-t border-t-gray-200">
        &copy; {new Date().getFullYear()} Chapter Three. {t("powered-by")}{" "}
        <a
          href="https://next-drupal.org?utm_source=example-kitchen-sink"
          target="_blank"
          rel="nofollow noreferrer"
          className="text-primary"
        >
          Next.js for Drupal
        </a>
      </div>
    </footer>
  )
}
