import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

import { NodeArticle } from "queries/node--article"

interface ArticleProps {
  article: NodeArticle
}

export function Article({ article, ...props }: ArticleProps) {
  return (
    <>
      <Head>
        <title>{article.title}</title>
      </Head>
      <article {...props}>
        <h1 className="mb-4 text-6xl font-black leading-tight">
          {article.title}
        </h1>
        <div className="mb-4 text-gray-600">
          {article.author ? (
            <span>
              Posted by <span className="font-semibold">{article.author}</span>
            </span>
          ) : null}
          {article.date && <span> - {article.date}</span>}
        </div>
        {article.image && (
          <figure>
            <Image
              src={article.image.url}
              width={900}
              height={480}
              layout="responsive"
              objectFit="cover"
              alt={article.image.alt}
              priority
            />
          </figure>
        )}
        <div className="font-serif prose prose-xl">
          {article.body && (
            <div
              dangerouslySetInnerHTML={{ __html: article.body }}
              className="mt-6"
            />
          )}
          {article.relatedArticles?.length ? (
            <div>
              <h2>Related Articles</h2>
              {article.relatedArticles.map((article) => (
                <li key={article.id}>
                  <Link href={article.url} passHref>
                    <a>{article.title}</a>
                  </Link>
                </li>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </>
  )
}
