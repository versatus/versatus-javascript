import { callCreate, getAddressFromKeyPairFile, getSecretKey, registerProgram, } from '../../lasrctrl/cli-helpers.js';
import { LASR_RPC_URL, VIPFS_ADDRESS } from '../../lib/consts.js';
import { runCommand } from '../../lasrctrl/shell.js';
export const deployCommandFlags = (yargs) => {
    return yargs
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
        alias: 'pn',
    })
        .option('initializedSupply', {
        describe: 'Supply of the token to be sent to either the caller or the program',
        type: 'string',
        demandOption: true,
        alias: 'is',
    })
        .option('totalSupply', {
        describe: 'Total supply of the token to be created',
        type: 'string',
        demandOption: true,
        alias: 'ts',
    })
        .option('recipientAddress', {
        describe: 'Address for the initialized supply',
        type: 'string',
        alias: 'ra',
    })
        .option('inputs', {
        describe: 'Additional inputs for the program',
        type: 'string',
        alias: 'i',
    })
        .option('keypairPath', {
        describe: 'Path to the keypair file',
        type: 'string',
        default: './.lasr/wallet/keypair.json',
    })
        .option('secretKey', {
        describe: 'Secret key for the wallet',
        type: 'string',
    })
        .option('target', {
        describe: 'Build target',
        type: 'string',
        choices: ['node', 'wasm'],
        default: 'node',
        alias: 't',
    });
};
const deploy = async (argv) => {
    try {
        const secretKey = await getSecretKey(argv.keypairPath, argv.secretKey);
        const addressFromKeypair = await getAddressFromKeyPairFile(String(argv.keypairPath));
        console.log('\x1b[0;33mPublishing program...\x1b[0m');
        const isWasm = argv.target === 'wasm';
        process.env.LASR_RPC_URL = LASR_RPC_URL;
        process.env.VIPFS_ADDRESS = VIPFS_ADDRESS;
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
          build/lasr_cli publish --author ${argv.author} --name ${argv.name} --package-path build/lib --entrypoint build/lib/example-program.js -r --remote ${VIPFS_ADDRESS} --runtime ${argv.target} --content-type program --from-secret-key --secret-key "${secretKey}"`;
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
        console.log(`Fauceted funds to \x1b[0;32m${argv.recipientAddress ?? addressFromKeypair}\x1b[0m`);
        console.log('\x1b[0;33mRegistering program...\x1b[0m');
        let registerResponse;
        let attempts = 0;
        const maxAttempts = 5; // Maximum number of attempts
        while (!registerResponse && attempts < maxAttempts) {
            try {
                registerResponse = await registerProgram(cid, secretKey);
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
        const createResponse = await callCreate(programAddress, String(argv.symbol), String(argv.programName), String(argv.initializedSupply), String(argv.totalSupply), String(argv.recipientAddress ?? addressFromKeypair), secretKey, argv.inputs);
        if (createResponse) {
            console.log(`Program created successfully.
==> programAddress: \x1b[0;32m${programAddress}\x1b[0m
==> symbol: \x1b[0;32m${argv.symbol}\x1b[0m
==> tokenName: \x1b[0;32m${argv.programName}\x1b[0m
==> initializedSupply: \x1b[0;32m${argv.initializedSupply}\x1b[0m
==> totalSupply: \x1b[0;32m${argv.totalSupply}\x1b[0m
==> recipientAddress: \x1b[0;32m${argv.recipientAddress ?? addressFromKeypair}\x1b[0m
          `);
        }
    }
    catch (error) {
        console.error(`Deployment error: ${error}`);
    }
};
export default deploy;
