# Maintenance guide

This document is for maintainers to explain the various procedures for all the projects in this monorepo.

## Making releases

### `next` (Drupal Module)

The `next-drupal` package is published from a GitHub release, and starters and examples are tagged by hand. Releases for Drupal modules are different again: they are controlled by drupal.org’s infrastructure, so none of that applies here.

1. Optionally, create a new branch on drupal.org.

   1. Follow the “Release branches” rules described on the [“Release naming conventions” documentation](https://www.drupal.org/docs/develop/git/git-for-drupal-project-maintainers/release-naming-conventions).
   2. On Drupal.org’s GitLab, [create a new branch](https://git.drupalcode.org/project/next/-/tags/new).
   3. In the monorepo’s `package.json`, update the `sync:modules` script to use the new branch name. The monorepo’s `main` branch will then sync with this new drupal.org branch.

      For example, change:

      ```
      "sync:modules": "./scripts/sync-repo.sh 2.x git@git.drupal.org:project/ \"modules/*\"",
      ```

      to:

      ```
      "sync:modules": "./scripts/sync-repo.sh 3.x git@git.drupal.org:project/ \"modules/*\"",
      ```

2. Run `yarn sync:modules` to sync the latest commit on `main` with the git repo on drupal.org. All recent changes will be squashed into a commit using the most recent commit message that touched the synced path.

3. On Drupal.org’s GitLab, [tag a release](https://git.drupalcode.org/project/next/-/tags/new) following the [“Release tags naming conventions” docs](https://www.drupal.org/docs/develop/git/git-for-drupal-project-maintainers/release-naming-conventions#release-tags).

4. On Drupal.org’s Next.js project page, [create a release](https://www.drupal.org/node/add/project-release/3192303) using the git tag you just created.

### `next-drupal` (NPM package)

Publishing a GitHub release publishes the package to npm. The
[`publish` workflow](.github/workflows/publish.yml) builds the commit the release
tag points at, and npm records
[provenance](https://docs.npmjs.com/generating-provenance-statements) for it.
Do not run `npm publish` from your machine; a laptop publish has no provenance.

1. **Bump the version.** In a normal pull request, change `version` in
   `packages/next-drupal/package.json` and add an entry at the top of
   `packages/next-drupal/CHANGELOG.md`. Merge it.
2. **Create the release.** On GitHub, go to Releases → "Draft a new release".
   Set the target to `main` and create a tag named `next-drupal@<version>`, for
   example `next-drupal@2.1.0`. Click "Publish release".
3. **Get it approved.** The `publish` workflow starts and waits for approval on
   the `release` environment. Ask someone else in the `developers` team to
   approve it. Before approving, the reviewer opens the run and checks its
   commit:
   - If the commit is on `main`, approve.
   - If it is not, compare the branch with `main` and read the whole diff,
     especially anything under `.github/` and the `scripts` in any
     `package.json`. The run uses the workflow file from that commit, so a
     branch can change what gets published and to which dist-tag, whatever
     its version says. Approve only if you would approve that diff as a pull
     request, and do not approve a branch whose changes you wrote.
4. **Check npm.** Confirm the version on
   [next-drupal's npm page](https://www.npmjs.com/package/next-drupal?activeTab=versions).

The version decides the dist-tag. A version with a prerelease part, such as
`2.2.0-canary.0`, goes to `canary`; anything else goes to `latest`. The workflow
fails if the tag name does not match the version in `package.json`.

To test a branch, publish a canary from it: set a canary version on the branch,
and in step 2 set the target to that branch and tick "Set as a pre-release", so
GitHub does not show the canary as the latest release. The reviewer then reads
the branch's diff, as in step 3. npm never reuses a version number, so each
canary needs a new one (`2.2.0-canary.1`, and so on).

If the workflow fails, read its log. For a temporary problem such as an npm
outage, use "Re-run jobs". If the release itself was wrong, first reject its
run if it is still waiting for approval, since deleting the release does not
cancel it. Then fix the problem, delete the GitHub release and its tag, and
create them again. If npm says the version already exists, that version is
already on npm and cannot be published again. Bump to a new version and release
again.

#### Settings outside this repository

Publishing uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/),
so there is no npm token to store or rotate. Two settings outside this
repository make it work:

- **npm**: the package's Settings has one trusted publisher entry: repository
  `chapter-three/next-drupal`, workflow `publish.yml`, environment `release`,
  with "npm publish" among its allowed actions.
- **GitHub**: the repository has an environment named `release`. Its deployment
  rule allows tags matching `next-drupal@*`, and it requires a reviewer from the
  `developers` team, with "Prevent self-review" on.

npm matches on the workflow filename and the environment name. If you rename
either one, update the npm entry to match.

### Examples

The code in the examples repos do not strictly require a versioned release since they simply contain an example usage of the latest `next-drupal` release. However, each example has its own separate git repo so developers can see previous versions of the latest example.

1. Optionally, **create a tag** that is Lerna-compatible matching the format: `[project]@[version]`, e.g. `example-auth@1.1.2`

   ```
   git tag example-NAME@1.0.0
   git push --tags
   ```

2. **Sync git repositories** with:

   ```
   yarn sync:examples
   ```

   All recent changes on `main` will be squashed into a commit on the target git repo using the most recent commit message that touched the synced path.

### Starters

1. **Update package.json** with the new release version for that starter, e.g. `2.0.0-alpha.0`. This is important so the developer knows which version of the starter they had when they first started their project.

2. **Create a tag** that is Lerna-compatible matching the format: `[project]@[version]`, e.g. `basic-starter@2.0.0-alpha.0`

   ```
   git tag NAME-starter@2.0.0
   git push --tags
   ```

3. **Sync git repositories**

   If the release is a prerelease, sync the monorepo with:

   ```
   yarn sync:starters
   ```

   If the release is not a prerelease, sync the monorepo with:

   ```
   yarn sync:starters:release
   ```

   All recent changes on `main` will be squashed into a commit on the target git repo using the most recent commit message that touched the synced path.

4. **Create a GitHub release and tag**

   The git tag created in step 1 was for the monorepo; it doesn’t exist in the starters’ git repos. We’ll create a GitHub release to make it easier for developers to see the changes between different versions of the starter.

   To create a GitHub release, go to the releases page for:

   - [basic-starter](https://github.com/chapter-three/next-drupal-basic-starter/releases)
   - [graphql-starter](https://github.com/chapter-three/next-drupal-graphql-starter/releases)
   - [pages-starter](https://github.com/chapter-three/next-drupal-pages-starter/releases)

   And then:

   1. Click the “Draft a new release” button.
   2. In the **“Target:” drop-down**, select the `main` branch if this is going to be a normal release or select the `canary` branch if this is going to be a prerelease.
   3. In the **“Choose a tag” widget**, type the new git tag, e.g. `2.0.0-alpha.0`, and hit `enter`. The help text will say “Excellent! This tag will be created from the target when you publish this release.”
   4. In the “Release title” text field, type the same tag as the previous step.
   5. Check either the “Set as a pre-release” checkbox or the “Set as the latest release” checkbox.
   6. Click the “Publish release” button.

### Docs

@TODO: Expand details the next time docs are deployed.

Documentation is deployed to Vercel and controlled via the following Git branches:

- `v1.6`
- `v1`
- `v0`

## Tests

The Jest tests currently rely on a Drupal 9.4 installation deployed to [tests.next-drupal.org](https://tests.next-drupal.org) on Pantheon.

Developers will need a copy of the db, a copy of the installation files, and to set the following environment variables when running tests locally:

```dotenv
export DRUPAL_BASE_URL='https://tests.next-drupal.org'
export DRUPAL_CLIENT_ID='example-xxxx'
export DRUPAL_CLIENT_SECRET='example-xxxx'
export DRUPAL_USERNAME='Umami'
export DRUPAL_PASSWORD='example-xxxx'
```

The files, db and environment variable values can be obtained from other Chapter Three developers.

@TODO: Replace the live server with a way to install Drupal with the needed demo content and config. The updated docs should not be here, but instead in CONTRIBUTING.md.

## Drupal (`/drupal` directory)

This is probably a single Drupal install with the config for all the examples and is used for running Cypress tests.

@TODO Confirm speculation by getting a copy of the database so `/drupal` can be run locally.
