#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$DIR/colored_echo.sh"

print_info "Checking system for dependencies..."

# Function to install jq
install_jq() {
    print_info "Installing jq..."
    OS="$(uname -s)"
    case "$OS" in
        Darwin)
            # macOS installation
            brew install jq
            ;;
        Linux)
            # Check if running on NixOS
            if [ -e /etc/NIXOS ]; then
                # NixOS installation
                nix-env -iA nixos.jq
            else
                # Assume Debian/Ubuntu or similar
                apt-get update
                apt-get install -y jq
            fi
            ;;
        *)
            print_error "Unsupported operating system for jq installation."
            return 1
            ;;
    esac
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    install_jq
fi
