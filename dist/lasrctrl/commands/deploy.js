import { callCreate, getAddressFromKeyPairFile, getSecretKey, registerProgram, runTestProcess, } from '../../lasrctrl/cli-helpers.js';
import { VIPFS_URL } from '../../lib/consts.js';
import { runCommand } from '../../lasrctrl/shell.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { getIPFSForNetwork, getRPCForNetwork } from '../../lib/utils.js';
export const deployCommandFlags = (yargs) => {
    return yargs
        .option('build', {
        describe: 'Filename of the built program to be deployed. Example: "example-program"',
        type: 'string',
        demandOption: true,
        alias: 'b',
    })
        .option('author', {
        describe: 'Author of the contract',
        type: 'string',
        demandOption: true,
        alias: 'a',
    })
        .option('name', {
        describe: 'Name of the contract',
        type: 'string',
        demandOption: true,
        alias: 'n',
    })
        .option('symbol', {
        describe: 'Symbol for the program',
        type: 'string',
        demandOption: true,
        alias: 's',
    })
        .option('programName', {
        describe: 'Name for the program',
        type: 'string',
        demandOption: true,
        alias: 'p',
    })
        .option('initializedSupply', {
        describe: 'Supply of the token to be sent to either the caller or the program',
        type: 'string',
        demandOption: true,
    })
        .option('totalSupply', {
        describe: 'Total supply of the token to be created',
        type: 'string',
        demandOption: true,
        alias: 't',
    })
        .option('recipientAddress', {
        describe: 'Address for the initialized supply',
        type: 'string',
        alias: 'r',
    })
        .option('createTestFilePath', {
        describe: 'Path to the create test json file',
        type: 'string',
        demandOption: true,
    })
        .option('txInputs', {
        describe: 'Additional inputs for the program',
        type: 'string',
        default: '{}',
    })
        .option('keypairPath', {
        describe: 'Path to the keypair file',
        type: 'string',
        default: './.lasr/wallet/keypair.json',
    })
        .option('secretKey', {
        describe: 'Secret key for the wallet',
        type: 'string',
        alias: 'k',
    })
        .option('network', {
        describe: 'Network',
        type: 'string',
        choices: ['stable', 'unstable'],
        default: 'stable',
        alias: 'x',
    });
};
const deploy = async (argv) => {
    try {
        const secretKey = await getSecretKey(argv.keypairPath, argv.secretKey);
        const addressFromKeypair = await getAddressFromKeyPairFile(String(argv.keypairPath));
        const network = argv.network;
        console.log(`\x1b[0;33mCreating temporary test file for ${argv.build} against cli arguments...\x1b[0m`);
        // const inputsDirPath = path.join(process.cwd(), `${argv.build}-inputs`)
        // const files = await fs.readdir(inputsDirPath)
        // const createJsonFiles = files.filter((file) => file.endsWith('create.json'))
        // if (createJsonFiles.length === 0) {
        //   throw new Error('No suitable create.json file found.')
        // }
        // Assuming there should only be one such file, or you want the first one if there are multiple
        // const createJsonFileName = createJsonFiles[0]
        // Construct the full path to the found JSON file
        // const existingJsonFilePath = path.join(
        //   inputsDirPath,
        //   argv.createTestFilePath
        // )
        if (!argv.createTestFilePath) {
            throw new Error('No suitable create.json file found.');
        }
        const fileContents = await fs.readFile(argv.createTestFilePath, 'utf8');
        const testJson = JSON.parse(fileContents);
        if (!argv.txInputs) {
            throw new Error('no inputs provided');
        }
        // Assuming argv.txInputs is a JSON string, parse it
        const inputs = JSON.parse(argv.txInputs);
        const inputsPayload = {
            ...inputs,
            symbol: argv.symbol,
            name: argv.programName,
            initializedSupply: argv.initializedSupply,
            totalSupply: argv.totalSupply,
        };
        console.log('inputsPayload', inputsPayload);
        if (argv.recipientAddress) {
            inputsPayload.to = argv.recipientAddress;
        }
        // Update the transactionInputs in the testJson object
        testJson.transaction.transactionInputs = JSON.stringify(inputsPayload);
        // Create a temporary file to write the updated JSON
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, `temp-create-input-${Date.now()}.json`);
        if (!argv.build) {
            throw new Error('Build not found in arguments.');
        }
        await fs.writeFile(tempFilePath, JSON.stringify(testJson, null, 2), 'utf8');
        await runTestProcess(argv.build, tempFilePath, 'node', false);
        console.log('\x1b[0;33mCreate method testing complete...\x1b[0m');
        console.log('\x1b[0;33mPublishing program...\x1b[0m');
        const isWasm = argv.target === 'wasm';
        process.env.LASR_RPC_URL = getRPCForNetwork(network);
        process.env.VIPFS_ADDRESS = getIPFSForNetwork(network);
        let command;
        if (isWasm) {
            command = `
          build/versatus-wasm publish \n
            -a ${argv.author} \n
             -n ${argv.name} \n
             -v 0 \n
             -w build/build.wasm \n 
             -r \n
             --is-srv true`;
        }
        else {
            command = `
          build/lasr_cli publish --author ${argv.author} --name ${argv.name} --package-path build/lib --entrypoint build/lib/${argv.build}.js -r --remote ${VIPFS_URL} --runtime node --content-type program --from-secret-key --secret-key "${secretKey}"`;
        }
        const output = await runCommand(command);
        const cidPattern = /(bafy[a-zA-Z0-9]{44,59})/g;
        const ipfsHashMatch = output.match(cidPattern);
        if (!ipfsHashMatch)
            throw new Error('Failed to extract CID from publish output.');
        console.log(`\x1b[0;32mProgram published.\x1b[0m
==> cid: ${ipfsHashMatch[ipfsHashMatch.length - 1]}`);
        const cid = ipfsHashMatch[ipfsHashMatch.length - 1];
        console.log('\x1b[0;33mChecking wallet...\x1b[0m');
        // await checkWallet(String(argv.recipientAddress ?? addressFromKeypair))
        console.log('\x1b[0;33mRegistering program...\x1b[0m');
        let registerResponse;
        let attempts = 0;
        const maxAttempts = 5;
        while (!registerResponse && attempts < maxAttempts) {
            try {
                registerResponse = await registerProgram(cid, secretKey, network);
                if (registerResponse) {
                    console.log('Registration successful');
                }
            }
            catch (error) {
                console.error(error);
                console.log('\x1b[0;33mRegistration failed. Retrying...\x1b[0m');
                attempts++;
                if (attempts >= maxAttempts) {
                    console.log('\x1b[0;31mMax registration attempts reached. Aborting.\x1b[0m');
                    throw new Error('Failed to register the program.');
                }
                else {
                    // Optional: implement a delay between retries if desired
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // waits 1 second
                }
            }
        }
        if (!registerResponse)
            throw new Error('Failed to register the program.');
        const programAddressMatch = registerResponse.match(/"program_address":\s*"(0x[a-fA-F0-9]{40})"/);
        if (!programAddressMatch)
            throw new Error('Failed to extract program address from the output.');
        const programAddress = programAddressMatch[1];
        console.log(`Program registered.
==> programAddress: \x1b[0;32m${programAddress}\x1b[0m`);
        console.log('\x1b[0;33mCreating program...\x1b[0m');
        const createResponse = await callCreate(programAddress, String(argv.symbol), String(argv.programName), String(argv.initializedSupply), String(argv.totalSupply), String(argv.recipientAddress ?? programAddress), network, secretKey, argv.txInputs);
        if (createResponse) {
            console.log(`Program created successfully.
==> programAddress: \x1b[0;32m${programAddress}\x1b[0m
==> symbol: \x1b[0;32m${argv.symbol}\x1b[0m
==> network: \x1b[0;32m${argv.network}\x1b[0m
==> tokenName: \x1b[0;32m${argv.programName}\x1b[0m
==> initializedSupply: \x1b[0;32m${argv.initializedSupply}\x1b[0m
==> totalSupply: \x1b[0;32m${argv.totalSupply}\x1b[0m
==> recipientAddress: \x1b[0;32m${argv.recipientAddress ?? addressFromKeypair}\x1b[0m
======
======
======
======
>>>>>>>>>>> View Program on LASR Playground:
https://faucet.versatus.io/programs/${programAddress}
          
          `);
        }
    }
    catch (error) {
        console.error(`Deployment error: ${error}`);
    }
};
export default deploy;
