#!/bin/bash
# Get us into the project dir
# Some kind of bash mutex so this only runs once?
cd `dirname $0`
cd ..
node ./scripts/watch-html.js
read
