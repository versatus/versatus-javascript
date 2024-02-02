#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$DIR/colored_echo.sh"

# Use the current working directory as the root directory
ROOT_DIR=$(pwd)
BUILD_WASM_PATH="$ROOT_DIR/build/build.wasm"
WASM_PATH="$ROOT_DIR/build/versa.wasm"

LASR_CLI_PATH="$ROOT_DIR/build/lasr-cli"

# Check if the JSON input file path is provided as an argument
if [ -z "$1" ]; then
    print_error "No JSON input file path provided."
    exit 1
fi
INPUT_JSON_PATH="$1"

# Check if the provided JSON input file exists
if [ ! -f "$INPUT_JSON_PATH" ]; then
    print_error "JSON input file '$INPUT_JSON_PATH' does not exist."
    exit 1
fi

print_light_gray "Running the test against VERSA.WASM..."

EXECUTE_RESPONSE=$("$WASM_PATH" execute --wasm "$BUILD_WASM_PATH" --json "$INPUT_JSON_PATH" --meter-limit 100000000)
EXECUTE_STATUS=$?

if [ $EXECUTE_STATUS -eq 0 ]; then
    print_light_gray "\nOutput:"
    print_light_gray "*******************************"
    print_magenta "$EXECUTE_RESPONSE"
    print_light_gray "*******************************"
    echo
    print_light_green "Contract method was successful ✅ "
    echo
else
    print_error "Command execution failed with exit code $EXECUTE_STATUS ❌ "
    exit 1
fi

print_light_gray "Validating the PROGRAM OUTPUT..."

VALIDATION_RESPONSE=$("$LASR_CLI_PATH" parse-outputs --json "$EXECUTE_RESPONSE")
VALIDATION_STATUS=$?

if [ "$VALIDATION_STATUS" -eq 0 ]; then
    print_light_gray "*******************************"
    print_light_green "Contract method is valid ✅ "
    print_light_gray "*******************************"
else
    print_warning "*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*"
    print_error "Output is invalid  ❌ "
    print_warning "*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*"
fi

print_light_gray "Test complete."
echo
echo
