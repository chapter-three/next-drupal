import { Nutrition } from "types"

interface RecipeNutritionProps {
  heading: string
  nutritions: Nutrition[]
  caption?: string
}

export function RecipeNutrition({
  heading,
  nutritions,
  caption,
}: RecipeNutritionProps) {
  return (
    <div className="flex flex-col justify-between p-8 bg-secondary rounded-3xl">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold xl:text-2xl">{heading}</h2>
        <div className="flex flex-col space-y-4 divide-y">
          {nutritions?.map((nutrition, index) => (
            <p
              key={index}
              className="flex justify-between pt-4 text-lg font-medium"
            >
              <span className="text-gray-600">{nutrition.title}</span>
              <span className="text-right">{nutrition.value}</span>
            </p>
          ))}
        </div>
      </div>
      {caption && (
        <p className="mt-10 text-sm text-center text-gray-600">{caption}</p>
      )}
    </div>
  )
}
