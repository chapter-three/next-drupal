import NextImage from "next/image"
import Link from "next/link"
import { Image } from "types"
import { FormattedText } from "./formatted-text"

interface FeatureProps {
  id: string
  heading: string
  text?: string
  image?: Image
  link: {
    title: string
    href: string
  }
}

export function Feature({
  heading,
  text,
  image,
  link,
  ...props
}: FeatureProps) {
  console.log(text)
  return (
    <section {...props}>
      <div className="container px-6 py-10 mx-auto md:py-24 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col items-center space-y-6 text-center lg:text-left lg:items-start">
            <h2 className="text-3xl font-semibold lg:text-5xl">{heading}</h2>
            <div className="max-w-2xl text-lg text-gray-500">
              <FormattedText text={text} />
            </div>
            {link && (
              <Link href={link.href} passHref>
                <a className="rounded-full h-[60px] flex justify-center items-center hover:bg-primary px-10 text-sm text-white bg-black md:rounded-2xl">
                  {link.title}
                </a>
              </Link>
            )}
          </div>
          {image && (
            <NextImage
              src={image.url}
              layout="responsive"
              alt={image.alt}
              title={image.title}
              width={580}
              height={480}
            />
          )}
        </div>
      </div>
    </section>
  )
}
