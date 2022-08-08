import Image from "next/image"
import Link from "next/link"

import { CardProps } from "components/card"
import { MediaImage } from "./media--image"

export interface CardFeaturedProps extends CardProps {
  text?: string
}

export function CardFeatured({
  title: heading,
  url,
  media,
  date,
}: CardFeaturedProps) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-md group">
      <MediaImage media={media} />
      <div className="flex flex-col items-start p-5 space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {heading}
          </h2>
          {date && <p className="text-gray-600">{date}</p>}
        </div>
        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg group-hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
          Read more
          <svg
            aria-hidden="true"
            className="w-4 h-4 ml-2 -mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </span>
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
