#!/bin/bash

if command -v javy >/dev/null 2>&1; then
    echo "javy is installed."
else
    echo "ALERT: javy is not installed! Please install it immediately."
    exit 1
fi
