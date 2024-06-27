# Contributing

Thanks for your interest in contributing to Next.js for Drupal. We're happy to have you here.

Please take a moment to review this document before submitting your first pull request.

If you need any help, feel free to reach out on [Drupal Slack](https://drupal.slack.com/archives/C01E36BMU72). Look for us in the _#nextjs_ channel.

## About this repository

This repository is a monorepo. This is where we develop all modules, packages and starters.

- We use [Yarn](https://yarnpkg.com) and `yarn workspaces` for development.
- We use [Turborepo](https://turborepo.org) as our build system.
- We use [Lerna](https://lerna.js.org) for versioning and publishing.

## Development Workflow

### Start by cloning the repository:

```
git clone git@github.com:chapter-three/next-drupal.git
```

### Install dependencies

```
yarn install
```

### Run a workspace

You can use the `yarn workspace [WORKSPACE]` command to start the development process for a workspace.

#### Examples

1. To run the `next-drupal.org` website:

```
yarn workspace www dev
```

2. To run the `next-drupal` package:

```
yarn workspace next-drupal dev
```

## Testing

You can run all the tests from the root of the repository.

### `next-drupal`

We use `jest` for testing the `next-drupal` package.

```
yarn test packages/next-drupal
```

### `next`

We use `phpunit` for testing the `next` module.

```
yarn test:next
```

## Linting

### `next-drupal`

```
yarn lint
```

### `next`

```
yarn phpcs
```

Please ensure that the tests are passing when submitting a pull request. If you're adding new features, please include tests.

## Commits

This project uses git commit messages that follow the [Conventional Commits format](https://www.conventionalcommits.org/en/v1.0.0/). A minor change to your commit message style can:

- make you a better programmer
- helps to automate the CHANGELOG generated for other developers

Don’t worry. You can still submit a Pull Request and if you don’t properly use semantic commit messages, we will edit the commits to add them. But we like them, so you might too.

### Format of the commit message:

```
<type>(<scope>)<!>: <subject>

<body>

<footer>
```

### Example commit message

```
feat(next-drupual): add support for Next.js 13 and React 18

Next-drupal now requires Next.js 12 or 13 and React 17 or 18.

BREAKING CHANGE:
Dropped support for Next.js 11 and React 16.

Fixes #371
```

### Commit first line — `<type>(<scope>)!: <subject>`

The first line includes a brief description of the change in the `<subject>` after the semicolon. The type and scope should always be lowercase as shown below.

#### Allowed `<type>` values:

- ✨ `feat` A new feature
- 🐛 `fix` A bug fix
- 📚 `docs` Documentation only changes
- 💎 `style` Code formatting changes (like missing semicolons, etc.) that do not affect the meaning of the code
- 📦 `refactor` A code change that neither fixes a bug nor adds a feature
- 🚀 `perf` A code change that improves performance
- 🚨 `test` Adding missing tests or correcting existing tests
- 🛠 `build` Changes that affect the build system or external dependencies (example scopes: lerna, yarn)
- ⚙️ `ci` Changes to our CI configuration files and scripts
- ♻️ `chore` Other changes that don't modify src or test files
- 🗑 `revert` Reverts a previous commit

#### Example `(<scope>)` values:

To include the change in a specific package of this monorepo, the scope should be the name of the folder inside:

- `/packages/*`
- `/modules/*`
- `/examples/*`

For example:

- `next-drupal` For changes in `/packages/next-drupal`
- `next` For changes in `/modules/next`
- `basic-starter` For changes in `/starters/basic-starter`
- `example-auth` For changes in `/examples/example-auth`

The `<scope>` can be empty (e.g. if the change is a global or difficult to assign to a single component), in which case the parentheses are omitted and the first line just becomes: `<type>: <subject>`

The `<!>` is optional. It should be used for a BREAKING CHANGE. For example, `fix(widgets)!: Fix incompatibility with widget v2` indicates the bugfix required a breaking change. Note that the "BREAKING CHANGE:" FOOTER is REQUIRED (see below).

### Commit message `<body>`

The `<body>` is optional. Just as in the `<subject>`, use the imperative, present tense: "change" not "changed" nor "changes". Message body should include motivation for the change and contrasts with previous behavior.

### Commit message `<footer>`

The commit message footer can have multiple paragraphs in it.

#### Referencing issues

Closed issues should be listed on a separate line in the footer prefixed with "Fixes" keyword like this:

```
Fixes #234
```

or in the case of multiple issues:

```
Fixes #123, #245, #992
```

#### Breaking changes

All breaking changes have to be mentioned in footer with the description of the change, justification and migration notes.

```
BREAKING CHANGE:

Dropped support for Next.js 11 and React 16. Users
requiring these older versions should stick to v1.6.
```

## Local Drupal Environment (Experimental)

Requires [DDEV](https://ddev.readthedocs.io/en/latest/users/install/ddev-installation/)

Create a local instance by running:

```
yarn ddev:init
```

This will create a local Drupal instance in local-next-drupal which will be ignored by git.

Destroy the local instance by running:

```
yarn ddev:destroy
```

To use this environment with local testing, add the following to the related
.env file:

```
DRUPAL_BASE_URL="http://local-next-drupal.ddev.site/"
DRUPAL_CLIENT_ID="next-drupal"
DRUPAL_CLIENT_SECRET="next"
```

### Todo

- Update recipe to use local versions of next drupal composer dependencies rather than packagist versions.
