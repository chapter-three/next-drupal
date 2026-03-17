#!/bin/bash

# Exit immediately on errors.
set -e

cd local-next-drupal
ddev delete -y
cd ..
echo "Removing drupal directory..."
rm -rf local-next-drupal
