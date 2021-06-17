import { TableOfContents } from "next-mdx-toc"
import { useHydrate } from "next-mdx/client"

import { Doc, MdxComponents } from "@/core/types"
import { Layout } from "@/core/components/layout"
import { SidebarNav } from "@/core/components/sidebar-nav"
import { Pager } from "@/core/components/pager"
import { Toc } from "@/core/components/toc"

import { docs } from "@/config/docs"

export interface DocPageProps {
  doc: Doc
  toc: TableOfContents
  components: MdxComponents
}

export function DocPage({ doc, toc, components }: DocPageProps) {
  const content = useHydrate(doc, {
    components,
  })

  return (
    <Layout title={doc.frontMatter.title} description={doc.frontMatter.excerpt}>
      <div variant="container">
        <div display="grid" col="1|||270px 1fr" gap="null|6|6|16">
          <aside
            display="none|none|none|block"
            position="static|sticky"
            top="14"
            h={(theme) => `calc(100vh - ${theme.space[14]})`}
            overflow="scroll"
            py="6|12"
            borderRightWidth="0|1"
          >
            <SidebarNav items={docs.links} />
          </aside>
          <div display="grid" col="1||||minmax(0, 1fr) 240px" gap="6|6|16">
            <div py="6|8|10" className="DocSearch-content">
              <h1 variant="heading.h1">{doc.frontMatter.title}</h1>
              {doc.frontMatter.excerpt ? (
                <p variant="text.lead" mt="2">
                  {doc.frontMatter.excerpt}
                </p>
              ) : null}
              <hr my="6" />
              {content}
              <Pager links={docs.links} />
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
