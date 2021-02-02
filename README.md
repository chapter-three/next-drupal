# Next.js for Drupal

Next.js + Drupal for **Incremental Static Regeneration** and **Preview mode**.

![Drupal](https://github.com/arshad/next-drupal/workflows/Drupal/badge.svg)

## Table of Contents

- [Demo](#demo)
- [How to run the demo](#how-to-run-the-demo)
- [Screenshots](#screenshots)
- [Next module](#next-module)
  - [Features](#features)
  - [Installation](#installation)
  - [Preview mode](#preview-mode)
- [Next plugin](#next-plugin)
  - [Installation](#installation-1)
  - [Reference](#reference)
    - [getPathsForEntityType](#getpathsforentitytypeentity_type-bundle-options)
    - [getEntitiesFromContext](#getentitiesfromcontextentity_type-bundle-context-options)
    - [getEntityFromContext](#getentityfromcontextentity_type-bundle-context-options)
  - [Preview mode](#preview-mode-1)

## Demo

The following demo sites are built from a single Drupal backend, Next.js for the frontend and styled with [Reflexjs](https://github.com/reflexjs/reflexjs).

- Blog: http://next-example-blog.vercel.app/
- Marketing (with paragaphs): http://next-example-marketing.vercel.app/

## How to run the demo

To access the Drupal site and test the preview mode, you can clone this repository and run the demo sites on your local machine.

1. Clone this repository

`git clone https://github.com/arshad/next-drupal.git`

2. Install dependencies

`yarn && composer install -d ./examples/drupal-site`

3. Copy `.env.example` to `.env.local`:

```
cp examples/example-blog/.env.example examples/example-blog/.env.local
cp examples/example-marketing/.env.example examples/example-marketing/.env.local
```

4. Generate a certificate for localhost (this is required to run your local sites with HTTPS for preview mode)

```
openssl req -x509 -out examples/certificates/localhost.crt -keyout examples/certificates/localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <(\
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

Double-click on the certificate to add it to your keychain.

5. Then run `yarn dev` from the root to start the _Drupal_ site and the _Next.js_ sites.

```
yarn dev
```

6. Login to the _Drupal_ site at http://localhost:8080 with **username: admin** and **password: admin**.

7. Visit http://localhost:8080/admin/config/people/simple_oauth to generate OAuth encryption keys. Enter `../oauth-keys` for the directory.

8. Visit http://localhost:8080/admin/content to add, edit and preview content.

The blog site runs on https://localhost:3030 and the marketing site runs on https://localhost:3000.

## Screenshots

![Publish to multiple sites](https://arshad.io/uploads/next-sites.jpg)

![Entity types configuration](https://arshad.io/uploads/next-entity-types.jpg)

![Preview](https://arshad.io/uploads/next-inline-preview.jpg)

## Next module

The [Next](https://www.drupal.org/project/next) Drupal module is built to handle [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) and [Preview Mode](https://nextjs.org/docs/advanced-features/preview-mode) for your Next.js sites.

### Features

- **Supports Incremental Static Regeneration:** Your content changes are live instantly.
- **Iframe preview:** With site switcher and other preview modes.
- **Multi-sites preview:** Great for _write once, publish everywhere_.
- **Supports revision previews, draft content and content moderation**
- **Extensible via plugins:** Create your own site previewer and resolvers.

### Installation

1. Use [Composer](https://getcomposer.org) to install the Next module. From the root of your Drupal site, run the following command:

```bash
composer require drupal/next
```

2. Visit **Extend** in the Drupal admin.

3. Select the **Next** module and click **Install**.

### Preview Mode

The Next Drupal module, paired with the `next-drupal` plugin, makes it easy to create [Next.js preview routes](https://nextjs.org/docs/advanced-features/preview-mode).

To configure preview mode for an entity type, you must configure a **Next.js site**, a **site resolver** for the entity type and a **OAuth Consumer**.

A _site resolver_ tells Drupal how to resolve the preview URL for an entity. Site resolvers are flexible, can handle multiple sites and work with _entity reference_ fields.

#### 1. Configure a Next.js site

- Visit _/admin/config/services/next_
- Click **Add Next.js site**
- Fill in the required information and click **Save**

#### 2. Configure a site resolver

- Visit _/admin/config/services/next/entity-types_
- Click **Configure entity type**
- Select the entity type from the list
- Select a **Site resolver**
- Click **Save**

If you visit an entity page, you should be able to see the Next.js site preview. See the `next-drupal` plugin for more information on how to configure preview mode on the Next.js site.

#### 3. Configure OAuth Client

To generate preview routes, the Next.js client uses the [Client credentials grant](https://oauth2.thephpleague.com/authorization-server/client-credentials-grant/) for authentication. This is made possible using the (Simple OAuth)[https://www.drupal.org/project/simple_oauth] module.

**Create a Drupal role**

- Create a new Drupal role (example `Next site`) by visiting _/admin/people/roles/add_
- Give the role the following permission:
  - Bypass content access control
  - View all revisions
  - View user information

**Create a user**

Add a new user at _/admin/people/create_ and assign it the role created above.

_Note: When the Next.js is authenticated, it will be authenticated as this user._

**Configure a consumer**

- Visit _/admin/config/people/simple_oauth_
- Click **Generate keys** to generate encryption keys for tokens
- Visit _/admin/config/services/consumer/add_
- Fill in a **Label**, **User** (select the user created above), **Secret** and under **Scopes**, select the role create above
- Click **Save**

_Important: note the client id (uuid) and the secret. This is going to be used as environment variables for the Next.js site._

## Next Plugin

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

## Supporting organizations

[Chapter Three](https://chapterthree.com): Development and support
