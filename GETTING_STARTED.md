# Getting Started with LASR + TypeScript

Welcome to your new LASR project! This guide will walk you through setting up the project, creating an account, deploying your program, and interacting with it via the CLI. We'll also cover how to work with the Faucet for account initialization and program interaction. Let's dive in!

## Speedrun

Love a speed run? Get yourself up and running with a token on LASR as quickly as possible and send us your time.

```bash
mkdir -p my-token && \
    cd my-token && \
    npm init -y && \
    npm install typescript ts-node @types/node --save-dev && \
    npx tsc --init && \
    yarn add @versatus/versatus-javascript && \
    npx lasrctl init fungible && \
    npx lasrctl build example-program.ts && \
    npx lasrctl test inputs && \
    npx lasrctl deploy --build example-program --author me --name speed --programName run --symbol SPEEDRUN --initializedSupply 100 --ts 1000 --txInputs '{"imgUrl":"https://pbs.twimg.com/profile_images/1704511091236020224/aOByHnoK_400x400.jpg","conversionRate":"1","paymentProgramAddress":"0x0000000000000000000000000000000000000000"}' --createTestFilePath example-program-inputs/non-fungible-create.json && \
    open -a "Google Chrome" https://faucet.versatus.io
```

## Set up Project

For the moment, we only support TypeScript. We are actively working on supporting additional languages such as Python, Go and C++. We will be releasing these very soon.

### Set up a new TypeScript Project

