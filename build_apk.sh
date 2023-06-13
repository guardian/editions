#!/usr/bin/env bash
# CI script for building and deploying Editions android APK
# to either BETA (beta-android) or RELEASE (release-android)

set -e

if [ "$#" -ne 1 ]
then
  echo "Usage: build_apk.sh [BETA|RELEASE]"
  exit 1
fi

case $1 in
         "BETA")
             TARGET="beta-android"
             ;;
         "RELEASE")
             TARGET="release-android"
             ;;
         *)
             echo "Invalid option '$1' must be either 'BETA' or 'RELEASE'"
             exit 1
             ;;
     esac

npm cache clean -f
npm install -g n
n 16.16
PATH="$PATH"
echo "NEW NODE VERSION"
node --version

npm install -g yarn npx --force
cd projects/Mallard
echo "building APK with command 'make $TARGET'"
make "$TARGET"
