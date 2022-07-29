import Image from "next/image"

export interface Article {
  id: string
  type: "article"
  status: boolean
  title: string
  author: string
  date: string
  image: {
    url: string
    alt: string
  }
  body: string
}

interface ArticleProps {
  article: Article
}

export function Article({ article, ...props }: ArticleProps) {
  return (
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
      {article.body && (
        <div
          dangerouslySetInnerHTML={{ __html: article.body }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}
    </article>
  )
}
