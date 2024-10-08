#!/bin/bash

# Exit immediately on errors.
set -e

# Pre-seed local env files
cp scripts/config/.env.local starters/basic-starter
cp scripts/config/.env.local starters/pages-starter

# Create DDEV project
mkdir local-next-drupal
cd local-next-drupal
ddev config --project-name=local-next-drupal --project-type=drupal --php-version=8.3 --docroot=web
ddev start
ddev composer create drupal/recommended-project

# Prevent composer scaffolding from overwriting development.services.yml
ddev composer config --json extra.drupal-scaffold.file-mapping '{"[web-root]/sites/development.services.yml": false}'
ddev composer config minimum-stability dev
ddev composer config allow-plugins.ewcomposer/unpack true -n
ddev composer config allow-plugins.tbachert/spi true -n

# Add repositories
ddev composer config repositories.unpack vcs https://gitlab.ewdev.ca/yonas.legesse/drupal-recipe-unpack.git
ddev composer config repositories.recipe path web/recipes/next_drupal_base
ddev composer config repositories.next path modules/next

# Add configuration scripts to run after install
mkdir scripts
cp ../scripts/config/consumers.php scripts/consumers.php

# Use the local repo version of the next module
# ideally this would be a symlink.
cp -a ../modules/. modules

# Add recipies
cp -a ../recipes/. web/recipes

# Add useful composer dependencies
ddev composer require drush/drush drupal/next_drupal_base drupal/devel drupal/core-dev ewcomposer/unpack:dev-master

# Install Drupal
ddev drush site:install --account-name=admin --account-pass=admin -y

# Apply recipe
ddev exec -d /var/www/html/web php core/scripts/drupal recipe recipes/next_drupal_base
ddev composer unpack drupal/next_drupal_base

# Create example consumer
ddev drush php:script scripts/consumers

# Generate content
ddev drush pm:enable devel_generate -y
ddev drush genc 25

ddev drush cr

# use the one-time link (CTRL/CMD + Click) from the command below to edit your admin account details.
ddev drush uli | xargs open