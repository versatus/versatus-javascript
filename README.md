# versatus-javascript
## Overview
This repository provides essential tools and interfaces for developing Versatus smart contracts in the JavaScript programming language. We maintain a high-level and language-agnostic overview of smart contract development on Versatus (https://github.com/versatus/versatus/blob/main/docs/DevelopingSmartContracts.md), which we recommend reading alongside the JavaScript-specific documentation provided.

## Javascript Installation
JavaScript development often relies on Node.js, a JavaScript runtime, and npm (Node Package Manager) for managing packages and dependencies. To install Node.js and npm, visit the official Node.js website (https://nodejs.org/en). Alternative to npm (yarn) is also provided under dependencies.

## Javscript Dependencies
In the JavaScript ecosystem, you can compile your JavaScript code to Web Assembly format that is compatible with the Versatus smart contract runtime. This allows you to write smart contracts using JavaScript and execute them seamlessly within the Versatus environment. The JavaScript tooling and resources that support JavaScript-based WebAssembly compilation include the following:

### Required Dependencies 
#### Node 
Node.js is a JavaScript runtime and fundamental dependency for most JavaScript-based projects, including smart contract development. It that allows you to execute  JavaScript code on your local machine and interact with various libraries and tools.

#### Yarn
Yarn is another package manager for JavaScript. It provides an efficient and reliable way to manage project dependencies, install packages, and handle versioning.. It is an alternative to npm (Node Package Manager) and offers advantages such as faster package installation. You can install Yarn by following the instructions provided on the official Yarn website: Yarn Official Website (https://yarnpkg.com/).

#### Javy
Javy is a JavaScript to WebAssembly toolchain that can create small WASM modules. The toolchain aims to be a versatile tool for anyone who wants to work with JavaScript in WASM, and it can compile QuickJS, a small JavaScript engine, to WASM along with the script to be executed. To install Javy, perform the following steps:
1. Download the latest version of the Javy package for your platform from the Bytecode Alliance Github page (https://github.com/bytecodealliance/javy/releases/)
2. Decompress the downloaded file using gunzip or another tool capable of decompressing gzip-format files (eg, ```gunzip javy-x86_64-macos-v1.2.0.gz```)
3. Make the Javy binary executable (ie, ```chmod a+x javy-x86_64-macos-v1.2.0```)
4. Optionally place the Javy binary somewhere in your PATH (eg,``` /usr/local/bin or ~/bin```) and rename it to simply javy (ie, ```mv javy-x86_64-macos-v1.2.0 /usr/local/bin/javy```) to do both in one command.
5. Test that it can be executed by running it, including the path to the executable if needed (ie ```./javy or /usr/local/bin/javy``` or simply ```javy```). Executing it without any arguments should show the usage output. Or javy --version should show the version number, also indicating it works.

## Building a Smart Contract

### Install
Install the @versatus/versatus-javascript package using Yarn. This package provides the necessary tools and libraries for building smart contracts on the Versatus network.
```bash
yarn install @versatus/versatus-javascript
```

### Initialize Basic Example
Initialize a basic example to start building a smart contract.
```bash
npx lasrctl init
```

### Initialize Erc-20 Example
If you want to build an ERC-20 smart contract, you can initialize an ERC-20 example using the following command.
```bash
npx lasrctl init erc-20
```

### Build Contract
Once you have written your smart contract code, you can build the contract using the lasrctl build command. Replace example-contract.js with the actual filename of your smart contract.
```bash
npx lasrctl build example-contract.js
```

### Test Contract
You can test your smart contract using the lasrctl test command. Provide the path to the sample contract input JSON file.
```bash
npx lasrctl test inputs/sample-contract-input.json
```
By following these steps, you can set up the development environment, initialize examples, build, and test smart contracts on the Versatus network using the provided commands.
Please note that the specific details of smart contract development may vary based on the Versatus network's documentation and requirements. It's important to refer to the official Versatus documentation for the most accurate and up-to-date information.
