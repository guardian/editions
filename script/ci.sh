#!/usr/bin/env bash

echo "start ci script"
set -e
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ROOT_DIR="${DIR}/.."

echo "create directory zipfiles"
mkdir $ROOT_DIR/zipfiles

# Create zip files of the different dist directories
(
  echo "create editions-backend.zip"
  cd "$ROOT_DIR/projects/backend/dist/"
  zip -r "$ROOT_DIR/zipfiles/editions-backend.zip" .
  echo "create editions-archiver.zip"
  cd "$ROOT_DIR/projects/archiver/dist/"
  zip -r "$ROOT_DIR/zipfiles/editions-archiver.zip" .
  echo "finished zipping"
)