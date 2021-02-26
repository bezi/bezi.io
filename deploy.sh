# /usr/bin/env bash
# Abort on error
set -e

git fetch
git reset origin/master --hard

yarn install && yarn run build
