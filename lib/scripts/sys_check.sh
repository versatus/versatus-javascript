#!/bin/bash

echo "checking system for dependencies..."
if command -v javy >/dev/null 2>&1; then
    echo "system is ready."
else
    echo "ALERT: javy is not installed! Attempting to install Rust, which is required for javy."

    # Prompt the user before installing
    read -p "Do you want to proceed with the Rust and javy installation? (y/N) " -n 1 -r
    echo # move to a new line

    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        # Install Rust via Rustup
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

        # Source the cargo environment (this assumes the default installation path)
        source "$HOME/.cargo/env"

        # Install wasm-pack, which is needed to build and work with Rust-generated WebAssembly
        cargo install wasm-pack

        # Install javy
        cargo install javy

        echo "Rust and javy installation completed."
    else
        echo "Installation aborted. Please install Rust and javy to continue."
        exit 1
    fi
fi
