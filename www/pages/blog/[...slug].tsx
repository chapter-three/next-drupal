import { getMdxNode, getMdxPaths } from "next-mdx/server"
import { useHydrate } from "next-mdx/client"

import { Blog } from "types"
import { Layout } from "components/layout"
import { mdxComponents } from "components/mdx"

export interface BlogsPageProps {
  blog: Blog
}

export default function BlogsPage({ blog }: BlogsPageProps) {
  const content = useHydrate(blog, {
    components: mdxComponents,
  })

  return (
    <Layout
      title={blog.frontMatter.title}
      description={blog.frontMatter.excerpt}
    >
      <div className="container max-w-3xl px-6 py-12 mx-auto xl:px-8">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {blog.frontMatter.title}
        </h1>
        <p className="mt-4 text-gray-700">
          {blog.frontMatter.date} -{" "}
          <a
            href="https://twitter.com/shadcn"
            target="_blank"
            rel="noreferrer nofollow"
            className="text-blue-600"
          >
            @shadcn
          </a>
        </p>
        <hr className="my-6" />
        {content}
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("blog"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const blog = await getMdxNode("blog", context, {
    components: mdxComponents,
    mdxOptions: {
      remarkPlugins: [
        require("remark-slug"),
        require("remark-autolink-headings"),
      ],
      rehypePlugins: [
        [
          require("rehype-pretty-code"),
          {
            theme: "github-dark",

            onVisitLine(node) {
              // Prevent lines from collapsing in `display: grid` mode, and allow empty
              // lines to be copy/pasted
              if (node.children.length === 0) {
                node.children = [{ type: "text", value: " " }]
              }
            },
            onVisitHighlightedLine(node) {
              node.properties.className.push("line--highlighted")
            },
            onVisitHighlightedWord(node) {
              node.properties.className = ["word--highlighted"]
            },
          },
        ],
      ],
    },
  })

  if (!blog) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      blog,
    },
  }
}
