#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Variables
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$DIR/colored_echo.sh"
ROOT_DIR=$(pwd)

BUILD_DIR="$ROOT_DIR/build"
LASR_CLI_BASE_URL="https://pub-7ab7c88a9a43431382c12cf40b7a6edf.r2.dev"

# Determine architecture
ARCH=$(uname -m)
case $ARCH in
    x86_64)
        ARCH="x86_64"
        LASR_CLI_URL="$LASR_CLI_BASE_URL/lasr_cli_x86_64"
        ;;
    arm64)
        ARCH="arm64"
        LASR_CLI_URL="$LASR_CLI_BASE_URL/lasr_cli_arm64"
        ;;
    *)
        print_error "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

# Create the build directory if it doesn't exist
if [ ! -d "$BUILD_DIR" ]; then
    mkdir -p "$BUILD_DIR"
fi

LASR_CLI_PATH="$BUILD_DIR/lasr_cli"

# Check if the CLI exists and download it if it does not
print_light_gray "Checking if LASR CLI for $ARCH exists..."
if [ ! -f "$LASR_CLI_PATH" ]; then
    print_warning "LASR CLI for $ARCH not found. Downloading from $LASR_CLI_URL..."
    # Use curl with a progress bar
    curl -L -o "$LASR_CLI_PATH" "$LASR_CLI_URL" -#
else
    print_success "LASR CLI for $ARCH already exists. Skipping download."
fi

# Make the CLI file executable
chmod +x "$LASR_CLI_PATH"
