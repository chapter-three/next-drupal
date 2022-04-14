import Link from "next/link"
import Image from "next/image"
import { formatDate } from "lib/utils"
import React from "react"
import { Recipe } from "types"

type RecipeMetaProps = Pick<
  Recipe,
  "author" | "date" | "prepTime" | "cookTime" | "categories"
>

export function RecipeMeta({
  author,
  date,
  prepTime,
  cookTime,
  categories,
}: RecipeMetaProps) {
  return (
    <div className="grid w-full max-w-5xl gap-4 divide-y md:divide-y-0 md:divide-x sm:grid-rows-2 md:grid-rows-1 md:grid-cols-2">
      <div className="grid gap-4 divide-y sm:divide-y-0 sm:divide-x sm:grid-cols-2">
        <div className="flex items-center justify-center space-x-4">
          {author.picture && (
            <figure className="w-10 overflow-hidden rounded-full">
              <Image
                src={author.picture.url}
                alt={author.picture.alt}
                width={32}
                height={32}
                layout="responsive"
                objectFit="cover"
              />
            </figure>
          )}
          <div className="flex flex-col space-y-1">
            {author.name ? (
              <p className="text-sm font-semibold">{author.name}</p>
            ) : null}
            <span className="text-sm text-gray-500">{formatDate(date)}</span>
          </div>
        </div>
        {prepTime && (
          <div className="flex items-center justify-center pt-4 space-x-4 md:pt-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9.75 1.5h4.5a.75.75 0 1 0 0-1.5h-4.5a.75.75 0 1 0 0 1.5ZM12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm4.243 5.818L12.53 12.53a.75.75 0 0 1-1.06-1.06l3.712-3.713a.75.75 0 1 1 1.06 1.061Z"
                fill="currentColor"
              />
            </svg>
            <div className="flex flex-col space-y-1">
              <p className="text-xs font-medium tracking-wider uppercase">
                Prep time
              </p>
              <span className="text-sm text-gray-500">{prepTime}</span>
            </div>
          </div>
        )}
      </div>
      <div className="grid gap-4 pt-4 divide-y md:pt-0 sm:divide-y-0 sm:divide-x sm:grid-cols-2">
        {cookTime && (
          <div className="flex items-center justify-center space-x-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9.75 1.5h4.5a.75.75 0 1 0 0-1.5h-4.5a.75.75 0 1 0 0 1.5ZM12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm4.243 5.818L12.53 12.53a.75.75 0 0 1-1.06-1.06l3.712-3.713a.75.75 0 1 1 1.06 1.061Z"
                fill="currentColor"
              />
            </svg>
            <div className="flex flex-col space-y-1">
              <p className="text-xs font-medium tracking-wider uppercase">
                Cook time
              </p>
              <span className="text-sm text-gray-500">{cookTime}</span>
            </div>
          </div>
        )}
        {categories ? (
          <div className="flex items-center justify-center pt-4 space-x-4 md:pt-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M11.999 7.479a.798.798 0 0 0-.007-.081l-.002-.021-.75-4.5a.75.75 0 1 0-1.48.246l.605 3.627h-1.74V3a.75.75 0 0 0-1.5 0v3.75h-1.74l.605-3.627a.75.75 0 1 0-1.48-.246l-.75 4.5-.002.02a.797.797 0 0 0-.007.082L3.75 7.5v.034a4.13 4.13 0 0 0 3.375 4.021V21a.75.75 0 1 0 1.5 0v-9.445a4.13 4.13 0 0 0 3.374-4.021V7.52L12 7.5l-.001-.021ZM19.874 2.987a.724.724 0 0 0-.04-.23l-.004-.013-.006-.014a.785.785 0 0 0-.113-.198l-.02-.022a.727.727 0 0 0-.028-.032l-.022-.021a.737.737 0 0 0-.118-.092l-.027-.016a.705.705 0 0 0-.038-.02l-.026-.013a.735.735 0 0 0-.04-.016l-.028-.01a.734.734 0 0 0-.224-.04H19.112a.744.744 0 0 0-.23.041l-.013.004-.028.011-.01.004c-1.933.726-3.48 3.097-4.6 7.048a37.343 37.343 0 0 0-1.102 5.562.75.75 0 0 0 .746.83h4.5V21a.75.75 0 1 0 1.5 0V2.987Z"
                fill="currentColor"
              />
            </svg>
            <div className="flex flex-col space-y-1">
              <p className="text-xs font-medium tracking-wider uppercase">
                Categories
              </p>
              <p className="text-sm text-gray-500">
                {categories
                  .map<React.ReactNode>((category, index) => (
                    <Link key={index} href={category.url} passHref>
                      <a className="hover:underline">{category.name}</a>
                    </Link>
                  ))
                  .reduce((prev, current) => [prev, ", ", current])}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
