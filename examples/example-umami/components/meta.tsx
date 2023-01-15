import Head from "next/head"
import { useRouter } from "next/router"

import siteConfig from "site.config"
import { absoluteURL } from "lib/utils"

export interface MetaProps {
  title?: string
  description?: string
  path?: string
}

export function Meta({ title, description }: MetaProps) {
  const router = useRouter()

  return (
    <Head>
      <link
        key="head_link_canonical"
        rel="canonical"
        href={absoluteURL(router.asPath !== "/" ? router.asPath : "")}
      />
      <title key="head_title">
        {`${title} | ${siteConfig.name}`}
      </title>
      <meta key="head_meta_description" name="description" content={description || siteConfig.slogan} />
      <meta
        key="head_meta_og:image"
        property="og:image"
        content={`${process.env.NEXT_PUBLIC_BASE_URL}/images/meta.jpg`}
      />
      <meta key="head_meta_og:image:width" property="og:image:width" content="800" />
      <meta key="head_meta_og:image:height" property="og:image:height" content="600" />
    </Head>
  )
}
