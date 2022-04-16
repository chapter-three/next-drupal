import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next"
import { DrupalNode, JsonApiResource } from "next-drupal"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import { drupal } from "lib/drupal"
import { getMenus } from "lib/get-menus"
import { getParams } from "lib/get-params"
import { formatRecipe } from "formatters/recipe"
import { formatPost } from "formatters/post"
import { formatLandingPage } from "formatters/landing-page"
import { Layout, LayoutProps } from "components/layout"
import { PostPage } from "components/post-page"
import { LandingPage } from "components/landing-page"
import { RecipePage } from "components/recipe-page"

const RESOURCE_TYPES = ["node--landing_page", "node--article", "node--recipe"]

interface PageProps extends LayoutProps {
  resource: JsonApiResource
}

export default function Page({ menus, resource }: PageProps) {
  return (
    <Layout menus={menus}>
      {resource.type === "node--article" && (
        <PostPage post={formatPost(resource as DrupalNode)} />
      )}
      {resource.type === "node--recipe" && (
        <RecipePage recipe={formatRecipe(resource as DrupalNode)} />
      )}
      {resource.type === "node--landing_page" && (
        <LandingPage page={formatLandingPage(resource as DrupalNode)} />
      )}
    </Layout>
  )
}

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  return {
    // Build static paths for all resource types.
    paths: await drupal.getStaticPathsFromContext(RESOURCE_TYPES, context),

    // If a path is requested and is not static, Next.js will call getStaticProps and try to find it.
    fallback: "blocking",
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> {
  // Get info about this path.
  // This will return the resource name, the entity information and the uuid.
  const path = await drupal.translatePathFromContext(context)

  const type = path?.jsonapi.resourceName

  // Since we're using fallback: "blocking", Next.js will call
  // getStaticProps for all paths (even non-existing ones).
  // Return not found if we do not care about this resource type.
  if (!RESOURCE_TYPES.includes(type)) {
    return {
      notFound: true,
    }
  }

  // Fetch the resource from Drupal.
  const resource = await drupal.getResourceFromContext(
    path.jsonapi.resourceName,
    context,
    {
      params: getParams(type),
    }
  )

  // At this point, we know the path exists and it points to a resource.
  // If we receive an error, it means something went wront on the error.
  // We throw an error to tell revalidation to skip this for now.
  // Revalidation will try again on next request.
  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`)
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && resource?.status === false) {
    return {
      notFound: true,
    }
  }

  // Landing pages has a view paragraph type.
  // This view paragraph type references views.
  // We load the initial view data here.
  if (resource?.field_sections) {
    for (const section of resource.field_sections) {
      if (section?.type === "paragraph--view") {
        const viewId = section.field_view
        section.field_view = await drupal.getView(viewId, {
          params: getParams(viewId),
          locale: context.locale,
          defaultLocale: context.defaultLocale,
        })
      }
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common"])),
      menus: await getMenus({
        locale: context.locale,
        defaultLocale: context.defaultLocale,
      }),
      resource,
    },
  }
}
