#!/bin/bash

# Exit immediately on errors.
set -e

# Create DDEV project
mkdir local-next-drupal
cd local-next-drupal
ddev config --project-name=local-next-drupal --project-type=drupal10 --php-version=8.3 --docroot=web --create-docroot
ddev start
ddev composer create drupal/recommended-project

# Prevent composer scaffolding from overwriting development.services.yml
ddev composer config --json extra.drupal-scaffold.file-mapping '{"[web-root]/sites/development.services.yml": false}'
ddev composer config minimum-stability dev
ddev composer config allow-plugins.ewcomposer/unpack true -n
# Add repositories
ddev composer config repositories.unpack vcs https://gitlab.ewdev.ca/yonas.legesse/drupal-recipe-unpack.git
ddev composer config repositories.recipe path web/recipes/next_drupal_base

# Add recipies
cp -a ../recipes/. web/recipes

# Add useful composer dependencies
ddev composer require drush/drush drupal/next_drupal_base ewcomposer/unpack:dev-master

# Install Drupal
ddev drush site:install demo_umami --account-name=admin --account-pass=admin -y

# Apply recipe
ddev exec -d /var/www/html/web php core/scripts/drupal recipe recipes/next_drupal_base
ddev composer unpack drupal/next_drupal_base

# use the one-time link (CTRL/CMD + Click) from the command below to edit your admin account details.
ddev drush uli
ddev launch