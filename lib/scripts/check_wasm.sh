#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

VERSA_WASM_VERSION="v1.0.0"

# Use the current working directory as the root directory
ROOT_DIR=$(pwd)
WASM_PATH="$ROOT_DIR/dist/versa.wasm"
WASM_URL="https://github.com/versatus/test-versatus-release-actions/releases/download/${VERSA_WASM_VERSION}/versa-wasm"

# Create the dist directory if it doesn't exist
if [ ! -d "$ROOT_DIR/dist" ]; then
    mkdir -p "$ROOT_DIR/dist"
fi

# Check if the WASM file exists and download it if it does not
echo -e "\033[0;33mChecking if WASM file exists...\033[0m"
if [ ! -f "$WASM_PATH" ]; then
    echo -e "\033[0;31mWASM file not found. Downloading from $WASM_URL...\033[0m"
    curl -sS -L -o "$WASM_PATH" "$WASM_URL"
else
    echo -e "\033[0;34mWASM file already exists. Skipping download.\033[0m"
fi

# Make the WASM file executable
chmod +x "$WASM_PATH"
