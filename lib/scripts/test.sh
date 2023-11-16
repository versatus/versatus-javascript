#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "testing wasm build..."

# Define the path to your WebAssembly module
BUILD_WASM_PATH="./dist/build.wasm"
WASM_PATH="./dist/versa.wasm"
WASM_URL="https://pub-7ab7c88a9a43431382c12cf40b7a6edf.r2.dev/versa-wasm"

# Check if the JSON input file path is provided as an argument
if [ -z "$1" ]; then
    echo "Error: No JSON input file path provided."
    exit 1
fi
INPUT_JSON_PATH="$1"

echo "checking if wasm file exists..."
if [ ! -f "$WASM_PATH" ]; then
    echo "WASM file not found. Downloading from $WASM_URL..."
    curl -L -o "$WASM_PATH" "$WASM_URL"
else
    echo "WASM file already exists. Skipping download."
fi

# Ensure the versa-wasm binary is executable
chmod +x "$WASM_PATH"

# Run the test using versa-wasm and pipe the output through jq
./dist/versa.wasm execute --wasm "$BUILD_WASM_PATH" --json "$INPUT_JSON_PATH" | jq

# Echo a success message
echo "Tests completed successfully."
