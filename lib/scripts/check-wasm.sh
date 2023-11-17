#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define the path to the WASM file and the URL from where it can be downloaded
WASM_PATH="./dist/versa.wasm"
WASM_URL="https://pub-7ab7c88a9a43431382c12cf40b7a6edf.r2.dev/versa-wasm"

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
