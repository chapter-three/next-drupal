import { formatRecipe } from "formatters/recipe"
import { DrupalNode, DrupalView } from "next-drupal"
import { RecipeCard } from "./recipe-card"

interface ViewRecipesProps {
  view: DrupalView
}

export function RecipesView({ view }: ViewRecipesProps) {
  const recipes = view.results.map((node) => formatRecipe(node as DrupalNode))

  return (
    <div className="container px-6 mx-auto lg:px-8">
      <div className="grid sm:gap-4 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}
