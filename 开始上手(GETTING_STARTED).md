# LASR + TypeScript 入门 (Getting Started with LASR + TypeScript)

Welcome to your new LASR project! This guide will walk you through setting up the project, creating an account, deploying your program, and interacting with it via the CLI. We'll also cover how to work with the Faucet for account initialization and program interaction. Let's dive in!  

欢迎来到您的新 LASR 项目！本指南将引导您完成项目设置、创建帐户、部署程序以及通过 CLI 与其交互。我们还将介绍如何使用 Faucet 进行帐户初始化和程序交互。让我们一起深入吧！

## 极速运行 (Speedrun)

Love a speed run? Get yourself up and running with a token on LASR as quickly as possible and send us your time.  

喜欢极速运行吗？尽快在 LASR 上使用代币启动并运行，并将您的时间发送给我们。

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
    npx lasrctl deploy --author me --name speed --programName run --symbol SPEEDRUN --is 100 --ts 1000 && \
    open -a "Google Chrome" https://faucet.versatus.io
```

## 设置项目 (Set up Project)

For the moment, we only support TypeScript. We are actively working on supporting additional languages such as Python, Go and C++. We will be releasing these very soon.  

目前，我们仅支持 TypeScript。我们正在积极致力于支持其他语言，例如 Python、Go 和 C++。我们将很快发布这些。

### 设置一个新的 TypeScript 项目 (Set up a new TypeScript Project)

First, ensure you have [Node.js](https://nodejs.org/en/download) installed. Then, initialize a new TypeScript project: 

首先，确保您安装了 [Node.js](https://nodejs.org/en/download)。然后，初始化一个新的 TypeScript 项目：

```bash
mkdir your-project-name
cd your-project-name
npm init -y
npm install typescript --save-dev
npx tsc --init
```

### 安装@versatus/versatus-javascript (Install @versatus/versatus-javascript)

Now with a brand new TypeScript project, you'll need the `@versatus/versatus-javascript` package:  

现在有了一个全新的 TypeScript 项目，您将需要 `@versatus/versatus-javascript` 包：

```bash
npm install --save @versatus/versatus-javascript
```

## 使用 lasrctl 初始化项目 (Initialize Project with lasrctl)

With this package installed, you can now initialize your project with the `npx lasrctl` command. We provide three templates to get you started: `blank`, `fungible` and `faucet`.  You may only have a single project initialized at one time.  

安装此软件包后，您现在可以使用`npx lasrctl`命令初始化项目。我们提供了三个模板来帮助您入门：`blank`、`fungible`和`faucet`。您一次只能初始化一个项目。

### LASR 模板 (LASR Templates)

| Template 模板    | Description 描述                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `blank`        | 从头开始的最小模板。A minimal template to start from scratch.                                            |
| `fungible`     | 用于创建可同质化代币的模板。A template for creating fungible tokens.                                         |
| `non-fungible` | 用于创建非同质化代币的模板。A template for creating non-fungible tokens.                                     |
| `faucet`       | 用于创建水龙头的模板，允许用户请求测试代币。A template for creating a faucet, allowing users to request test tokens. |

```bash
npx lasrctl init fungible # Choose blank, fungible, non-fungible or faucet
```

After initialization, you will now have an example program available in the `example-program.ts` file in the root of your project.  The init command also creates a folder with example JSON input for each method in the `inputs` folder.  

初始化后，您现在可以在项目根目录的`example-program.ts`文件中找到一个示。 init 命令还在`inputs`文件夹中创建一个文件夹，其中包含每个方法的示例 JSON 输入。

You can look and read these JSON files to see an example of what the protocol will send your program.  

您可以查看并阅读这些 JSON 文件，以查看协议将向您的程序发送的内容的示例。

## 构建你的程序 (Build Your Program)

Before you deploy your program, you must compile your TypeScript to JavaScript. This command uses Webpack to package your entire program into a single file that will be deployed to the network.  

在部署程序之前，必须将 TypeScript 编译为 JavaScript。此命令使用 Webpack 将整个程序打包到将部署到网络的单个文件中。

If you make a change to your TypeScript program, you must build it before you can deploy any changes to the network.  

如果您对 TypeScript 程序进行更改，则必须先构建它，然后才能将任何更改部署到网络。

```bash
npx lasrctl build example-program.ts
```

This command builds your TypeScript program and places the JavaScript output into the `./build` folder. You should not check the `./build` folder into source control.  

此命令构建您的 TypeScript 程序并将 JavaScript 输出放入`./build`文件夹中。您不应该将 `./build` 文件夹签入源代码管理。

## 测试你的程序 (Test Your Program)

With your program now built, you can use `npx lasrctl` to test how your program responds to sample JSON inputs that it may receive from the LASR protocol.  The sample input JSON files are in the `./inputs` folder.   

现在构建了您的程序，您可以使用`npx lasrctl`来测试您的程序如何响应可能从 LASR 协议接收的示例 JSON 输入。示例输入 JSON 文件位于`./inputs`文件夹中。

```bash
npx lasrctl test -b example-program -i inputs # folder where input JSON is stored
```

The test command loops over all of the JSON files in this folder and passes each of them into your program. The output is then returned to the terminal.  

测试命令循环遍历此文件夹中的所有 JSON 文件，并将每个文件传递到您的程序中。然后输出返回到终端。

If the tests pass correctly, you should see the following (there may be more tests depending on which example you initialized):  

如果测试正确通过，您应该看到以下内容（可能会有更多测试，具体取决于您初始化的示例）：

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

您的程序现在已准备好部署到 LASR 网络。

## 创建帐户并部署程序 (Create Account and Deploy Program)

### 本地密钥对 (Local Keypair)

The `npx lasrctl` command makes it as easy as possible to deploy programs to the LASR protocol.  If you do not have a set of local keys defined, it will create one and place it in the `.lasr/wallet/keypair.json` file.   

`npx lasrctl` 命令使将程序部署到 LASR 协议变得尽可能简单。如果您没有定义一组本地密钥，它将创建一个并将其放置在 `.lasr/wallet/keypair.json` 文件中。

🚨🚨🚨 **安全警报 SECURITY ALERT** 🚨🚨🚨

It is **CRUCIAL** to keep your `keypair.json` file secure at all times. This file contains sensitive information that can compromise the security of your account if it falls into the wrong hands.   

始终保持`keypair.json`文件的安全至关重要。该文件包含敏感信息，如果落入坏人之手，可能会危及您帐户的安全。

- **DO NOT** share this file with anyone.  
  **不要**与任何人共享此文件。
- **DO NOT** commit this file to public repositories.  
  **不要** 将此文件提交到公共存储库。
- Consider using secret management tools or services to store sensitive information securely.  
  考虑使用秘密管理工具或服务来安全地存储敏感信息。

Failure to secure your `keypair.json` file could result in unauthorized access to your account, leading to loss of funds or malicious deployment under your identity.  
如果无法保护您的`keypair.json`文件，可能会导致您的帐户遭到未经授权的访问，从而导致资金损失或以您的身份进行恶意部署。

🚨🚨🚨 **确保您的钥匙安全 KEEP YOUR KEYS SECURE** 🚨🚨🚨

### 部署您的程序 (Deploy Your Program)

The `npx lasrctl deploy` command makes it easy to deploy a program to the LASR protocol.  Here are the steps of what the deploy command performs:  

`npx lasrctl deploy` 命令可以轻松地将程序部署到 LASR 协议。以下是部署命令执行的步骤：

1. **Hits faucet to initialize the account because funds are needed to register a program**: Before deploying your program, it's essential to ensure that your account has the necessary funds to cover the deployment costs.  The LASR protocol requires that an account be funded before it can deployo a program. This is done to minimize spamming. The faucet is a source of test funds that initializes your account with a balance sufficient for registering your program on the network.  The LASR testnet does not require any fees to register a program.  
   **点击水龙头初始化帐户，因为注册程序需要资金**：在部署程序之前，必须确保您的帐户有必要的资金来支付部署费用。 LASR 协议要求在部署程序之前为帐户提供资金。这样做是为了最大限度地减少垃圾信息。水龙头是测试资金的来源，它用足够在网络上注册程序的余额来初始化您的帐户。 LASR 测试网不需要任何费用来注册。

2. **Deploys the program to IPFS**:  
    **将程序部署到IPFS**：
    - Upon deployment, your program's code is uploaded to the InterPlanetary File System (IPFS), a decentralized storage solution. This step is crucial for making your program accessible from anywhere in the network.  
      部署后，您的程序代码将上传到星际文件系统（IPFS），这是一种去中心化存储解决方案。此步骤对于使您的程序可以从网络中的任何位置访问至关重要。
    - **Gets a CID back**: After successful deployment to IPFS, you receive a Content Identifier (CID). The CID is a unique address that points to your program's code on IPFS, ensuring that it can be reliably accessed and executed.  
      **获取 CID**：成功部署到 IPFS 后，您会收到一个内容标识符 (CID)。 CID是一个唯一的地址，指向IPFS上您的程序代码，确保它可以被可靠地访问和执行。

3. **Registers the CID with LASR - get a program account**: With the CID in hand, the next step is to register it with the LASR Protocol. This process involves creating a program account associated with your CID. Registering your CID is a critical step as it links your program's code on IPFS to a specific account on the LASR protocol, making it executable on the network.  
   **向 LASR 注册 CID - 获取程序帐户**：有了 CID，下一步就是向 LASR 协议注册它。此过程涉及创建与您的 CID 关联的计划帐户。注册 CID 是关键的一步，因为它将 IPFS 上的程序代码链接到 LASR 协议上的特定帐户，使其可以在网络上执行。

4. **Deploys the program to the protocol (calls create method)**:  
   **将程序部署到协议（调用create方法）**：
    - The final step in the deployment process involves calling the `create` method, which officially deploys your program onto the LASR network. This step is where your program goes from being a piece of code to an active, executable entity on the network.  
      部署过程的最后一步涉及调用`create`方法，该方法将您的程序正式部署到 LASR 网络上。这一步是您的程序从一段代码转变为网络上活跃的可执行实体的过程。

When all of these steps successfully complete, you will receive the program address of your deployed program. This program address can now be interacted with as part of the LASR Network.  

当所有这些步骤成功完成后，您将收到已部署程序的程序地址。该程序地址现在可以作为 LASR 网络的一部分进行交互。

### 一切都是代币 (Everything is a Token)

Within the LASR protocol - everything is a token. When we deploy our program, we must specify the program name and token symbol, and then an initial supply of tokens.  You must supply these when you deploy your program via `npx lasrctl`  

在 LASR 协议中——一切都是令牌。当我们部署程序时，我们必须指定程序名称和代币符号，然后指定初始代币供应。当您通过`npx lasrctl`部署程序时，必须提供这些

### 部署命令示例 (Example Deployment Command)

```bash
npx lasrctl deploy --build example-program --author my-name --name my-token --programName MY_TOKEN --symbol MY_TOKEN --initializedSupply 1 --totalSupply 1
```

#### 部署参数 (Deploy Parameters)

Deploy a program 
部署一个程序

| Option                | Description                                          | Type    | Required | Default                                |
| --------------------- | ---------------------------------------------------- | ------- | -------- | -------------------------------------- |
| `--version`           | 显示版本号 Show version number                            | boolean | No       |                                        |
| `--help`              | 显示帮助  Show help                                      | boolean | No       |                                        |
| `--build`             | 正在构建的程序文件的名称  Name of the program file being built   | string  | Yes      |                                        |
| `--author`            | 合约作者  Author of the contract                         | string  | Yes      |                                        |
| `--name`              | 合约名称  Name of the contract                           | string  | Yes      |                                        |
| `--symbol`            | 程序的符号  Symbol for the program                        | string  | Yes      |                                        |
| `--programName`       | Name for the program                                 | string  | Yes      |                                        |
| `--initializedSupply` | 程序名称  Initial Supply of the Token                    | string  | Yes      |                                        |
| `--totalSupply`       | 要创建的代币的总供应量  Total supply of the token to be created | string  | Yes      |                                        |
| `--recipientAddress`  | 初始化供给的地址  Address for the initialized supply         | string  | No       |                                        |
| `--inputs`            | 程序的附加输入  Additional inputs for the program           | string  | No       |                                        |
| `--keypairPath`       | 密钥对文件的路径  Path to the keypair file                   | string  | No       | `./.lasr/wallet/keypair.json`          |
| `--secretKey`         | 钱包的秘密钥匙  Secret key for the wallet                   | string  | No       |                                        |
| `--target`            | 建立目标  Build target                                   | string  | No       | `node` (choices: "node" - _more soon_) |

Keep track of your program account id - this is the required key that you will need to interact with your program in later steps.  

跟踪您的程序帐户 ID - 这是您在后续步骤中与程序交互所需的密钥。

### 通过 CLI 与程序交互 (Interact with the Program via CLI)

With your program now deployed, you can begin interacting with it through the Command Line Interface (CLI). This interaction involves executing commands and transactions that demonstrate your program's functionality. The CLI provides a direct way to test and ensure that your program behaves as expected on the network.  

现在部署您的程序后，您可以开始通过命令行界面 (CLI) 与其交互。这种交互涉及执行演示程序功能的命令和交易。 CLI 提供了一种直接的方法来测试并确保您的程序在网络上的行为符合预期。

To start interacting with your deployed program through the CLI, use the following command structure:  

要开始通过 CLI 与部署的程序交互，请使用以下命令结构：

```bash
npx lasrctl call [params]
```

#### 呼叫命令选项 (Call Command Options)

To call a program method with the specified arguments, use the following options:  

要使用指定参数调用程序方法，请使用以下选项：

| Option 选项          | Description 描述                                    | Type 类型 | Required 需求 |
| ------------------ | ------------------------------------------------- | ------- | ----------- |
| `--version`        | 显示版本号 Show version number                         | boolean | No          |
| `--help`           | 显示帮助 Show help                                    | boolean | No          |
| `--programAddress` | 待发送的程序地址 Program address to be sent               | string  | Yes         |
| `--op`             | 程序要执行的操作 Operation to be performed by the program | string  | Yes         |
| `--inputs`         | 输入操作所需的json Input json required by the operation  | string  | Yes         |
| `--keypairPath`    | 密钥对文件的路径 Path to the keypair file                 | string  | No          |
| `--secretKey`      | 钱包的秘密钥匙 Secret key for the wallet                 | string  | No          |

The `--inputs` needs to be a string of JSON containing any of the custom parameters that your Program can accept and understand.  

`--inputs` 需要是一个 JSON 字符串，其中包含您的程序可以接受和理解的任何自定义参数。

#### 呼叫命令示例 (Example Call Command)

```bash
npx lasrctl call --programAddress <YOUR_PROGRAM_ADDRESS_FROM_DEPLOY> --op hello --inputs '{"name": "My Name"}'
```

## 水龙头 (Faucet)

The LASR Faucet is available at https://faucet.versatus.io  

LASR 水龙头可在 https://faucet.versatus.io 上获取

<img src="adding-private-key-to-wallet.gif">

Once you have set up the LASR Wallet with your keypair and deployed a program, you can now faucet yourself additional funds and more easily interact with your programs.  

一旦您使用密钥对设置了 LASR 钱包并部署了程序，您现在就可以为自己添加额外的资金并更轻松地与您的程序进行交互。

## 故障排除和反馈 (Troubleshooting and Feedback)

This is *ALPHA* software. It will break. We welcome feedback.  Please use Github Issues to report any issues and we will do our best to solve them for you.  

这是*ALPHA* 软件。它可能会出问题。我们欢迎反馈。请使用 Github Issues 报告任何问题，我们将尽力为您解决。

PR's are welcome.  

欢迎 PR。

If you're still having trouble, please contact us on [discord](https://discord.gg/versatus), [telegram](https://t.me/+4nJPCLdzGOUyMDQx), or [twitter](https://twitter.com/VersatusLabs) and we'll try to help you resolve the issue.  

如果您仍然遇到问题，请通过 [discord](https://discord.gg/versatus)、[telegram](https://t.me/+4nJPCLdzGOUyMDQx) 或 [twitter](https://twitter.com/VersatusLabs)，我们将尽力帮助您解决问题。
