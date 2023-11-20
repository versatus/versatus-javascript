#!/bin/bash

echo "checking system for dependencies..."
if command -v javy >/dev/null 2>&1; then
    echo "system is ready."
else
    echo "ALERT: javy is not installed! Attempting to download and install javy."

    # Prompt the user before installing
    read -p "Do you want to proceed with the javy installation? (y/N) " -n 1 -r
    echo # move to a new line

    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        # Download and install Javy
        curl -L https://github.com/bytecodealliance/javy/releases/download/v1.2.0/javy-arm-linux-v1.2.0.gz -o javy.gz
        gzip -d javy.gz
        chmod +x javy
        sudo mv javy /usr/local/bin

        echo "javy installation completed."
    else
        echo "Installation aborted. Please install javy to continue."
        exit 1
    fi
fi
