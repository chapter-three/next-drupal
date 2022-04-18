import Image from "next/image"
import Link from "next/link"

import { Recipe } from "types"
import { truncate } from "lib/utils"
import { Skeleton } from "components/skeleton"

interface RecipeTeaserProps {
  isLoading?: boolean
  recipe?: Recipe
}

export function RecipeTeaser({ recipe, isLoading = false }: RecipeTeaserProps) {
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
    <div className="relative flex items-center space-x-6 group">
      <figure className="flex-1 w-full overflow-hidden transition-opacity rounded-xl group-hover:opacity-75">
        <Image
          layout="responsive"
          src={recipe.image.url}
          alt={recipe.image.alt}
          objectFit="cover"
          width={180}
          height={120}
        />
      </figure>
      <div className="flex flex-col flex-1">
        <h4 className="mb-2 text-xl font-semibold leading-normal md:text-base xl:text-xl">
          <Link href={recipe.url} passHref>
            <a className="transition-colors group-hover:text-primary ">
              <span aria-hidden="true" className="absolute inset-0" />
              {truncate(recipe.name, 40)}
            </a>
          </Link>
        </h4>
        <p className="text-sm text-gray-600">{recipe.author.name}</p>
      </div>
    </div>
  )
}
