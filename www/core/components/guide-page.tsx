import { TableOfContents } from "next-mdx-toc"
import { useHydrate } from "next-mdx/client"

import { Guide, MdxComponents } from "@/core/types"
import { Layout } from "@/core/components/layout"
import { SidebarNav } from "@/core/components/sidebar-nav"
import { Pager } from "@/core/components/pager"
import { Toc } from "@/core/components/toc"

import { guides } from "@/config/guides"

export interface GuidePageProps {
  guide: Guide
  toc: TableOfContents
  components: MdxComponents
}

export function GuidePage({ guide, toc, components }: GuidePageProps) {
  const content = useHydrate(guide, {
    components,
  })

  return (
    <Layout
      title={guide.frontMatter.title}
      description={guide.frontMatter.excerpt}
    >
      <div variant="container">
        <div display="grid" col="1|||250px 1fr" gap="null|6|6|16">
          <aside
            display="none|none|none|block"
            position="static|sticky"
            top="14"
            h={(theme) => `calc(100vh - ${theme.space[14]})`}
            overflow="scroll"
            py="6|12"
            borderRightWidth="0|1"
          >
            <SidebarNav items={guides.links} />
          </aside>
          <div display="grid" col="1||||minmax(0, 1fr) 250px" gap="6|6|16">
            <div py="6|8|10" className="GuideSearch-content">
              <h1 variant="heading.h1">{guide.frontMatter.title}</h1>
              {guide.frontMatter.excerpt ? (
                <p variant="text.lead" mt="2">
                  {guide.frontMatter.excerpt}
                </p>
              ) : null}
              <hr my="6" />
              {content}
              <Pager links={guides.links} />
            </div>
            <aside
              display="none|none|none|block"
              position="static|sticky"
              top="14"
              h={(theme) => `calc(100vh - ${theme.space[14]})`}
              py="6|12"
              overflow="scroll"
            >
              {toc.items?.length && (
                <>
                  <h2 variant="heading.h6" mb="2">
                    On this page
                  </h2>
                  <Toc tree={toc} />
                </>
              )}
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  )
}
