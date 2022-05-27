import Image from "next/image"
import Link from "next/link"
import { DrupalNode } from "next-drupal"
import { useTranslation } from "next-i18next"

import { absoluteURL, formatDate } from "lib/utils"
import { FormattedText } from "components/formatted-text"
import { Breadcrumbs } from "components/breadcrumbs"
import { NodeArticleCard } from "components/node--article--card"

export interface NodeArticleProps {
  node: DrupalNode
  additionalContent: {
    featuredArticles: DrupalNode[]
  }
}

export function NodeArticle({ node, additionalContent }: NodeArticleProps) {
  const { t } = useTranslation()

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          {
            title: t("home"),
            url: "/",
          },
          {
            title: t("articles"),
            url: "/articles",
          },
          {
            title: node.title,
          },
        ]}
      />
      <article className="grid gap-8 pb-12 lg:grid-cols-10">
        <div className="p-10 bg-white border border-border lg:col-span-7 text-text">
          <h1 className="font-serif text-4xl">{node.title}</h1>
          <div className="flex items-center my-4 space-x-2 text-sm">
            {node.uid?.display_name ? (
              <span>
                {t("by")} {node.uid.display_name}
              </span>
            ) : null}
            <svg
              className="w-[6px] h-[6px] opacity-60 text-link"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="12" fill="currentColor" />
            </svg>
            <span className="text-gray-500">{formatDate(node.created)}</span>
          </div>
          {node.field_tags?.length ? (
            <div className="flex mb-6 space-x-2">
              <span className="font-semibold">{t("tags")}: </span>
              {node.field_tags.map((tag) => (
                <Link key={tag.id} href={tag.path.alias} passHref>
                  <a className="underline transition-colors text-link hover:text-primary hover:bg-border">
                    {tag.name}
                  </a>
                </Link>
              ))}
            </div>
          ) : null}
          {node.field_media_image && (
            <figure className="mb-10">
              <Image
                src={absoluteURL(
                  node.field_media_image.field_media_image.uri.url
                )}
                alt={
                  node.field_media_image.field_media_image.resourceIdObjMeta.alt
                }
                width={785}
                height={525}
                layout="responsive"
                objectFit="cover"
              />
            </figure>
          )}
          {node.body && (
            <div className="prose prose-p:text-text max-w-none prose-headings:font-serif prose-headings:text-text">
              <FormattedText text={node.body.processed} />
            </div>
          )}
        </div>
        {additionalContent?.featuredArticles && (
          <div className="flex flex-col space-y-6 lg:col-span-3">
            <h2 className="font-serif text-3xl text-text">
              {t("more-featured-articles")}
            </h2>
            {additionalContent.featuredArticles.map((node) => (
              <NodeArticleCard key={node.id} node={node} />
            ))}
          </div>
        )}
      </article>
    </div>
  )
}
