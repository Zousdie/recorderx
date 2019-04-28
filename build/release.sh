#!/bin/bash

set -e

git checkout dev

git pull

git checkout master

git pull

git merge dev

echo "Enter release version: "

read VERSION

VERSION=`npm version $VERSION --no-git-tag-version`

echo "release version: "$VERSION

git add .

git commit -m "release: $VERSION"

npm publish

git tag "$VERSION"

git push

git push origin --tags

npm run gh

git checkout dev

git rebase master

git push
