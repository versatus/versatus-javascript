#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

#VERSA_WASM_VERSION="v1.0.0"

source ./lib/scripts/colored_echo.sh

# Use the current working directory as the root directory
ROOT_DIR=$(pwd)
WASM_PATH="$ROOT_DIR/build/versa.wasm"
#WASM_URL="https://github.com/versatus/test-versatus-release-actions/releases/download/${VERSA_WASM_VERSION}/versa-wasm"
WASM_URL="https://pub-7ab7c88a9a43431382c12cf40b7a6edf.r2.dev/versa-wasm" # OSX M2

# Create the dist directory if it doesn't exist
if [ ! -d "$ROOT_DIR/dist" ]; then
    mkdir -p "$ROOT_DIR/dist"
fi

# Check if the WASM file exists and download it if it does not
print_info "Checking if WASM file exists..."
if [ ! -f "$WASM_PATH" ]; then
    print_warning "\033[0;31mWASM file not found. Downloading from $WASM_URL..."
    curl -sS -L -o "$WASM_PATH" "$WASM_URL"
else
    print_success "WASM file already exists. Skipping download."
fi

# Make the WASM file executable
chmod +x "$WASM_PATH"
