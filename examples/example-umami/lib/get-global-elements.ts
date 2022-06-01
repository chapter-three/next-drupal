import { GetServerSidePropsContext, GetStaticPropsContext } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { DrupalBlock, DrupalTaxonomyTerm } from "next-drupal"

import { drupal } from "lib/drupal"
import { getParams } from "lib/get-params"
import { LayoutProps } from "components/layout"

type GlobalElements = LayoutProps

// This is a helper function to fetch global elements for layout.
// This is going to be run for every pages on build.
// To make this fast, you could cache the results example on Redis.
export async function getGlobalElements(
  context: GetStaticPropsContext | GetServerSidePropsContext
): Promise<GlobalElements> {
  const menuOpts = {
    params: getParams("menu_link_content--menu_link_content").getQueryObject(),
    locale: context.locale,
    defaultLocale: context.defaultLocale,
  }

  // Fetch menu items.
  const mainMenu = await drupal.getMenu("main", menuOpts)
  const footerMenu = await drupal.getMenu("footer", menuOpts)

  // Fetch recipes collections view.
  const { results: recipeCollections } = await drupal.getView<
    DrupalTaxonomyTerm[]
  >("recipe_collections--block", {
    locale: context.locale,
    defaultLocale: context.defaultLocale,
    params: getParams("taxonomy_term--tags").addSort("name").getQueryObject(),
  })

  // Fetch the footer promo block.
  // You would normally use drupal.getResource() here to fetch the block by uuid.
  // We're using getResourceCollection and a filter here because this demo needs
  // to work on any Umami demo. UUIDs are different for every Umami install.
  const [footerPromo] = await drupal.getResourceCollectionFromContext<
    DrupalBlock[]
  >("block_content--footer_promo_block", context, {
    params: getParams("block_content--footer_promo_block")
      .addFilter("info", "Umami footer promo")
      .addPageLimit(1)
      .getQueryObject(),
  })

  // Fetch the disclaimer block.
  // See comment above on why we use drupal.getResourceCollectionFromContext
  // instead of drupal.getResource.
  const [disclaimer] = await drupal.getResourceCollectionFromContext<
    DrupalBlock[]
  >("block_content--disclaimer_block", context, {
    params: getParams("block_content--disclaimer_block")
      .addFilter("info", "Umami Disclaimer")
      .addPageLimit(1)
      .getQueryObject(),
  })

  return {
    ...(await serverSideTranslations(context.locale, ["common"])),
    menus: {
      main: mainMenu.items,
      footer: footerMenu.items,
    },
    blocks: {
      recipeCollections,
      footerPromo,
      disclaimer,
    },
  }
}