First, ensure you have [Node.js](https://nodejs.org/en/download) installed. Then, initialize a new TypeScript project:

```bash
mkdir your-project-name
cd your-project-name
npm init -y
npm install typescript --save-dev
npx tsc --init
```

### Install @versatus/versatus-javascript

Now with a brand new TypeScript project, you'll need the `@versatus/versatus-javascript` package:

```bash
npm install --save @versatus/versatus-javascript
```

## Initialize Project with lasrctl

With this package installed, you can now initialize your project with the `npx lasrctl` command. We provide three templates to get you started: `blank`, `fungible` and `faucet`.  You may only have a single project initialized at one time.

### LASR Templates

| Template       | Description                                                              |
|----------------|--------------------------------------------------------------------------|
| `blank`        | A minimal template to start from scratch.                                |
| `fungible`     | A template for creating fungible tokens.                                 |
| `non-fungible` | A template for creating non-fungible tokens.                             |
| `faucet`       | A template for creating a faucet, allowing users to request test tokens. |

```bash
npx lasrctl init fungible # Choose blank, fungible, non-fungible or faucet
```

After initialization, you will now have an example program available in the `burd.ts` file in the root of your project.  The init command also creates a folder with example JSON input for each method in the `inputs` folder.

You can look and read these JSON files to see an example of what the protocol will send your program.

## Build Your Program

Before you deploy your program, you must compile your TypeScript to JavaScript. This command uses Webpack to package your entire program into a single file that will be deployed to the network.

If you make a change to your TypeScript program, you must build it before you can deploy any changes to the network.

```bash
npx lasrctl build burd.ts
```

This command builds your TypeScript program and places the JavaScript output into the `./build` folder. You should not check the `./build` folder into source control.

## Test Your Program

With your program now built, you can use `npx lasrctl` to test how your program responds to sample JSON inputs that it may receive from the LASR protocol.  The sample input JSON files are in the `./inputs` folder. 

```bash
npx lasrctl test -b example-program -i inputs # folder where input JSON is stored
```

The test command loops over all of the JSON files in this folder and passes each of them into your program. The output is then returned to the terminal.

If the tests pass correctly, you should see the following (there may be more tests depending on which example you initialized):

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

Your program is now ready to deploy to the LASR network.

## Create Account and Deploy Program

### Local Keypair

The `npx lasrctl` command makes it as easy as possible to deploy programs to the LASR protocol.  If you do not have a set of local keys defined, it will create one and place it in the `.lasr/wallet/keypair.json` file. 

🚨🚨🚨 **SECURITY ALERT** 🚨🚨🚨

It is **CRUCIAL** to keep your `keypair.json` file secure at all times. This file contains sensitive information that can compromise the security of your account if it falls into the wrong hands. 

- **DO NOT** share this file with anyone.
- **DO NOT** commit this file to public repositories.
- Consider using secret management tools or services to store sensitive information securely.

Failure to secure your `keypair.json` file could result in unauthorized access to your account, leading to loss of funds or malicious deployment under your identity.

🚨🚨🚨 **KEEP YOUR KEYS SECURE** 🚨🚨🚨

### Deploy Your Program

The `npx lasrctl deploy` command makes it easy to deploy a program to the LASR protocol.  Here are the steps of what the deploy command performs:

1. **Hits faucet to initialize the account because funds are needed to register a program**: Before deploying your program, it's essential to ensure that your account has the necessary funds to cover the deployment costs.  The LASR protocol requires that an account be funded before it can deployo a program. This is done to minimize spamming. The faucet is a source of test funds that initializes your account with a balance sufficient for registering your program on the network.  The LASR testnet does not require any fees to register a program.

2. **Deploys the program to IPFS**:
    - Upon deployment, your program's code is uploaded to the InterPlanetary File System (IPFS), a decentralized storage solution. This step is crucial for making your program accessible from anywhere in the network.
    - **Gets a CID back**: After successful deployment to IPFS, you receive a Content Identifier (CID). The CID is a unique address that points to your program's code on IPFS, ensuring that it can be reliably accessed and executed.

3. **Registers the CID with LASR - get a program account**: With the CID in hand, the next step is to register it with the LASR Protocol. This process involves creating a program account associated with your CID. Registering your CID is a critical step as it links your program's code on IPFS to a specific account on the LASR protocol, making it executable on the network.

4. **Deploys the program to the protocol (calls create method)**:
    - The final step in the deployment process involves calling the `create` method, which officially deploys your program onto the LASR network. This step is where your program goes from being a piece of code to an active, executable entity on the network.

When all of these steps successfully complete, you will receive the program address of your deployed program. This program address can now be interacted with as part of the LASR Network.

### Everything is a Token

Within the LASR protocol - everything is a token. When we deploy our program, we must specify the program name and token symbol, and then an initial supply of tokens.  You must supply these when you deploy your program via `npx lasrctl`

### Example Deployment Command

```bash
npx lasrctl deploy --build example-program --author my-name --name my-token --programName MY_TOKEN --symbol MY_TOKEN --initializedSupply 1 --totalSupply 1 --txInputs '{"imgUrl":"https://pbs.twimg.com/profile_images/1704511091236020224/aOByHnoK_400x400.jpg","conversionRate":"1","paymentProgramAddress":"0x0000000000000000000000000000000000000000"}' --createTestFilePath example-program-inputs/non-fungible-create.json
```

#### Deploy Parameters

Deploy a program

| Option                | Description                                                                  | Type     | Required | Default                       |
|-----------------------|------------------------------------------------------------------------------|----------|----------|-------------------------------|
| `--version`           | Show version number                                                          | boolean  | No       |                               |
| `--help`              | Show help                                                                    | boolean  | No       |                               |
| `--build`             | Name of the program file being built                                         | string   | Yes      |                               |
| `--author`            | Author of the contract                                                       | string   | Yes      |                               |
| `--name`              | Name of the contract                                                         | string   | Yes      |                               |
| `--symbol`            | Symbol for the program                                                       | string   | Yes      |                               |
| `--programName`       | Name for the program                                                         | string   | Yes      |                               |
| `--initializedSupply` | Initial Supply of the Token                                                  | string   | Yes      |                               |
| `--totalSupply`       | Total supply of the token to be created                                      | string   | Yes      |                               |
| `--recipientAddress`  | Address for the initialized supply                                           | string   | No       |                               |
| `--txInputs`          | Additional inputs for the program                                            | string   | No       |                               |
| `--createTestFilePath`| Path to a valid create.json file to test the create method before deployment | string   | yes      |                               |
| `--keypairPath`       | Path to the keypair file                                                     | string   | No       | `./.lasr/wallet/keypair.json` |
| `--secretKey`         | Secret key for the wallet                                                    | string   | No       |                               |
| `--target`            | Build target                                                                 | string   | No       | `node` (choices: "node" - _more soon_)      |

Keep track of your program account id - this is the required key that you will need to interact with your program in later steps.

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
| `--txInputs`        | Input json required by the operation              | string  | Yes      |
| `--keypairPath`   | Path to the keypair file                          | string  | No       |
| `--secretKey`     | Secret key for the wallet                         | string  | No       |

The `--txInputs` needs to be a string of JSON containing any of the custom parameters that your Program can accept and understand.

#### Example Call Command

```bash
npx lasrctl call --programAddress <YOUR_PROGRAM_ADDRESS_FROM_DEPLOY> --op hello --txInputs '{"name": "My Name"}'
```

## Faucet

The LASR Faucet is available at https://faucet.versatus.io

<img src="adding-private-key-to-wallet.gif">

Once you have set up the LASR Wallet with your keypair and deployed a program, you can now faucet yourself additional funds and more easily interact with your programs.

## Troubleshooting and Feedback

This is *ALPHA* software. It will break. We welcome feedback.  Please use Github Issues to report any issues and we will do our best to solve them for you.

PR's are welcome.

If you're still having trouble, please contact us on [discord](https://discord.gg/versatus), [telegram](https://t.me/+4nJPCLdzGOUyMDQx), or [twitter](https://twitter.com/VersatusLabs) and we'll try to help you resolve the issue.
