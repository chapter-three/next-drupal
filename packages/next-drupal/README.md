# Next Plugin

The `next-drupal` plugin provides helpers for consuming Drupal JSON API and for creating [preview routes](https://nextjs.org/docs/advanced-features/preview-mode).

### Installation

```bash
npm install --save next-drupal
```

### Reference

#### getPathsForEntityType(entity_type, bundle, options)

- **entity_type**: the id of the entity_type
- **bundle**: the bundle for the entity
- **options**:
  - **params**: JSON API params for filtering, includes, sorting..etc
  - **filter**: a filter callback for filtering entities

Example:

```js
export async function getStaticPaths() {
  const paths = await getPathsForEntityType("node", "article", {
    params: {
      "filter[status]": 1,
    },
  })

  return {
    paths,
    fallback: true,
  }
}
```

#### getEntitiesFromContext(entity_type, bundle, context, options)

- **entity_type**: the id of the entity_type
- **bundle**: the bundle for the entity
- **context**: GetStaticPropsContext
- **options**:
  - **prefix**: path prefix
  - **params**: JSON API params for filtering, includes, sorting..etc
  - **deserialize**: set to `true` if the return data should be deserialize

Example:

```js
export async function getStaticProps(context) {
  let articles = await getEntitiesFromContext("node", "article", context, {
    params: {
      include: "field_image, uid",
      sort: "-created",
    },
    deserialize: true,
  })

  return {
    props: {
      articles,
    },
    revalidate: 1,
  }
}
```

#### getEntityFromContext(entity_type, bundle, context, options)

- **entity_type**: the id of the entity_type
- **bundle**: the bundle for the entity
- **context**: GetStaticPropsContext
- **options**:
  - **prefix**: path prefix
  - **params**: JSON API params for filtering, includes, sorting..etc
  - **deserialize**: set to `true` if the return data should be deserialize

Example:

```js
export async function getStaticProps(context) {
  const post = await getEntityFromContext("node", "article", context, {
    prefix: "/blog",
    params: {
      include: "field_image, uid",
    },
    deserialize: true,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 1,
  }
}
```

### Preview mode

To create preview routes for an entity type on your Next.js site:

1. First, copy environment variables in your _.env.local_ file:

You can grab the environment variables for a site by visiting the **Environment variables** page in Drupal (see _/admin/config/services/next_).

```
NEXT_PUBLIC_DRUPAL_BASE_URL=
NEXT_IMAGE_DOMAIN=
DRUPAL_SITE_ID=
DRUPAL_CLIENT_ID=
DRUPAL_CLIENT_SECRET=
DRUPAL_PREVIEW_SECRET=
```

2. Next, create a page with a dynamic route: `pages/blog/[...slug].jsx`

```js
// pages/blog/[...slug].jsx

import { getPathsForEntityType, getEntityFromContext } from "next-drupal"

export default function BlogPostPage({ post }) {
  if (!post) return null

  return (
    <article>
      <h1>{post.title}</h1>
      {post.body?.processed && (
        <div dangerouslySetInnerHTML={{ __html: post.body?.processed }} />
      )}
    </article>
  )
}

export async function getStaticPaths() {
  const paths = await getPathsForEntityType("node", "article", {
    params: {
      "filter[status]": 1,
    },
  })

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const post = await getEntityFromContext("node", "article", context, {
    prefix: "/blog",
    params: {
      include: "field_image, uid",
    },
    deserialize: true,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 1,
  }
}
```

3. Create a `/api/preview` route: `pages/api/preview.js`

```js
// pages/api/preview.js

import { NextApiRequest, NextApiResponse } from "next"

export default function (request: NextApiRequest, response: NextApiResponse) {
  const { slug, resourceVersion, secret } = request.query

  if (secret !== process.env.DRUPAL_PREVIEW_SECRET) {
    return response.status(401).json({ message: "Invalid preview secret." })
  }

  if (!slug) {
    return response.status(401).json({ message: "Invalid slug." })
  }

  response.setPreviewData({
    resourceVersion,
  })

  response.redirect(slug as string)
}
```

4. Create a `/api/exit-preview` route: `pages/api/exit-preview.js`.

```js
// pages/api/exit-preview.js

import { NextApiResponse } from "next"

export default async function exit(_, response: NextApiResponse) {
  response.clearPreviewData()

  response.writeHead(307, { Location: "/" })
  response.end()
}
```

That's it. You should now be able to preview entities from within your Drupal site.
