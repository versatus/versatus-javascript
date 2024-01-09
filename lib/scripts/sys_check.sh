#!/bin/bash

echo "Checking system for dependencies..."

# Function to install jq
install_jq() {
    echo "Installing jq..."
    if [ "$(uname -s)" = "Darwin" ]; then
        # macOS installation
        brew install jq
    elif [ "$(uname -s)" = "Linux" ]; then
        # Linux installation
        apt-get update
        apt-get install -y jq
    else
        echo "Unsupported operating system for jq installation."
        return 1
    fi
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    install_jq
fi

# Determine the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

if command -v javy >/dev/null 2>&1; then
    echo "Javy is already installed."
else
    echo "ALERT: javy is not installed! Attempting to download and install javy."

    # Run the install_javy.sh script from the determined script directory
    if "${SCRIPT_DIR}/install_javy.sh"; then
        echo "Javy installation completed."
    else
        echo "Javy installation failed."
        exit 1
    fi
fi
