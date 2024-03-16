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



# Getting started

<hr />

#### Dependencies
* Node _(>= v18)_
* NPM / Yarn

<hr/>

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
npx lasrctl init # Choose blank, fungible-token, or faucet
```

#### 4) Build Your Program
```bash
npx lasrctl build example-program.ts
```

#### 5) Test Your Program
```bash
npx lasrctl test inputs
```
#### 6) Create Account and Deploy Program
```bash
npx lasrctl deploy --author you --name myToken --symbol MYTOKEN --programName "My first token on LASR" --initializedSupply 10000000 --totalSupply 10000000 --inputs '{"imgUrl":"https://pbs.twimg.com/profile_images/1704511091236020224/aOByHnoK_400x400.jpg","conversionRate":"1","paymentProgramAddress":"0xa60c7238d98c7ecef8659a18c2e8c6265327f280"}' --network stable
```
_Note: the program deploy may fail on it's first attempt. If so, try it once more_

### Interact with LASR Online 
1) Complete steps above. 
2) Go to https://faucet.versatus.io 
3) Import Secret Key into the wallet from the initialized `secret_key` in the `.lasr` folder.
```bash
cat .lasr/wallet/keypair.json | jq -r '.[0].secret_key' 
```
4) Reload the faucet and start interacting with the network.
