import Link from "next/link"
import Image from "next/image"
import { DrupalMenuLinkContent } from "next-drupal"

import { Logo } from "components/logo"
import { FormNewsletter } from "components/form-newsletter"

export interface FooterProps {
  menu: DrupalMenuLinkContent[]
}

export function Footer({ menu }: FooterProps) {
  return (
    <footer>
      <div className="container px-8 mx-auto">
        <div className="bg-secondary relative mb-12 rounded-[55px]">
          <Image
            src="/images/opt-in-block-bg.png"
            layout="responsive"
            width={1280}
            height={442}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-12">
            <div className="max-w-2xl text-center">
              <div className="flex flex-col space-y-8">
                <p className="text-5xl font-semibold tracking-tight">
                  Deliciousness to your inbox
                </p>
                <p className="text-base font-light leading-7 text-center text-black text-opacity-60">
                  Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqut
                  enim ad minim
                </p>
              </div>
            </div>
            <div className="w-full max-w-lg">
              <FormNewsletter />
            </div>
          </div>
        </div>
      </div>
      <div className="container flex items-center justify-between px-8 py-16 mx-auto">
        <div className="flex flex-col space-y-6">
          <Link href="/" passHref>
            <a className="flex justify-start w-32">
              <Logo />
            </a>
          </Link>
          <p className="font-light text-gray-500">
            Lorem ipsum dolor sit amet, consectetuipisicing elit
          </p>
        </div>
        <ul className="flex space-x-12">
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
      <div className="py-10 text-center text-gray-600 border-t border-t-gray-200">
        &copy; {new Date().getFullYear()}. Powered by{" "}
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
