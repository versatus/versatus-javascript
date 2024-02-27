import fs, { promises as fsp } from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { runCommand } from './shell.js';
import { LASR_RPC_URL, VIPFS_ADDRESS } from './consts.js';
export const isInstalledPackage = fs.existsSync(path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript'));
export const isTypeScriptProject = () => {
    const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
    return fs.existsSync(tsConfigPath);
};
export const installedPackagePath = path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript');
export function copyDirectory(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);
        entry.isDirectory()
            ? copyDirectory(srcPath, destPath)
            : fs.copyFileSync(srcPath, destPath);
    }
}
export async function buildNode(pathToProgram, buildPath) {
    console.log('BUILDING NODE PROGRAM!');
    const nodeWrapperPath = path.join('./build/lib', pathToProgram);
    const nodeMapWrapperPath = path.join('./build/lib', `${pathToProgram}.map`);
    const parcelCache = './parcel-cache';
    if (fs.existsSync(parcelCache)) {
        fs.rmSync(parcelCache, { recursive: true });
        console.log('Existing .parcel-cache deleted.');
    }
    if (fs.existsSync(nodeWrapperPath)) {
        fs.unlinkSync(nodeWrapperPath);
        console.log('Existing node-wrapper.js deleted.');
    }
    if (fs.existsSync(nodeMapWrapperPath)) {
        fs.unlinkSync(nodeMapWrapperPath);
        console.log('Existing node-wrapper.js.map deleted.');
    }
    const parcelCommand = `npx parcel build  --target node ${pathToProgram} --no-cache`;
    exec(parcelCommand, (tscError, tscStdout, tscStderr) => {
        if (tscError) {
            console.error(`Error during TypeScript transpilation: ${tscError}`);
            return;
        }
        console.log('\x1b[0;37mTranspilation complete. Proceeding with build...\x1b[0m');
    });
}
export async function getSecretKeyFromKeyPairFile(keypairFilePath) {
    try {
        console.log('Getting secret key from keypair file');
        const absolutePath = path.resolve(keypairFilePath); // Ensure the path is absolute
        const fileContent = await fsp.readFile(absolutePath, 'utf8');
        const keyPairs = JSON.parse(fileContent);
        if (keyPairs.length > 0) {
            return keyPairs[0].secret_key;
        }
        else {
            new Error('No keypairs found in the specified file.');
            return '';
        }
    }
    catch (error) {
        console.error(`Failed to retrieve the secret key: ${error}`);
        throw error;
    }
}
export async function registerProgram(cid, secretKey) {
    const command = `export LASR_RPC_URL=${LASR_RPC_URL} && export VIPFS_ADDRESS=${VIPFS_ADDRESS} && ./build/lasr_cli wallet register-program --from-secret-key --secret-key "${secretKey}" --cid "${cid}"`;
    console.log(command);
    return await runCommand(command);
}
export async function publishProgram(author, name, target = 'node', secretKey) {
    if (!author || !name) {
        throw new Error('Author and name are required to publish a program.');
    }
    console.log('NAME NAME NAME NAME NAME');
    console.log(`NAME NAME ${name} NAME NAME`);
    console.log('NAME NAME NAME NAME NAME');
    const isWasm = target === 'wasm';
    process.env.LASR_RPC_URL = 'http://lasr-sharks.versatus.io:9292';
    process.env.VIPFS_ADDRESS = '167.99.20.121:5001';
    let command;
    if (isWasm) {
        command = `export VIPFS_ADDRESS=${VIPFS_ADDRESS} && ./build/versatus-wasm publish -a ${author} -n ${name} -v 0 -w build/build.wasm -r --is-srv true`;
    }
    else {
        command = `build/lasr_cli publish --author ${author} --name ${name} --verbose --package-path build/${isWasm ? '' : 'lib'} --entrypoint build/lib/node-wrapper.js -r --remote ${VIPFS_ADDRESS} --runtime ${target} --content-type program --from-secret-key --secret-key "${secretKey}"`;
    }
    console.log(command);
    const output = await runCommand(command);
    const ipfsHashMatch = output.match(/(bafy[a-zA-Z0-9]{44,59})/);
    if (!ipfsHashMatch)
        throw new Error('Failed to extract CID from publish output.');
    console.log(`Program published with CID: ${ipfsHashMatch[1]}`);
    return ipfsHashMatch[1];
}
export function runTestProcess(inputJsonPath, target = 'node') {
    return new Promise((resolve, reject) => {
        let scriptDir = isInstalledPackage ? installedPackagePath : process.cwd();
        const testScriptPath = path.resolve(scriptDir, 'lib', 'scripts', target === 'node' ? 'test-node.sh' : 'test-wasm.sh');
        const testProcess = spawn('bash', [testScriptPath, inputJsonPath], {
            stdio: ['inherit', 'inherit', 'pipe'], // Capture stderr to use in the promise
        });
        let errorOutput = '';
        testProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        testProcess.on('error', (error) => {
            reject(`Spawn error: ${error}`);
        });
        testProcess.on('exit', (code) => {
            if (code !== 0) {
                reject(`Exited with code ${code}: ${errorOutput}`);
            }
            else {
                resolve(`Test for ${inputJsonPath} passed`);
            }
        });
    });
}
export async function initializeWallet() {
    await runCommand('./build/lasr_cli wallet new --save');
    console.log('Wallet initialized and keypair.json created at ./.lasr/wallet/keypair.json');
}
export async function checkWallet(keypairPath) {
    try {
        console.log('Checking wallet...');
        const command = `./build/lasr_cli wallet get-account --from-file --path ${keypairPath}`;
        const output = await runCommand(command);
        console.log('Wallet check successful');
    }
    catch (error) {
        // Handle specific error messages or take actions based on the error
        console.error('Failed to validate keypair file:', error);
        process.exit(1); // Exit the process if the keypair file is not valid or other errors occur
    }
}
