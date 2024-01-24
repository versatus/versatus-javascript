#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$DIR/colored_echo.sh"

# Use the current working directory as the root directory
ROOT_DIR=$(pwd)
BUILD_WASM_PATH="$ROOT_DIR/build/build.wasm"
WASM_PATH="$ROOT_DIR/build/versa.wasm"

# Check if the JSON input file path is provided as an argument
if [ -z "$1" ]; then
    print_error "Error: No JSON input file path provided."
    exit 1
fi
INPUT_JSON_PATH="$1"

# Check if the provided JSON input file exists
if [ ! -f "$INPUT_JSON_PATH" ]; then
    print_error "JSON input file '$INPUT_JSON_PATH' does not exist."
    exit 1
fi

print_info "Running the test using versa-wasm..."

# Store the response from versa-wasm execute in a variable
EXECUTE_RESPONSE=$("$WASM_PATH" execute --wasm "$BUILD_WASM_PATH" --json "$INPUT_JSON_PATH" | jq)

# Extract the success value from the JSON output
TEST_RESULT=$(echo "$EXECUTE_RESPONSE" | jq -r '.success')

print_warning "\nTest results:"

if [ "$TEST_RESULT" == "true" ]; then
    print_success "Contract method was successful."
    print_info "Output: "
    echo "$EXECUTE_RESPONSE"
else
    print_error "Contract method was unsuccessful."
fi

print_info "Test complete."
