# versatus-javascript
### Overview
This repository provides some essential tools and interfaces for developing 
**Programs** for the **LASR** network using Typescript.
It provides a number of helpful types, classes,
examples, and functions to aid in the building of LASR programs. 
Along with some helper functions The CLI is used to 
initialize, build, deploy, and call programs in the network from the terminal.

**LASR** stands for a Language Agnostic Stateless Rollup. The protocol
enables developers with the ability to write Programs that run on the network
in some of today's most popular programing languages. 

We are current support:
* Typescript ✅
* Javascript ⏳
* Python ⏳
* Rust ⏳
* Golang ⏳
* C ⏳
* C++ ⏳

But that list isn't prescriptive. We're a small team and more than welcome
anyone who wants to create an SDK for LASR in any language they should so choose
which leads me to the next part.

### _A quick note about Programs in LASR._ 
Programs in **LASR** take in JSON and return JSON. A programs sole job is to 
take in the JSON passed to it by the protocol, execute whatever logic the 
developer might want to execute, and then return an array of instructions.

The protocol has a limited but _POWERFUL_ set of actions it can act on that are
akin to the tried and true methods that power web2: **Create/Read/Update/Destroy**.

In LASR, we have: **CUTB**

* **Create**
* **Update**
* **Transfer**
* **Burn**

The returned instructions from your program will instruct the protocol to  

## Getting started

### Dependencies
* Node _(>= v18)_
* NPM / Yarn
* Typescript



### Install LASRCTL as a global package.
Install the @versatus/versatus-javascript package using Yarn. 
This package provides the necessary tools and libraries for building 
programs on the **LASR** network.
```bash
yarn add @versatus/versatus-javascript
```

### Initialize Basic Example
Initialize a basic example to start building a smart contract. It will initialize with a hello method.
```bash
npx lasrctl init
```

### Initialize Fungible Token Example
If you want to build an ERC-20 smart contract, you can initialize an ERC-20 example using the following command.
```bash
npx lasrctl init fungible-token 
```

### Build Contract
Once you have written your smart contract code, you can build the contract using the lasrctl build command. Replace example-contract.js with the actual filename of your smart contract.
```bash
npx lasrctl build example-contract.ts
```

### Test Contract
You can test your smart contract using the lasrctl test command. Provide the path to the sample contract input JSON file.
```bash
npx lasrctl test inputs
```
By following these steps, you can set up the development environment, initialize examples, build, and test smart contracts on the Versatus network using the provided commands.
Please note that the specific details of smart contract development may vary based on the Versatus network's documentation and requirements. It's important to refer to the official Versatus documentation for the most accurate and up-to-date information.
