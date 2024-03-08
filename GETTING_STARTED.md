# Getting Started with LASR + TypeScript

Welcome to your new LASR project! This guide will walk you through setting up the project, creating an account, deploying your program, and interacting with it via the CLI. We'll also cover how to work with the Faucet for account initialization and program interaction. Let's dive in!

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

With this package installed, you can now initialize your project with the `npx lasrctl` command. We provide three templates to get you started: `blank`, `fungible` and `faucet`.  You may only have a single project initialized at one time.

```bash
npx lasrctl init # Choose blank, fungible, or faucet
```

After initialization, you will now have an example program available in the `example-program.ts` file in the root of your project.  The init command also creates a folder with example input JSON for each method in the `inputs` folder.

## Build Your Program

Before you deploy your program, you must compile your TypeScript to JavaScript. This command uses WebPack to package your entire program into a single file that will be deployed to the network.

If you make a change to your TypeScript program, you must build it before you can deploy any changes to the network.

```bash
npx lasrctl build example-program.ts
```

## Test Your Program

With your program now built, you can use `lasrctl` to test how your program responds to sample JSON inputs that it may receive from the LASR protocol.  The sample input JSON files are in the `./inputs` folder. 

```bash
npx lasrctl test inputs
```

If the tests pass correctly, you should see the following:

```
Validating the PROGRAM OUTPUT...
*******************************
Output is valid ✅ 
*******************************
*******************************
Test complete.
Output is valid ✅ 
*******************************
Test complete.
```

## Create Account and Deploy Program

### Create 

### Deploy Your Program

Deploying your program involves several steps, including initializing your account with funds from the Faucet, deploying your code to IPFS, registering the CID with Versatus, and deploying the program to the protocol:

```bash
npx lasrctl deploy [params]
```

#### Deploy Parameters

Deploy a program

| Option               | Description                               | Type     | Required | Default                       |
|----------------------|-------------------------------------------|----------|----------|-------------------------------|
| `--version`          | Show version number                       | boolean  | No       |                               |
| `--help`             | Show help                                 | boolean  | No       |                               |
| `--author`           | Author of the contract                    | string   | Yes      |                               |
| `--name`             | Name of the contract                      | string   | Yes      |                               |
| `--symbol`           | Symbol for the program                    | string   | Yes      |                               |
| `--programName`      | Name for the program                      | string   | Yes      |                               |
| `--initializedSupply`| Initial Supply of the Token               | string   | Yes      |                               |
| `--totalSupply`      | Total supply of the token to be created   | string   | Yes      |                               |
| `--recipientAddress` | Address for the initialized supply        | string   | No       |                               |
| `--inputs`           | Additional inputs for the program         | string   | No       |                               |
| `--keypairPath`      | Path to the keypair file                  | string   | No       | `./.lasr/wallet/keypair.json` |
| `--secretKey`        | Secret key for the wallet                 | string   | No       |                               |
| `--target`           | Build target                              | string   | No       | `node` (choices: "node")      |

To deploy your program successfully, follow the detailed steps below. Each step is crucial for the deployment process and ensures that your program is ready for interaction:

### Faucet Initialization
This step involves automatically connecting to the Faucet, a source of test funds. It initializes your account with the necessary funds required for deploying your program. This is an essential step to ensure that your account has enough balance to cover the deployment costs.

### Deploy to IPFS
In this phase, your program's code is deployed to the InterPlanetary File System (IPFS), a decentralized storage solution. Upon successful deployment, you will receive a Content Identifier (CID). This CID is a unique address that points to your program's code on IPFS, ensuring that your program can be accessed and executed from anywhere.

### Register CID with Versatus
Once you have your program's CID, the next step is to register this CID with Versatus. This process involves creating a program account associated with your CID. Registering your CID with Versatus is crucial as it links your program's code on IPFS to a specific account on the protocol, making it executable.

### Deploy Program to Protocol
After registering your CID, you can now deploy your program to the protocol. This step involves calling the `create` method, which officially deploys your program onto the network. Additionally, this step includes an airdrop of an initialized supply of tokens for command-line interaction. This initialized supply is crucial for testing and interacting with your program immediately after deployment.

#### Deploy Command Example

```bash
npx lasrctl deploy --author my-name --name my-token --programName MY_TOKEN --symbol MY_TOKEN --initializedSupply 100 --totalSupply 100
```

### Interact with the Program via CLI

With your program now deployed, you can begin interacting with it through the Command Line Interface (CLI). This interaction involves executing commands and transactions that demonstrate your program's functionality. The CLI provides a direct way to test and ensure that your program behaves as expected on the network.

To start interacting with your deployed program through the CLI, use the following command structure:

```bash
npx lasrctl call [params]
```
#### Call Command Options

To call a program method with the specified arguments, use the following options:

| Option            | Description                                       | Type    | Required |
|-------------------|---------------------------------------------------|---------|----------|
| `--version`       | Show version number                               | boolean | No       |
| `--help`          | Show help                                         | boolean | No       |
| `--programAddress`| Program address to be sent                        | string  | Yes      |
| `--op`            | Operation to be performed by the program          | string  | Yes      |
| `--inputs`        | Input json required by the operation              | string  | Yes      |
| `--keypairPath`   | Path to the keypair file                          | string  | No       |
| `--secretKey`     | Secret key for the wallet                         | string  | No       |

# Work with the Faucet

To interact with the Faucet and manage your programs:

Visit the Faucet: Go to https://faucet.versatus.io.
Download the Wallet: Download and install the wallet provided on the Faucet site.
Import Your Program's Key: Follow the instructions on the wallet to import your local program's key.
View and Interact: Once imported, you can see your programs listed in the wallet and interact with them through the provided UI.
Congratulations! You've successfully set up and deployed your TypeScript project. Explore the capabilities of your program and how you can enhance its functionality further.

vbnet
Copy code

This guide assumes a certain level of familiarity with command-line operations and basic TypeScript development. It's designed to be accessible for entry-level TypeScript developers but might require modifications based on your specific project needs or if the setup process for `@versatus/versatus-javascript` and `lasrctl` differs.