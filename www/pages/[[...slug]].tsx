import Link from "next/link"
import { getMdxNode, getMdxPaths } from "next-mdx/server"
import { useHydrate } from "next-mdx/client"
import { Icon } from "reflexjs"

import { Doc } from "types"
import { docs } from "@/config/docs"
import { mdxComponents } from "@/components/mdx-components"
import { Layout } from "@/components/layout"
import { SidebarNav } from "@/components/sidebar-nav"
import { getTableOfContents, TableOfContents } from "next-mdx-toc"
import { Toc } from "@/components/toc"

export interface DocsPageProps {
  doc: Doc
  toc: TableOfContents
}

export default function DocsPage({ doc, toc }: DocsPageProps) {
  const content = useHydrate(doc, {
    components: mdxComponents,
  })
  return (
    <Layout title={doc.frontMatter.title} description={doc.frontMatter.excerpt}>
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
            <SidebarNav items={docs.manifest} />
          </aside>
          <div display="grid" col="1||||minmax(0, 1fr) 250px" gap="6|6|16">
            <div py="10" className="DocSearch-content">
              <h1 variant="heading.h1">{doc.frontMatter.title}</h1>
              {doc.frontMatter.excerpt ? (
                <p variant="text.lead" mt="2">
                  {doc.frontMatter.excerpt}
                </p>
              ) : null}
              <hr my="6" />
              {content}
              <div
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                py="10"
              >
                {doc.frontMatter.prev ? (
                  <Link href={doc.frontMatter.prev.url} passHref>
                    <a variant="button.link">
                      <Icon
                        name="chevron"
                        size="5"
                        mr="2"
                        transform="rotate(180deg)"
                      />
                      {doc.frontMatter.prev.title}
                    </a>
                  </Link>
                ) : null}
                {doc.frontMatter.next ? (
                  <Link href={doc.frontMatter.next.url} passHref>
                    <a variant="button.link" ml="auto">
                      {doc.frontMatter.next.title}{" "}
                      <Icon name="chevron" size="5" ml="2" />
                    </a>
                  </Link>
                ) : null}
              </div>
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
                  <h4 variant="heading.h6" mb="2">
                    On this page
                  </h4>
                  <Toc tree={toc} />
                </>
              )}
              <div mt="10" bg="lightyellow" p="4">
                <p fontWeight="semibold">
                  <em>
                    Warning: this project is in early alpha. The API might
                    change without notice.
                  </em>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("doc"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const doc = await getMdxNode("doc", context, {
    components: mdxComponents,
    mdxOptions: {
      remarkPlugins: [
        require("remark-slug"),
        require("remark-autolink-headings"),
      ],
    },
  })

  if (!doc) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      doc,
      toc: await getTableOfContents(doc),
    },
  }
}
