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

But that list isn't prescriptive. We're a small team and welcome
anyone who wants to create an SDK for LASR in any language they should so choose
which leads me to the next part.

### _A quick note about Programs in LASR._ 
Programs in **LASR** take in JSON and return JSON. A programs sole job is to 
take in the JSON passed to it by the protocol, execute whatever logic the 
developer might want to execute, and then return an array of instructions.

[CLICK HERE TO LEARN MORE ABOUT LASR PROGRAMS
](/src/lib/programs/README.md)



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
