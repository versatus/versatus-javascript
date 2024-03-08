# versatus-javascript
### Overview
This repository provides some essential tools and interfaces for developing 
**Programs** for the **LASR** network using Typescript.
It provides a number of helpful types, classes,
examples, and functions to aid in the building of LASR programs. 
Along with some helper functions The CLI is used to 
initialize, build, deploy, and call programs in the network from the terminal.

### Links To More In-Depth Information
[CLICK HERE TO LEARN MORE ABOUT LASR
](/LASR.md)

[CLICK HERE FOR A MORE IN-DEPTH GETTING STARTED GUIDE
](/GETTING_STARTED.md)

[CLICK HERE TO LEARN MORE ABOUT LASRCTL CLI
](/src/lasrctl/README.md)

[CLICK HERE TO LEARN MORE ABOUT PROGRAMS ON LASR
](/src/lib/programs/README.md)



## Getting started

### Dependencies
* Node _(>= v18)_
* NPM / Yarn
* Typescript


## Set up Project

### New TypeScript Project

First, ensure you have Node.js installed. Then, initialize a new TypeScript project:

```bash
mkdir your-project-name
cd your-project-name
npm init -y
npm install typescript --save-dev
npx tsc --init
```

### Install @versatus/versatus-javascript

To interact with LASR, you'll need the @versatus/versatus-javascript package:

```bash
npm install @versatus/versatus-javascript
```

## Initialize Project with lasrctl
```bash
npx lasrctl init # Choose blank, fungible-token, or faucet
```

## Build Your Program
```bash
npx lasrctl build example-program.ts
```

## Test Your Program
```bash
npx lasrctl test inputs
```
## Create Account and Deploy Program

#### Deploy Command Example

```bash
npx lasrctl deploy --author my-name --name my-token --programName MY_TOKEN --symbol MY_TOKEN --initializedSupply 100 --totalSupply 100
```

# Work with the Faucet

To interact with the Faucet and manage your programs:

Visit the Faucet: Go to https://faucet.versatus.io.
Download the Wallet: Download and install the wallet provided on the Faucet site.
Import Your Program's Key: Follow the instructions on the wallet to import your local program's key.
View and Interact: Once imported, you can see your programs listed in the wallet and interact with them through the provided UI.
Congratulations! You've successfully set up and deployed your TypeScript project. Explore the capabilities of your program and how you can enhance its functionality further.
