#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to print colored message
print_colored() {
    local color=$1
    local message=$2

    case $color in
        red)
            echo -e "${RED}${message}${NC}"
            ;;
        green)
            echo -e "${GREEN}${message}${NC}"
            ;;
        blue)
            echo -e "${BLUE}${message}${NC}"
            ;;
        yellow)
            echo -e "${YELLOW}${message}${NC}"
            ;;
        *)
            echo "Unknown color: $color"
            ;;
    esac
}

print_error() {
    local message=$1
    print_colored "red" "Error: $message"
}

print_warning() {
    local message=$1
    print_colored "yellow" "Warning: $message"
}

print_info() {
    local message=$1
    print_colored "blue" "$message"
}

print_success() {
    local message=$1
    print_colored "green" "$message"
}
