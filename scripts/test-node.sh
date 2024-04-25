#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$DIR/colored_echo.sh"

# Use the current working directory as the root directory


# Check if the JSON input file path is provided as an argument
if [ -z "$1" ]; then
    print_error "No JSON input file path provided."
    exit 1
fi
PROGRAM_TO_TEST="$1"
INPUT_JSON_PATH="$2"
SHOW_OUTPUT="$3"
IS_FAILURE_TEST="$4"
TRUE="true"
FALSE="false"
ROOT_DIR=$(pwd)
BUILD_NODE_PATH="$ROOT_DIR/build/lib/$PROGRAM_TO_TEST.js"
LASR_CLI_PATH="$ROOT_DIR/build/lasr_cli"

# Check if the provided JSON input file exists
if [ ! -f "$INPUT_JSON_PATH" ]; then
    print_error "JSON input file '$INPUT_JSON_PATH' does not exist."
    exit 1
fi

print_light_gray "Running test..."
EXECUTE_RESPONSE=$(JSON_PAYLOAD=$(cat "$INPUT_JSON_PATH") && echo "$JSON_PAYLOAD" | node "$BUILD_NODE_PATH")
EXECUTE_STATUS=$?

if [ $EXECUTE_STATUS -eq 0 ]; then
    if [ -z "$EXECUTE_RESPONSE" ]; then
        print_error "Execution response is empty! ❌ "
        if [ "$SHOW_OUTPUT" = "$FALSE" ]; then
          if [ "$IS_FAILURE_TEST" = "$FALSE" ]; then
            print_light_gray "The contract method did not return any output. Please check your contract method. If you're still having trouble, please contact us on discord (https://discord.gg/versatus) / telegram (https://t.me/+4nJPCLdzGOUyMDQx) / twitter (https://twitter.com/VersatusLabs) and we'll try to help you resolve the issue."
            exit 1
          else
            print_magenta "$EXECUTE_RESPONSE"
            print_light_green "Fail test failed ✅ "
          fi
        fi
    else
        if [ "$SHOW_OUTPUT" = "$TRUE" ]; then
          print_light_gray "\nOutput:"
          print_light_gray "*******************************"
          print_magenta "$EXECUTE_RESPONSE"
          print_light_gray "*******************************"
          echo
          print_light_green "Contract method was successful ✅ "
          echo
        fi
    fi

    filename=$(basename "$INPUT_JSON_PATH")
    print_light_gray "Validating the PROGRAM OUTPUT..."
    VALIDATION_RESPONSE=$("$LASR_CLI_PATH" parse-outputs --json "$EXECUTE_RESPONSE")
    VALIDATION_STATUS=$?
    if [ "$VALIDATION_STATUS" -eq 0 ]; then
        print_light_gray "*******************************"
        print_light_green "Output is valid ✅ "
        print_light_gray "*******************************"
        print_info  "Tested input: \033[0;33m$filename\033[0m"
        echo
        exit 0
    else
        print_warning "*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*"

        print_error "Output is invalid  ❌ "

        if [ "$IS_FAILURE_TEST" = "$FALSE" ]; then
            print_light_gray "Your contract method was successful but the output was incorrect. Please check the structure of your built instructions and try again. If you're still having trouble, please contact us on discord (https://discord.gg/versatus) / telegram (https://t.me/+4nJPCLdzGOUyMDQx) / twitter (https://twitter.com/VersatusLabs) and we'll try to help you resolve the issue."
            print_warning "*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*"
            print_info  "Tested input: \033[0;33m$filename\033[0m"
            echo
            exit 1
        else
        if [ "$SHOW_OUTPUT" = "$FALSE" ]; then
            print_magenta "$EXECUTE_RESPONSE"
        fi
            print_light_green "Fail test failed ✅ "
            print_info  "Tested input: \033[0;33m$filename\033[0m"
            echo
            exit 0
        fi
        echo
    fi
else
          if [ "$IS_FAILURE_TEST" = "$FALSE" ]; then
            print_magenta "$EXECUTE_RESPONSE"
            print_light_gray "The contract method did not return any output. Please check your contract method. If you're still having trouble, please contact us on discord (https://discord.gg/versatus) / telegram (https://t.me/+4nJPCLdzGOUyMDQx) / twitter (https://twitter.com/VersatusLabs) and we'll try to help you resolve the issue."
            exit 1
          else
            print_magenta "$EXECUTE_RESPONSE"
            print_light_green "Fail test failed ✅ "
            exit 1
          fi
    print_error "Contract method failed! ❌ "
    print_light_gray "Your contract method was unsuccessful. Please update your contract method and try again. If you're still having trouble, please contact us on discord (https://discord.gg/versatus) / telegram (https://t.me/+4nJPCLdzGOUyMDQx) / twitter (https://twitter.com/VersatusLabs) and we'll try to help you resolve the issue."
    exit 1
fi



