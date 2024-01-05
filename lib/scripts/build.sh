#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Run system checks first
./lib/scripts/sys-check.sh

echo "building js w/ webpack"
npx webpack --config ./lib/webpack.config.cjs

echo "building wasm with javy"
javy compile build/bundle.js -o build/build.wasm

echo "build completed successfully."
