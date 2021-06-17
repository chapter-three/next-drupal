import { getMdxNode, getMdxPaths } from "next-mdx/server"
import { getTableOfContents, TableOfContents } from "next-mdx-toc"

import { Doc } from "@/core/types"
import { DocPage } from "@/core/components/doc-page"
import { mdxComponents } from "@/core/components/mdx-components"

export interface DocsPageProps {
  doc: Doc
  toc: TableOfContents
}

export default function DocsPage({ doc, toc }: DocsPageProps) {
  return <DocPage doc={doc} toc={toc} components={mdxComponents} />
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
