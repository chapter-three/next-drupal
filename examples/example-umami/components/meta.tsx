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
        rel="canonical"
        href={absoluteURL(router.asPath !== "/" ? router.asPath : "")}
      />
      <title>
        {title} | {siteConfig.name}
      </title>
      {description && <meta name="description" content={description} />}
      <meta
        property="og:image"
        content={`${process.env.NEXT_PUBLIC_BASE_URL}/images/meta.jpg`}
      />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="600" />
    </Head>
  )
}
