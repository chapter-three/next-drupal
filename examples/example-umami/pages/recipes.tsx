import { GetStaticPropsContext, GetStaticPropsResult } from "next"
import { DrupalBlock, DrupalNode } from "next-drupal"
import { useTranslation } from "next-i18next"

import { drupal } from "lib/drupal"
import { getGlobalElements } from "lib/get-global-elements"
import { getParams } from "lib/get-params"
import { Layout, LayoutProps } from "components/layout"
import { NodeRecipeTeaser } from "components/node--recipe--teaser"
import { PageHeader } from "components/page-header"
import { BlockBanner } from "components/block--banner"

interface RecipePageProps extends LayoutProps {
  banner: DrupalBlock
  recipes: DrupalNode[]
}

export default function RecipesPage({
  banner,
  recipes,
  menus,
  blocks,
}: RecipePageProps) {
  const { t } = useTranslation()

  return (
    <Layout
      menus={menus}
      blocks={blocks}
      meta={{
        title: t("recipes"),
      }}
    >
      <BlockBanner block={banner} />
      <PageHeader
        heading="Recipes"
        breadcrumbs={[
          {
            title: "Home",
            url: "/",
          },
          {
            title: "Recipes",
          },
        ]}
      />
      <div className="container">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {recipes.map((recipe) => (
            <NodeRecipeTeaser key={recipe.id} node={recipe} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<RecipePageProps>> {
  // Fetch all published recipes sorted by date.
  const recipes = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--recipe",
    context,
    {
      params: getParams("node--recipe", "card")
        .addSort("created", "DESC")
        .getQueryObject(),
    }
  )

  const [banner] = await drupal.getResourceCollectionFromContext<DrupalBlock[]>(
    "block_content--banner_block",
    context,
    {
      params: getParams("block_content--banner_block")
        .addFilter("info", "Umami Recipes Banner")
        .addPageLimit(1)
        .getQueryObject(),
    }
  )

  return {
    props: {
      ...(await getGlobalElements(context)),
      banner,
      recipes,
    },
  }
}
