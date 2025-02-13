import Link from "next/link"
import {
  DrupalBlock,
  DrupalMenuLinkContent,
  DrupalTaxonomyTerm,
} from "next-drupal"
import { useTranslation } from "next-i18next"

import { MediaImage } from "components/media--image"
import { FormattedText } from "components/formatted-text"
import { MenuFooter } from "components/menu-footer"

export interface FooterProps {
  menus: {
    footer: DrupalMenuLinkContent[]
  }
  blocks: {
    recipeCollections: DrupalTaxonomyTerm[]
    footerPromo: DrupalBlock
    disclaimer: DrupalBlock
  }
}

export function Footer({ menus, blocks }: FooterProps) {
  const { t } = useTranslation("common")

  return (
    <footer>
      {blocks.recipeCollections?.length ? (
        <section className="py-10 text-white bg-gray">
          <div className="container">
            <h2 className="font-serif text-3xl text-center">
              {t("recipe-collections")}
            </h2>
            <div className="grid max-w-4xl mx-auto mt-4 text-sm text-center md:text-left md:grid-cols-4 gap-y-3 gap-x-4">
              {blocks.recipeCollections.map((tag) => (
                <Link
                  key={tag.id}
                  href={tag.path.alias}
                  passHref
                  className="font-semibold hover:underline"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="py-8 text-white bg-gray-darker">
        <div className="container justify-between lg:grid lg:grid-cols-[6fr_1.5fr_2.5fr]">
          {blocks?.footerPromo && (
            <div className="grid text-center lg:text-left lg:grid-cols-[266px_1fr] lg:h-[200px] overflow-hidden gap-6">
              {blocks.footerPromo.field_media_image && (
                <MediaImage
                  media={blocks.footerPromo.field_media_image}
                  width={266}
                  height={236}
                  layout="fixed"
                />
              )}
              <div className="items-start flex-1 space-y-4 text-center lg:pt-10 lg:flex lg:flex-col lg:text-left">
                <h2 className="font-serif text-2xl">
                  {blocks.footerPromo.field_title}
                </h2>
                {blocks.footerPromo.field_summary && (
                  <p className="text-sm leading-normal">
                    {blocks.footerPromo.field_summary}
                  </p>
                )}
                {blocks.footerPromo.field_content_link && (
                  <Link
                    href={blocks.footerPromo.field_content_link.uri.replace(
                      "internal:",
                      ""
                    )}
                    passHref
                    className="text-sm underline transition-colors hover:bg-black"
                  >
                    {blocks.footerPromo.field_content_link.title}
                  </Link>
                )}
              </div>
            </div>
          )}
          {menus?.footer?.length ? (
            <div className="pt-10 text-center lg:text-left lg:col-start-3">
              <h2 className="mb-4 font-serif text-2xl">
                {t("tell-us-what-you-think")}
              </h2>
              <MenuFooter items={menus.footer} />
            </div>
          ) : null}
        </div>
      </section>
      {blocks.disclaimer && (
        <div className="container text-center flex flex-col space-y-4 lg:text-left lg:grid-cols-[4fr_3.5fr_2.5fr] lg:space-y-0 lg:grid justify-between py-8 text-sm text-text">
          <div>
            <FormattedText
              text={blocks.disclaimer.field_disclaimer.processed}
            />
          </div>
          <div className="col-start-3">
            <FormattedText text={blocks.disclaimer.field_copyright.processed} />
          </div>
        </div>
      )}
    </footer>
  )
}
