#!/bin/bash

# Set the desired Javy version
JAVY_VERSION="v1.2.0"

# Determine the operating system and architecture
OS=$(uname -s)
ARCH=$(uname -m)

# Set download URL based on the operating system and architecture
URL=""
if [ "$OS" = "Darwin" ]; then
    if [ "$ARCH" = "x86_64" ]; then
        URL="https://github.com/bytecodealliance/javy/releases/download/${JAVY_VERSION}/javy-x86_64-macos-${JAVY_VERSION}.gz"
    elif [ "$ARCH" = "arm64" ]; then
        URL="https://github.com/bytecodealliance/javy/releases/download/${JAVY_VERSION}/javy-arm-macos-${JAVY_VERSION}.gz"
    else
        echo "Unsupported macOS architecture: $ARCH"
        exit 1
    fi
elif [ "$OS" = "Linux" ]; then
    if [ "$ARCH" = "x86_64" ]; then
        URL="https://github.com/bytecodealliance/javy/releases/download/${JAVY_VERSION}/javy-x86_64-linux-${JAVY_VERSION}.gz"
    elif [ "$ARCH" = "aarch64" ]; then
        URL="https://github.com/bytecodealliance/javy/releases/download/${JAVY_VERSION}/javy-arm-linux-${JAVY_VERSION}.gz"
    else
        echo "Unsupported Linux architecture: $ARCH"
        exit 1
    fi
else
    echo "Unsupported operating system: $OS"
    exit 1
fi

# Download the correct binary with curl
curl -L "$URL" -o javy.gz

# Check if the download was successful
if [ ! -f javy.gz ]; then
    echo "Failed to download Javy."
    exit 1
fi

# Unzip the binary
gunzip javy.gz

# Make it executable
chmod +x javy

# Move the binary to a directory in your PATH
# Use sudo if it is available and the user is not root
if command -v sudo &> /dev/null && [ "$(id -u)" -ne 0 ]; then
    sudo mv javy /usr/local/bin/
else
    mv javy /usr/local/bin/
fi

# Verify the installation
if command -v javy &> /dev/null; then
    echo "Javy installation completed."
else
    echo "Javy installation failed."
    exit 1
fi
