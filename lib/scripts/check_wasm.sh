#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Variables
# VERSA_WASM_VERSION="v1.0.0"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$DIR/colored_echo.sh"
ROOT_DIR=$(pwd)

WASM_PATH="$ROOT_DIR/build/versatus-wasm"
# WASM_URL="https://github.com/versatus/test-versatus-release-actions/releases/download/${VERSA_WASM_VERSION}/versa-wasm"
WASM_URL="https://pub-7ab7c88a9a43431382c12cf40b7a6edf.r2.dev/versatus-wasm" # OSX M2

LASR_CLI_PATH="$ROOT_DIR/build/cli"
LASR_CLI_URL="https://pub-7ab7c88a9a43431382c12cf40b7a6edf.r2.dev/cli" # OSX M2

# Create the build directory if it doesn't exist
if [ ! -d "$ROOT_DIR/build" ]; then
    mkdir -p "$ROOT_DIR/build"
fi

# Check if the WASM file exists and download it if it does not
print_light_gray "Checking if WASM runtime exists..."
if [ ! -f "$WASM_PATH" ]; then
    print_warning "WASM runtime not found. Downloading from $WASM_URL..."
    # Use curl with a progress bar
    curl -L -o "$WASM_PATH" "$WASM_URL" -#
else
    print_success "WASM runtime already exists. Skipping download."
fi

# Make the WASM file executable
chmod +x "$WASM_PATH"

# Check if the WASM file exists and download it if it does not
print_light_gray "Checking if LASR CLI exists..."
if [ ! -f "$LASR_CLI_PATH" ]; then
    print_warning "LASR CLI not found. Downloading from $LASR_CLI_URL..."
    # Use curl with a progress bar
    curl -L -o "$LASR_CLI_PATH" "$LASR_CLI_URL" -#
else
    print_success "LASR CLI already exists. Skipping download."
fi

# Make the WASM file executable
chmod +x "$LASR_CLI_PATH"
