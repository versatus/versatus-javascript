#!/bin/bash
source ./lib/scripts/colored_echo.sh

print_info "Checking system for dependencies..."

# Function to install jq
install_jq() {
    print_info "Installing jq..."
    if [ "$(uname -s)" = "Darwin" ]; then
        # macOS installation
        brew install jq
    elif [ "$(uname -s)" = "Linux" ]; then
        # Linux installation
        apt-get update
        apt-get install -y jq
    else
        print_error "Unsupported operating system for jq installation."
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
    print_info "Javy is already installed."
else
    print_warning "ALERT: javy is not installed! Attempting to download and install javy."

    # Run the install_javy.sh script from the determined script directory
    if "${SCRIPT_DIR}/install_javy.sh"; then
        print_success "Javy installation completed."
    else
        print_error "Javy installation failed."
        exit 1
    fi
fi
