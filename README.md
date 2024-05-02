# LASR: TypeScript SDK

### Overview
This repository provides some essential tools and interfaces for developing 
**Programs** for the **LASR** network using Typescript.
It provides a number of helpful types, classes,
examples, and functions to aid in the building of LASR programs. 
Along with some helper functions The CLI is used to 
initialize, build, deploy, and call programs in the network from the terminal.

#### Learn more about LASR
- [Versatus Website](https://versatus.io)

# Getting started
#### Dependencies
* Node _(>= v18)_
* NPM / Yarn


#### 1) Create New TypeScript Project
```bash
mkdir your-project-name
cd your-project-name
npm init -y
npm install typescript --save-dev
npx tsc --init
```

#### 2) Install @versatus/versatus-javascript
```bash
npm install @versatus/versatus-javascript
```

#### 3) Initialize Project with lasrctl
```bash
npx lasrctl init hello-lasr
```

#### 4) Build Your Program
```bash
npx lasrctl build example-program.ts
```

#### 5) Test Your Program
```bash
npx lasrctl test --build example-program --inputJson example-program-inputs 
```
#### 6) Create Account and Deploy Program
```bash
npx lasrctl deploy --build example-program --symbol MYTOKEN --programName "My first token on LASR"
```
_Note: the program deploy may fail on it's first attempt. If so, try it once more_

### Interact with LASR Online 
1) Complete steps above. 
2) Go to https://playground.versatus.io 
3) Import Secret Key into the wallet from the initialized `secret_key` in the `.lasr` folder.
```bash
cat .lasr/wallet/keypair.json | jq -r '.[0].secret_key' 
```
4) Reload the faucet and start interacting with the network.
