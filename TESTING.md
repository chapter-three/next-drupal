# Testing

## next-drupal

To run the tests for `next-drupal`, run:

```
yarn test
```

## Next module

Tests for the `next` module use PHPUnit. To run the tests:

1. Run `composer install` inside the `/drupal` directory.
2. Then run `yarn test:next` from the root of the repo to run the PHPUnit tests.

Note: We have a CI for running these tests on GitHub Actions.

## End-to-end tests

We use Cypress to run end-to-end tests for the examples.

_You will need a copy of the database and files on your local machine to run the tests. These are not tracked in this repo. You can reached out to [@shadcn](https://twitter.com/shadcn) to get you a copy._

_TODO: Add a test profile that builds the Drupal site from config with demo content._

To run the tests:

1. Setup the Drupal site with the database and files.
2. Run `yarn` from the root of the monorepo to install dependencies.
3. Then run `yarn test:e2e:ci` to run the tests.
