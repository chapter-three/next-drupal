# Maintenance guide

This document is for maintainers to explain the various procedures for all the projects in this monorepo.

## Making releases

### Modules

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

### Packages, Starters and Examples

Starters and Examples are NOT published to NPM. But they do depend on the **packages** that _are_ published to [NPM](https://www.npmjs.com/package/next-drupal). So when we create a new `next-drupal` release, the starters and examples will depend on that new release and Lerna will add new tags for those projects too.

1. **Tag a new release**

   Use lerna’s `version` command. We’ll be using the `--no-push` flag so that Lerna does not push git tags and commits automatically. This allows us to delete any commits and tags locally if we make a mistake.

   - **to make the next logical semantic version**, run:

     ```
     npx lerna version --no-push
     ```

     Since we are using semantic commits, Lerna is able to read the git commits since the last release to auto-generate a CHANGELOG and to determine if the next release should be a:

     - major version bump (e.g. 1.0.0 to 2.0.0). This will happen when Lerna finds a `BREAKING CHANGE` commit message.
     - minor version bump (e.g. 1.0.0 to 1.1.0). This will happen when Lerna finds a `feat` commit message.
     - patch version bump (e.g. 1.0.0 to 1.0.1). This is the default version bump for bug fixes, etc.
     - prerelease version bump (e.g. 1.0.0-alpha.0 to 1.0.0-alpha.1)

   - **to make a new alpha prerelease version:**

     If the current version is not a prerelease version, you’ll need to explicitly tell Lerna that the next version should be an alpha release with:

     ```
     npx lerna version --conventional-prerelease --no-push
     ```

     When creating a new prerelease version of `next-drupal`, Lerna will automatically determine if it needs to be a `premajor` (2.0.0-alpha.0), `preminor` (1.1.0-alpha.0), or `prepatch` (1.0.1-alpha.0) version.

     All the example and starter packages that depend on `next-drupal` will also get a prerelease version. Note that Lerna may give a `premajor` bump to `next-drupal` but only a `prepatch` bump to other packages. If you want all the packages to have the same type of version bump, you’ll need to first create a git commit modifying files in those packages with a commit message containing a `BREAKING CHANGE` footer (major) or a `feat` type prefix (minor).

     For example:

     ```
     > npx lerna version --conventional-prerelease --no-push

     Changes:
      - example-umami: 1.2.0 => 1.2.1-alpha.0 (private)
      - next-drupal: 1.6.0 => 2.0.0-alpha.0
      - basic-starter: 1.8.0 => 1.9.0-alpha.0 (private)

     ? Are you sure you want to create these versions? No

     # Developer modifies files in example-umami and basic-starter.

     > git commit -m 'feat!: bump major version' -m 'BREAKING CHANGE:' -m 'depend on alpha version of next-drupal'

     > npx lerna version --conventional-prerelease --no-push

     Changes:
      - example-umami: 1.2.0 => 2.0.0-alpha.0 (private)
      - next-drupal: 1.6.0 => 2.0.0-alpha.0
      - basic-starter: 1.8.0 => 2.0.0-alpha.0 (private)

     ? Are you sure you want to create these versions? Yes
     ```

     See [git commit 8761181](https://github.com/chapter-three/next-drupal/commit/8761181041daa6ec8765c19e030f299a7a9f2958) for an example of a commit that forces a `premajor` bump on examples and starters.

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

3. **Publish** with:

   ```
   npx lerna publish from-git
   ```

   Maintainers will need permission to publish to `next-drupal` on npmjs.com. http://npmjs.com/package/next-drupal

4. **Sync git repositories**
   If the release is a prerelease, do not sync the monorepo with the `main` branch of the example and starter git repos. The `main` branch of the starters should always be the latest official release. If you sync a prerelease version, users will not be able to use the last stable release of the starters.

   1. Sync the examples with:
      ```
      yarn sync:examples
      ```
   2. Sync the starters with:
      ```
      yarn sync:starters
      ```

   All recent changes on `main` will be squashed into a commit on the target git repo using the latest commit message.

For more information, see Lerna’s [version docs](https://github.com/lerna/lerna/tree/main/libs/commands/version) and [publish docs](https://github.com/lerna/lerna/tree/main/libs/commands/publish).

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
