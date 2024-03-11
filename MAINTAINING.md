# Maintenance guide

This document is for maintainers to explain the various procedures for all the projects in this monorepo.

## Making releases

### `next` (Drupal Module)

While maintaining releases for packages, starters and examples is done with Lerna, releases for Drupal modules are controlled by drupal.org’s infrastructure, so these steps don’t involve Lerna.

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

2. Run `yarn sync:modules` to sync the latest commit on `main` with the git repo on drupal.org. All recent changes will be squashed into a commit using the latest commit message.

3. On Drupal.org’s GitLab, [tag a release](https://git.drupalcode.org/project/next/-/tags/new) following the [“Release tags naming conventions” docs](https://www.drupal.org/docs/develop/git/git-for-drupal-project-maintainers/release-naming-conventions#release-tags).

4. On Drupal.org’s Next.js project page, [create a release](https://www.drupal.org/node/add/project-release/3192303) using the git tag you just created.

### `next-drupal` (NPM package)

Since we are using semantic commits, Lerna is able to read the git commits since the last release to auto-generate a CHANGELOG and to determine if the next release should be a:

- major version bump (e.g. 1.0.0 to 2.0.0). This will happen when Lerna finds a `BREAKING CHANGE` commit message.
- minor version bump (e.g. 1.0.0 to 1.1.0). This will happen when Lerna finds a `feat` commit message.
- patch version bump (e.g. 1.0.0 to 1.0.1). This is the default version bump for bug fixes, etc.
- prerelease version bump (e.g. 1.0.0-alpha.0 to 1.0.0-alpha.1)

We’ll be using Lerna’s `--no-push` flag so that Lerna does not push git tags and commits automatically. This allows us to delete any commits and tags locally if we make a mistake.

1. **Tag a new release**

   - **to make the next logical semantic version**, run:

     ```
     npx lerna version --no-push
     ```

   - **to make a new alpha prerelease version:**

     If the current version is not a prerelease version, you’ll need to explicitly tell Lerna that the next version should be an alpha release with:

     ```
     npx lerna version --conventional-prerelease --no-push
     ```

     When creating a new prerelease version of `next-drupal`, Lerna will automatically determine if it needs to be a `premajor` (2.0.0-alpha.0), `preminor` (1.1.0-alpha.0), or `prepatch` (1.0.1-alpha.0) version.

   - **to make a new beta prerelease version:**

     If the current version is not a beta version, you’ll need to explicitly tell Lerna that the next version should be a beta release with:

     ```
     npx lerna version --conventional-prerelease --preid beta --no-push
     ```

   - **to make a new regular version from a prerelease version:**

     If the current version is a prerelease version, you’ll need to explicitly tell Lerna that the next version should no longer be a prerelease version with:

     ```
     npx lerna version --conventional-graduate --no-push
     ```

   **Confirm changes**

   When Lerna asks “Are you sure you want to create these versions?”, carefully check if the versions listed are the ones you expect.

2. **Push git changes** with:

   ```
   git push
   git push --tags
   ```

3. **Publish the release**

   Ensure you have authenticated with npmjs.com using `npm login`.

   Then, while your local git working area is clean of changes and `HEAD` is pointing to the commit created in step 1, have Lerna build, prepare, package and publish your release.

   For a new prerelease version, specify the `canary` dist-tag with:

   ```
   npx lerna publish --dist-tag canary from-git
   ```

   Otherwise, use:

   ```
   npx lerna publish from-git
   ```

   Maintainers will need permission to publish to `next-drupal` on npmjs.com. http://npmjs.com/package/next-drupal

4. **Confirm the release**

   Look at the “Current Tags” section of [next-drupal’s npmjs page](https://www.npmjs.com/package/next-drupal?activeTab=versions) and confirm that the newest release is listed and that the `latest` tag and the `canary` tag point at the expected versions.

For more information, see Lerna’s [version docs](https://github.com/lerna/lerna/tree/main/libs/commands/version) and [publish docs](https://github.com/lerna/lerna/tree/main/libs/commands/publish).

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

   All recent changes on `main` will be squashed into a commit on the target git repo using the latest commit message.

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

   All recent changes on `main` will be squashed into a commit on the target git repo using the latest commit message.

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
