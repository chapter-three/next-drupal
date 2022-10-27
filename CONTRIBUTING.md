# Contributing

Thanks for your interest in contributing to Next.js for Drupal. We're happy to have you here. 

Please take a moment to review this document before submitting your first pull request.

If you need any help, feel free to reach out on [Drupal Slack](https://drupal.slack.com/archives/C01E36BMU72). Look for _@shadcn_ in the _#nextjs_ channel.

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

### `next-drupal-query`

We use `jest` for testing the `next-drupal-query` package.

```
yarn test packages/next-drupal
```

### `next`

We use `phpunit` for testing the `next` module.

```
yarn test:next
```

## Linting

### `next-drupal` and `next-drupal-query`

```
yarn lint
```

### `next`

```
yarn phpcs
```

Please ensure that the tests are passing when submitting a pull request. If you're adding new features, please include tests.

