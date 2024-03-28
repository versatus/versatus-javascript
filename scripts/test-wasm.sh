#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$DIR/colored_echo.sh"

# Use the current working directory as the root directory
ROOT_DIR=$(pwd)
BUILD_WASM_PATH="$ROOT_DIR/build/build.wasm"
WASM_PATH="$ROOT_DIR/build/versatus-wasm"

LASR_CLI_PATH="$ROOT_DIR/build/lasr_cli"

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
    print_error "Contract method failed! ❌ "
    print_light_gray "Your contract method was unsuccessful. Please update your contract method and try again. If you're still having trouble, please contact us on discord (https://discord.gg/versatus) / telegram (https://t.me/+4nJPCLdzGOUyMDQx) / twitter (https://twitter.com/VersatusLabs) and we'll try to help you resolve the issue."
    exit 1
fi

filename=$(basename "$INPUT_JSON_PATH")
print_info  "Tested input: \033[0;33m$filename\033[0m"
echo
print_light_gray "Validating the PROGRAM OUTPUT..."
VALIDATION_RESPONSE=$("$LASR_CLI_PATH" parse-outputs --json "$EXECUTE_RESPONSE")
VALIDATION_STATUS=$?

if [ "$VALIDATION_STATUS" -eq 0 ]; then
    print_light_gray "*******************************"
    print_light_green "Output is valid ✅ "
    print_light_gray "*******************************"
    print_light_gray "Test complete."
    exit 0
else

    print_warning "*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*"
    print_error "Output is invalid  ❌ "
    print_cyan "$VALIDATION_RESPONSE"
    print_light_gray "Your contract method was successful but the output was incorrect. Please check the structure of your built instructions and try again. If you're still having trouble, please contact us on discord (https://discord.gg/versatus) / telegram (https://t.me/+4nJPCLdzGOUyMDQx) / twitter (https://twitter.com/VersatusLabs) and we'll try to help you resolve the issue."
    print_warning "*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*"
    print_light_gray "Test complete."
    echo
    exit 1
fi


