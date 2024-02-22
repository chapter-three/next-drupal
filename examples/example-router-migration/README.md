# example-router-migration

Next.js recommends using their new App Router over the legacy Pages Router. The [full router migration guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration) is available in the Next.js documentation.

The new App Router is also designed to facilitate sites that need to migrate from the Pages Router in a piecemeal fashion rather than all at once.

This codebase is an example of a `next-drupal` site that is in the middle of a Next.js Pages to App Router migration.

## Piecemeal router migration steps

### Initial migration

1. Update the `next-drupal` package to the latest 2.x version.
2. Update the `next` module on your Drupal site to the latest 2.x version.
   1. The most recent version is available at https://www.drupal.org/project/next
   2. Run your Drupal site’s /update.php script.
3. Migrate from Preview Mode to Draft mode. Preview mode only works with the legacy Pages Router. Draft mode works with both routers.
   1. Update the `/pages/api/preview.ts` file to match the one in this Git repo.
   2. Update the `/pages/api/exit-preview.ts` file to match the one in this Git repo.
   3. Delete your `/pages/api/revalidate.ts` file.
   4. Create a `/app/api` directory and add all the files from this Git repo’s `/app/api` directory.

### Piecemeal migration

Follow [Next.js’ router migration guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration).

Over time, you will be moving all the files from `/pages` to `/app`. However, these JavaScript files should remain in the `/pages` directory to prevent Preview/Draft Mode from breaking:

- `/pages/api/exit-preview.ts`
- `/pages/api/preview.ts`

### Final migration steps

1. Turn off the legacy Preview Mode.
   1. Go to the Next.js site configuration on your Drupal site at `/admin/config/services/next`.
   2. For each Next.js configuration, change the end of the URL in the “Draft URL (or Preview URL)” setting from `preview` to `draft`, e.g. `https://example.com/api/preview` to `https://example.com/api/draft`.
2. Delete the last files in your `/pages` directory:
   - `/pages/api/exit-preview.ts`
   - `/pages/api/preview.ts`

## License

Licensed under the [MIT license](https://github.com/chapter-three/next-drupal/blob/master/LICENSE).
