import { DrupalNode } from "next-drupal"
import { DrupalJsonApiParams } from "drupal-jsonapi-params"

import { useResourceCollection } from "hooks/use-resource-collection"
import { formatRecipe } from "formatters/recipe"
import { RecipeTeaser } from "components/recipe-teaser"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"

interface LatestRecipes {
  exclude?: string
  show?: number
}

export function LatestRecipes({ exclude, show = 4 }: LatestRecipes) {
  const router = useRouter()
  const { t } = useTranslation("common")

  const params = new DrupalJsonApiParams()
    .addSort("created", "DESC")
    .addPageLimit(show)
    .addFilter("status", "1")
    .addInclude(["field_images.field_media_image", "uid"])
    .addFields("node--recipe", ["title", "path", "uid", "field_images"])
    .addFields("media--image", ["field_media_image"])
    .addFields("file--file", ["uri", "resourceIdObjMeta"])
    .addFields("user--user", ["display_name"])

  if (exclude) {
    params.addFilter("id", exclude, "<>")
  }

  const {
    isLoading,
    isError,
    data: recipes,
  } = useResourceCollection<DrupalNode[]>("node--recipe", {
    params: params.getQueryObject(),
    locale: router.locale,
    defaultLocale: router.defaultLocale,
  })

  if (isError) {
    return null
  }

  return (
    <div className="w-full">
      <h3 className="mb-6 text-3xl font-semibold">{t("latest-recipes")}</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {Array.from(Array(show).keys()).map((key) => (
          <RecipeTeaser
            key={key}
            recipe={recipes?.[key] ? formatRecipe(recipes?.[key]) : null}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  )
}
