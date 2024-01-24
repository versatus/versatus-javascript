#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Run system checks first
./lib/scripts/sys-check.sh

source ./lib/scripts/colored_echo.sh

print_info "building js w/ webpack"
npx webpack --config ./lib/webpack.config.cjs

print_info "building wasm with javy"
javy compile dist/bundle.js -o dist/build.wasm

print_success "build completed successfully."
