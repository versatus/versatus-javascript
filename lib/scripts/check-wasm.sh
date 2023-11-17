#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Determine the root directory of the Node.js project
# This assumes that the script is located in node_modules/@versatus/versatus-javascript/lib/scripts
# and the dist directory is at the root of the Node.js project
# Dynamically find the root directory of the project
ROOT_DIR=$(dirname "${BASH_SOURCE[0]}")
while [[ $ROOT_DIR != '/' && ! -f "$ROOT_DIR/package.json" ]]; do
    ROOT_DIR=$(dirname "$ROOT_DIR")
done

echo "root directory: $ROOT_DIR"

# Define the path to your WASM file
WASM_PATH="$ROOT_DIR/dist/versa.wasm"
WASM_URL="https://pub-7ab7c88a9a43431382c12cf40b7a6edf.r2.dev/versa-wasm"

# Create the dist directory if it doesn't exist
if [ ! -d "$ROOT_DIR/dist" ]; then
    mkdir -p "$ROOT_DIR/dist"
fi

echo "root directory: $ROOT_DIR"

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
