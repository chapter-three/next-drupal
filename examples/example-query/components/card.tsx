import Link from "next/link"

import { MediaImage, MediaImageProps } from "./media--image"

export interface CardProps {
  title: string
  url?: string
  media: MediaImageProps["media"]
  date?: string
}

export function Card({ title: heading, url, media, date }: CardProps) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-md group">
      <MediaImage media={media} />
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
