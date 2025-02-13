import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { DrupalNode } from "next-drupal"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import { DrupalJsonApiParams } from "drupal-jsonapi-params"
import { getSession } from "next-auth/react"

import { drupal } from "lib/drupal"
import { getGlobalElements } from "lib/get-global-elements"
import { Layout, LayoutProps } from "components/layout"
import { PageHeader } from "components/page-header"
import { NodeArticleRow } from "components/node--article--row"

interface AccountPageProps extends LayoutProps {
  articles: DrupalNode[]
}

export default function AccountsPage({
  articles,
  menus,
  blocks,
}: AccountPageProps) {
  const { t } = useTranslation()

  return (
    <Layout
      menus={menus}
      blocks={blocks}
      meta={{
        title: t("my-account"),
      }}
    >
      <PageHeader
        heading={t("my-account")}
        breadcrumbs={[
          {
            title: t("my-account"),
          },
        ]}
      >
        <Link
          href="/articles/new"
          passHref
          className="px-3 py-1 font-serif text-lg text-white transition-colors border-2 rounded-md lg:text-xl lg:px-4 lg:py-2 bg-secondary hover:bg-white hover:text-black border-secondary"
        >
          New Article
        </Link>
      </PageHeader>
      <div className="container">
        {articles?.length ? (
          <div className="grid max-w-2xl gap-4 mx-auto">
            {articles.map((article) => (
              <NodeArticleRow key={article.id} node={article} />
            ))}
          </div>
        ) : (
          <p className="font-serif text-2xl text-center text-text">
            {t("you-have-no-articles")}
          </p>
        )}
      </div>
    </Layout>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<AccountPageProps>> {
  // Check if user is authenticated.
  const session = await getSession({ ctx: context })

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  // Fetch all articles sorted by the user.
  const articles = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--article",
    context,
    {
      params: new DrupalJsonApiParams()
        .addFilter("uid.id", session.user.id)
        .addInclude(["field_media_image.field_media_image", "uid.user_picture"])
        .addFields("node--article", [
          "title",
          "path",
          "field_media_image",
          "status",
          "created",
        ])
        .addFields("media--image", ["field_media_image"])
        .addFields("file--file", ["uri", "resourceIdObjMeta"])
        .addSort("created", "DESC")
        .getQueryObject(),
      withAuth: session.accessToken,
    }
  )

  return {
    props: {
      ...(await getGlobalElements(context)),
      articles,
    },
  }
}
