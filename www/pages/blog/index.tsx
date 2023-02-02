import { getAllMdxNodes } from "next-mdx/server"

import { Blog } from "types"
import { Layout } from "components/layout"
import Link from "next/link"

export interface BlogsPageProps {
  blogs: Blog[]
}

export default function BlogsPage({ blogs }: BlogsPageProps) {
  return (
    <Layout
      title="Blog"
      description="Latest updates from the Next-Drupal team."
    >
      <div className="container max-w-3xl px-6 py-12 mx-auto xl:px-8">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Blog
        </h1>
        <p className="mt-4 text-gray-700">Latest updates from the team.</p>
        <hr className="py-6 mt-6" />
        {blogs.map((blog) => (
          <article key={blog.slug}>
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl md:text-3xl">
              <Link href={blog.url} passHref>
                <a>{blog.frontMatter.title}</a>
              </Link>
            </h2>
            <p className="mt-2 text-gray-700">
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
            {blog.frontMatter.excerpt ? (
              <p className="my-4 text-gray-700">{blog.frontMatter.excerpt}</p>
            ) : null}

            <Link href={blog.url} passHref>
              <a className="text-sm text-blue-500 hover:text-black">
                Read More →
              </a>
            </Link>
            <hr className="py-6 mt-6" />
          </article>
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const blogs = (await getAllMdxNodes<Blog>("blog", context)).filter(
    (post) => post.frontMatter.published
  )

  return {
    props: {
      blogs,
    },
  }
}
