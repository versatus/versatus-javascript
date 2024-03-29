#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Variables
# VERSA_WASM_VERSION="v1.0.0"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$DIR/colored_echo.sh"
ROOT_DIR=$(pwd)

LASR_CLI_PATH="$ROOT_DIR/build/lasr_cli"
LASR_CLI_URL="https://pub-7ab7c88a9a43431382c12cf40b7a6edf.r2.dev/lasr_cli" # OSX M2

# Create the build directory if it doesn't exist
if [ ! -d "$ROOT_DIR/build" ]; then
    mkdir -p "$ROOT_DIR/build"
fi

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
