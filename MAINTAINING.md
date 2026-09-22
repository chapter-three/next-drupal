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

2. Run `yarn sync:modules` to sync the latest commit on `main` with the git repo on drupal.org. All recent changes will be squashed into a commit using the most recent commit message that touched the synced path.

3. On Drupal.org’s GitLab, [tag a release](https://git.drupalcode.org/project/next/-/tags/new) following the [“Release tags naming conventions” docs](https://www.drupal.org/docs/develop/git/git-for-drupal-project-maintainers/release-naming-conventions#release-tags).

4. On Drupal.org’s Next.js project page, [create a release](https://www.drupal.org/node/add/project-release/3192303) using the git tag you just created.

### `next-drupal` (NPM package)

Releases are automated. You do not run `npm publish` or `lerna publish`, and you
do not need an npm token on your machine.

#### How it works

[release-please](https://github.com/googleapis/release-please) reads the
conventional commits merged to `main` and keeps a pull request open titled
something like `chore(main): release next-drupal 2.1.0`. That pull request holds
the version bump and the generated `CHANGELOG.md`. It updates itself as more
commits land.

The commit type decides the version:

- `feat` gives a minor bump (2.0.1 to 2.1.0).
- `fix`, `perf` and similar give a patch bump (2.0.1 to 2.0.2).
- A `BREAKING CHANGE:` footer gives a major bump (2.0.1 to 3.0.0). Add this only
  when you mean it.
- Other types (`chore`, `docs`, `ci`, `test`) do not trigger a release on their
  own.

Merging the release pull request tags the release and publishes to npm.

#### Making a release

1. **Check the release pull request.** Confirm the version is what you expect
   and the changelog reads well. Edit the changelog in the pull request if a
   commit message produced an unhelpful entry.

2. **Merge it.** Squash and merge, like any other pull request. `main` requires
   a review, and the release pull request is authored by a bot, so you can
   approve it yourself.

3. **Watch the `release` workflow.** Merging tags the release and runs the
   publish job.

4. **Confirm.** Check the "Current Tags" section of
   [next-drupal's npm page](https://www.npmjs.com/package/next-drupal?activeTab=versions)
   and confirm `latest` points at the new version.

That is the whole process. There is no local step.

#### Prereleases

To cut a prerelease, add a `Release-As:` footer naming the exact version to a
commit on `main`:

```
Release-As: 2.2.0-alpha.0
```

release-please then proposes that version instead of the one it calculated. The
starters and the Docs sections below still refer to prereleases and to a
`canary` branch; those steps are about their own git repositories and release
notes, not about publishing this package.

#### Publishing credentials

Publishing uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).
The runner mints a short-lived OIDC credential that npm accepts only from
`.github/workflows/release.yml` in this repository. There is no npm token stored
anywhere, so there is nothing to rotate and nothing to leak.

Two consequences worth knowing:

- **Renaming `release.yml` breaks publishing.** npm matches on the workflow
  filename. If you rename or move it, update the trusted publisher entry in the
  package settings on npmjs.com first.
- **Publishing from a laptop will fail**, by design. The package has
  "Require two-factor authentication and disallow tokens" enabled, so token
  authentication is rejected. Release through the pull request.

Because both the repository and the package are public, npm records
[provenance](https://docs.npmjs.com/generating-provenance-statements)
automatically. No flag is needed.

#### Experimental releases from a pull request

To publish a throwaway version from an open pull request, for example so another
project can test a fix before it is released, add the label
`release-pr: next-drupal` to the pull request. The `release-pr` workflow
publishes under the `experimental` dist-tag and comments the install command on
the pull request.

This only works for branches in this repository, not forks.

#### If the release does not happen

- **No release pull request appeared.** Nothing since the last release changed a
  releasable file, or every commit was a type that does not trigger a release.
  Check that the commit touched `packages/next-drupal`.
- **The publish job failed.** Read the job log rather than guessing. If npm
  rejects the credential, the likely cause is that `release.yml` was renamed, or
  the trusted publisher entry on npmjs.com was deleted or recreated.
- **The version is wrong.** The version comes from commit types. To force a
  specific version, use the `Release-As:` footer described under "Prereleases".

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
