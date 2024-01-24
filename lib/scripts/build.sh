#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$DIR/colored_echo.sh"

source ./lib/scripts/colored_echo.sh

print_info "building js w/ webpack"
npx webpack --config ./lib/webpack.config.cjs

print_info "building wasm with javy"
javy compile dist/bundle.js -o dist/build.wasm

print_success "build completed successfully."
