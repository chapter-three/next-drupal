# Next.js for Drupal

Next.js + Drupal for Incremental Static Regeneration and Preview mode.

![Drupal](https://github.com/arshad/next-drupal/workflows/Drupal/badge.svg)

## How to run the demo

1. Copy the `.env.example` to `.env.local`:

```
cp examples/example-blog/.env.example examples/example-blog/.env.local
cp examples/example-marketing/.env.example examples/example-marketing/.env.local
```

2. Then run `yarn dev` from the root to start the _Drupal_ site and the _Next.js_ sites.

```
yarn dev
```

3. Login to the _Drupal_ site at http://localhost:8080 with **username: admin** and **password: admin**.

4. Visit http://localhost:8080/admin/config/people/simple_oauth to generate OAuth encryption keys. Enter `../oauth-keys` for the directory.

5. Visit http://localhost:8080/admin/content to add, edit and preview content.
