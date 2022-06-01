import { GetStaticPropsContext, GetStaticPropsResult } from "next"
import { useTranslation } from "next-i18next"

import { getGlobalElements } from "lib/get-global-elements"
import { Layout, LayoutProps } from "components/layout"
import { PageHeader } from "components/page-header"
import { FormArticle } from "components/form--article"

interface NewArticlesPageProps extends LayoutProps {}

export default function NewArticlesPage({
  menus,
  blocks,
}: NewArticlesPageProps) {
  const { t } = useTranslation()

  return (
    <Layout meta={{ title: t("new-article") }} menus={menus} blocks={blocks}>
      <PageHeader
        heading={t("new-article")}
        breadcrumbs={[
          {
            title: t("articles"),
            url: "/articles",
          },
          {
            title: t("new-article"),
          },
        ]}
      />
      <div className="container pb-10">
        <FormArticle className="max-w-2xl mx-auto" />
      </div>
    </Layout>
  )
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<NewArticlesPageProps>> {
  return {
    props: {
      ...(await getGlobalElements(context)),
    },
  }
}
