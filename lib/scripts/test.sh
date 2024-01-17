#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Use the current working directory as the root directory
ROOT_DIR=$(pwd)
BUILD_WASM_PATH="$ROOT_DIR/build/build.wasm"
WASM_PATH="$ROOT_DIR/build/versa.wasm"

# Check if the JSON input file path is provided as an argument
if [ -z "$1" ]; then
    echo -e "\033[0;31mError: No JSON input file path provided.\033[0m"
    exit 1
fi
INPUT_JSON_PATH="$1"

# Check if the provided JSON input file exists
if [ ! -f "$INPUT_JSON_PATH" ]; then
    echo -e "\033[0;31mError: JSON input file '$INPUT_JSON_PATH' does not exist.\033[0m"
    exit 1
fi

echo -e "\033[0;36mRunning the test using versa-wasm...\033[0m"

# Store the response from versa-wasm execute in a variable
EXECUTE_RESPONSE=$("$WASM_PATH" execute --wasm "$BUILD_WASM_PATH" --json "$INPUT_JSON_PATH" | jq)

# Extract the success value from the JSON output
TEST_RESULT=$(echo "$EXECUTE_RESPONSE" | jq -r '.success')

echo -e "\n\033[0;33mTest results:\033[0m"

if [ "$TEST_RESULT" == "true" ]; then
    echo -e "\033[0;32mContract method was successful.\033[0m"
    echo -e "\033[0;32mOutput: \033[0m"
    echo "$EXECUTE_RESPONSE"
else
    echo -e "\033[0;31mContract method was unsuccessful.\033[0m"
fi

echo -e "\033[0;32mTest complete.\033[0m"
