import Image from "next/image"
import Link from "next/link"

import { Recipe } from "types"
import { truncate } from "lib/utils"
import { Skeleton } from "components/skeleton"

interface RecipeCardProps {
  isLoading?: boolean
  recipe?: Recipe
}

export function RecipeCard({ recipe, isLoading = false }: RecipeCardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-6">
        <Skeleton className="w-[180px] h-[120px]" />
        <div className="flex flex-col flex-1">
          <Skeleton className="w-3/4 h-6" />
          <Skeleton className="h-6 mt-2 mb-4" />
          <Skeleton className="h-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-secondary group">
      <figure className="overflow-hidden transition-opacity rounded-3xl group-hover:opacity-75">
        <Image
          layout="responsive"
          src={recipe.image.url}
          alt={recipe.image.alt}
          objectFit="cover"
          width={368}
          height={250}
        />
      </figure>
      <div className="flex flex-col flex-1 p-6 space-y-6">
        <h3 className="mb-2 text-2xl font-semibold">
          <Link href={recipe.url} passHref>
            <a className="transition-colors group-hover:text-primary ">
              <span aria-hidden="true" className="absolute inset-0" />
              {truncate(recipe.name, 45)}
            </a>
          </Link>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            {recipe.author.picture && (
              <figure className="w-8 overflow-hidden rounded-full">
                <Image
                  src={recipe.author.picture.url}
                  alt={recipe.author.picture.alt}
                  width={18}
                  height={18}
                  layout="responsive"
                  objectFit="cover"
                />
              </figure>
            )}
            <div className="flex flex-col space-y-1">
              {recipe.author.name ? (
                <p className="text-sm">{recipe.author.name}</p>
              ) : null}
            </div>
          </div>
          {recipe.cookTime && (
            <div className="flex items-center space-x-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9.75 1.5h4.5a.75.75 0 1 0 0-1.5h-4.5a.75.75 0 1 0 0 1.5ZM12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm4.243 5.818L12.53 12.53a.75.75 0 0 1-1.06-1.06l3.712-3.713a.75.75 0 1 1 1.06 1.061Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-sm text-gray-500">{recipe.cookTime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
