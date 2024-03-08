#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
LIGHT_GRAY='\033[0;37m'
LIGHT_RED='\033[1;31m'
LIGHT_GREEN='\033[1;32m'
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
        cyan)
            echo -e "${CYAN}${message}${NC}"
            ;;
        magenta)
            echo -e "${MAGENTA}${message}${NC}"
            ;;
        light_gray)
            echo -e "${LIGHT_GRAY}${message}${NC}"
            ;;
        light_red)
            echo -e "${LIGHT_RED}${message}${NC}"
            ;;
        light_green)
            echo -e "${LIGHT_GREEN}${message}${NC}"
            ;;
        *)
            echo "Unknown color: $color"
            ;;
    esac
}

print_error() {
    local message=$1
    print_colored "red" "$message"
}

print_warning() {
    local message=$1
    print_colored "yellow" "$message"
}

print_info() {
    local message=$1
    print_colored "blue" "$message"
}

print_success() {
    local message=$1
    print_colored "green" "$message"
}

# New simplified print functions for additional colors
print_cyan() {
    local message=$1
    print_colored "cyan" "$message"
}

print_magenta() {
    local message=$1
    print_colored "magenta" "$message"
}

print_light_gray() {
    local message=$1
    print_colored "light_gray" "$message"
}

print_light_red() {
    local message=$1
    print_colored "light_red" "$message"
}

print_light_green() {
    local message=$1
    print_colored "light_green" "$message"
}
