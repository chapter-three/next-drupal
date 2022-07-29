import Image from "next/image"
import Link from "next/link"

export interface CardProps {
  heading: string
  url?: string
  imageUrl: string
  date: string
}

export function Card({ heading, url, imageUrl, date }: CardProps) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-md group">
      {imageUrl && (
        <Image
          src={imageUrl}
          width={350}
          height={250}
          layout="responsive"
          alt={heading}
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
