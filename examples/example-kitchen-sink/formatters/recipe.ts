import { DrupalNode, DrupalTaxonomyTerm } from "next-drupal"

import { Recipe, RecipeCategory } from "types"
import { formatAuthor } from "formatters/author"
import { formatImage } from "formatters/image"

// This is a custom data formatter for converting a node--recipe to a recipe.
// This simplifies our component since they do not need to know about Drupal.
export function formatRecipe(node: DrupalNode): Recipe {
  const { caption, ...nutrition } = node.field_nutrition?.[0]?.value ?? {}

  const recipe: Recipe = {
    id: node.id,
    name: node.title,
    date: node.created,
    url: node.path.alias,
    prepTime: node.field_prep_time,
    cookTime: node.field_cook_time,
    body: node.body?.processed,
    image: node.field_images?.length
      ? formatImage(node.field_images[0].field_media_image)
      : null,
    author: node.uid && formatAuthor(node.uid),
    nutritions: Object.values(nutrition).map(([title, value]) => ({
      title,
      value,
    })),
    nutritionCaption: caption,
    categories: node.field_categories?.map((category) =>
      formatRecipeCategory(category)
    ),
  }

  return recipe
}

export function formatRecipeCategory(term: DrupalTaxonomyTerm): RecipeCategory {
  return {
    id: term.id,
    name: term.name,
    url: term.path?.alias,
  }
}
