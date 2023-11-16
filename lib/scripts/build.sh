#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Run system checks first
./node_modules/@versatus/versatus-javascript/lib/scripts/sys_check.sh

echo "building js w/ webpack"
npx webpack --config ./node_modules/@versatus/versatus-javascript/lib/webpack.config.cjs

echo "building wasm with javy"
javy compile dist/bundle.js -o dist/build.wasm

echo "build completed successfully."
