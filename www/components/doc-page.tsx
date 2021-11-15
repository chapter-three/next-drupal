import { TableOfContents } from "next-mdx-toc"
import { useHydrate } from "next-mdx/client"

import { Doc, MdxComponents } from "types"
import { Layout } from "components/layout"
import { SidebarNav } from "components/sidebar-nav"
import { Pager } from "components/pager"
import { Toc } from "components/toc"
import { docs } from "config/docs"

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
        <div display="grid" col="1|||300px 1fr" gap="null|6|6|16">
          <aside
            display="none|none|none|block"
            position="static|sticky"
            top="14"
            h={(theme) => `calc(100vh - ${theme.space[14]})`}
            overflow="scroll"
            py="6|12"
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
                <div mb="10">
                  <h2 variant="heading.h6" mb="2">
                    On this page
                  </h2>
                  <Toc tree={toc} />
                </div>
              )}
              <h2 variant="heading.h6" mb="2">
                Sponsors
              </h2>
              <div bg="muted" p="4" textAlign="center" borderRadius="md">
                Development sponsored by{" "}
                <a
                  href="https://chapterthree.com"
                  target="_blank"
                  rel="noreferrer"
                  textTransform="uppercase"
                  color="text"
                  fontWeight="bold"
                >
                  Chapter Three
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  )
}
