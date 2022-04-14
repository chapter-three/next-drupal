import Image from "next/image"

import type { Recipe } from "types"
import { FormattedText } from "components/formatted-text"
import { ShareLinks } from "components/share-links"
import { LatestRecipes } from "components/latest-recipes"
import { RecipeMeta } from "components/recipe-meta"
import { RecipeNutrition } from "components/recipe-nutrition"
import { PageHeader } from "components/page-header"

interface RecipeProps {
  recipe: Recipe
}

export function RecipePage({ recipe }: RecipeProps) {
  return (
    <article className="container px-4 mx-auto lg:px-8">
      <PageHeader heading={recipe.name}>
        <RecipeMeta
          author={recipe.author}
          date={recipe.date}
          prepTime={recipe.prepTime}
          cookTime={recipe.cookTime}
          categories={recipe.categories}
        />
      </PageHeader>
      <div className="grid gap-10 pb-6 lg:pb-12 lg:grid-cols-3 xl:gap-12">
        <div className="overflow-hidden lg:col-span-2 rounded-3xl">
          {recipe.image && (
            <Image
              layout="responsive"
              src={recipe.image.url}
              alt={recipe.image.alt}
              width={790}
              height={600}
              objectFit="cover"
              priority
            />
          )}
        </div>
        <RecipeNutrition
          heading="Nutrition Information"
          nutritions={recipe.nutritions}
          caption={recipe.nutritionCaption}
        />
      </div>
      <div className="grid gap-10 lg:grid-cols-3 xl:gap-12">
        <div className="prose text-gray-500 sm:px-8 lg:col-span-2 xl:pl-8 xl:pr-0 max-w-none">
          {recipe.body && <FormattedText text={recipe.body} />}
        </div>
        <div className="flex flex-col items-center justify-start w-full space-y-12 sm:px-8 lg:space-y-24 lg:px-0">
          <LatestRecipes />
          <ShareLinks title={recipe.name} href={recipe.url} />
        </div>
      </div>
    </article>
  )
}
