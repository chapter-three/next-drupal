import Image from "next/image"
import Link from "next/link"

export interface CardProps {
  title: string
  url?: string
  image: {
    url: string
    alt: string
  }
  date: string
}

export function Card({ title: heading, url, image, date }: CardProps) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-md group">
      {image && (
        <Image
          src={image.url}
          width={350}
          height={250}
          layout="responsive"
          alt={image.alt}
        />
      )}
      <div className="p-5">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          {heading}
        </h2>
        {date && <span className="text-gray-600">{date}</span>}
      </div>
      {url && (
        <Link href={url} passHref>
          <a className="absolute inset-0">
            <span className="sr-only">Read more</span>
          </a>
        </Link>
      )}
    </div>
  )
}
