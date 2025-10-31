#!/bin/bash

# Script to sync packages to read-only git clones
#
# This handles file deletions, additions, and changes seamlessly

set -e # bail on errors

BRANCHES=$1
REPO=$2
GLOB=$3

# Allow BRANCHES to be a comma-seperated list.
BRANCH=$(echo $BRANCHES | cut -d "," -f 1)
TRACKING_BRANCH=$(echo $BRANCHES | cut -d "," -f 2)

BASE=$(pwd)
COMMIT_MESSAGE=$(git log -1 --pretty=%B)

for folder in $GLOB; do
  [ -d "$folder" ] || continue
  cd $BASE

  NAME=${folder##*/}
  CLONE_DIR="__${NAME}__clone__"

  # Note: redirect output to dev/null to avoid any possibility of leaking token
  git clone --quiet --branch ${BRANCH} ${REPO}${NAME}.git $CLONE_DIR > /dev/null
  cd $CLONE_DIR

  # Delete all files (to handle deletions in monorepo)
  find . | grep -v ".git" | grep -v "^\.*$" | xargs rm -rf

  # Copy new files to the clone
  cp -r $BASE/$folder/. .

  if [ -n "$(git status --porcelain)" ]; then
    git add .
    git commit -m "$COMMIT_MESSAGE"
    git push origin ${BRANCH}
  fi

  if [ "$TRACKING_BRANCH" != "$BRANCH" ]; then
    git push origin ${BRANCH}:${TRACKING_BRANCH}
  fi

  cd $BASE
  rm -rf $CLONE_DIR
done
