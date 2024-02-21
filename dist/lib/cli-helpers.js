import fs, { promises as fsp } from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { runCommand } from './utils.js';
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
export async function buildNode(buildPath) {
    console.log('BUILDING NODE!');
    const nodeWrapperPath = path.join('./build/lib', 'node-wrapper.js');
    const nodeMapWrapperPath = path.join('./build/lib', 'node-wrapper.js.map');
    if (fs.existsSync(nodeWrapperPath)) {
        fs.unlinkSync(nodeWrapperPath);
        console.log('Existing node-wrapper.js deleted.');
    }
    if (fs.existsSync(nodeMapWrapperPath)) {
        fs.unlinkSync(nodeMapWrapperPath);
        console.log('Existing node-wrapper.js.map deleted.');
    }
    const parcelCommand = `npx parcel build  --target node ./lib/node-wrapper.ts`;
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
    return await runCommand(`export LASR_RPC_URL=${LASR_RPC_URL} && export VIPFS_ADDRESS=${VIPFS_ADDRESS} && ./build/lasr_cli wallet register-program  --from-secret-key --secret-key "${secretKey}" --cid "${cid}"`);
}
export async function publishProgram(author, name, target = 'node', secretKey) {
    if (!author || !name) {
        throw new Error('Author and name are required to publish a contract.');
    }
    const isWasm = target === 'wasm';
    let command;
    if (isWasm) {
        command = `export VIPFS_ADDRESS=${VIPFS_ADDRESS} && ./build/versatus-wasm publish -a ${author} -n ${name} -v 0 -w build/build.wasm -r --is-srv true`;
    }
    else {
        command = `export LASR_RPC_URL=${LASR_RPC_URL} && export VIPFS_ADDRESS=${VIPFS_ADDRESS} && ./build/lasr_cli publish --author ${author} --name ${name} --package-path build/${isWasm ? '' : 'lib'} --entrypoint build/lib/node-wrapper.js --remote ${VIPFS_ADDRESS} --runtime ${target} --content-type program --from-secret-key --secret-key "${secretKey}" --api-version 1`;
    }
    console.log(command);
    const output = await runCommand(command);
    const ipfsHashMatch = output.match(/(bafy[a-zA-Z0-9]{44,59})/);
    if (!ipfsHashMatch)
        throw new Error('Failed to extract CID from publish output.');
    console.log(`Contract published with CID: ${ipfsHashMatch[1]}`);
    return ipfsHashMatch[1];
}
export async function injectFileInWrapper(filePath, target = 'node') {
    const projectRoot = process.cwd();
    const buildPath = path.join(projectRoot, 'build');
    const buildLibPath = path.join(projectRoot, 'build', 'lib');
    if (!fs.existsSync(buildLibPath)) {
        fs.mkdirSync(buildLibPath, { recursive: true });
    }
    let wrapperFilePath;
    if (target === 'node') {
        let contractFilePath;
        if (isTypeScriptProject()) {
            if (isInstalledPackage) {
            }
            else {
                contractFilePath = './dist/example-contract.js';
                if (fs.existsSync(contractFilePath)) {
                    console.log('The contract file exists.');
                }
                else {
                    console.log('The contract file does not exist. You must build first.');
                }
            }
        }
        if (isInstalledPackage) {
            try {
                wrapperFilePath =
                    'node_modules/@versatus/versatus-javascript/dist/lib/node-wrapper.js';
            }
            catch (error) {
                console.error('Error locating node-wrapper.js in node_modules:', error);
                throw error;
            }
        }
        else {
            console.log('IN DEVELOPMENT ENVIRONMENT');
            wrapperFilePath = path.resolve(__dirname, './lib/node-wrapper.js');
        }
        const distWrapperFilePath = path.join(buildPath, 'lib', 'node-wrapper.js');
        fs.copyFileSync(wrapperFilePath, distWrapperFilePath);
        let wrapperContent = fs.readFileSync(wrapperFilePath, 'utf8');
        wrapperContent = wrapperContent.replace(/^import start from '.*';?$/m, `import start from './dist/example-contract.js.js';`);
        return fs.promises.writeFile(distWrapperFilePath, wrapperContent, 'utf8');
    }
    else if (target === 'wasm') {
        let versatusHelpersFilepath = path.resolve(process.cwd(), './lib/versatus');
        if (isInstalledPackage) {
            try {
                wrapperFilePath =
                    'node_modules/@versatus/versatus-javascript/dist/lib/wasm-wrapper.js';
                versatusHelpersFilepath =
                    'node_modules/@versatus/versatus-javascript/dist/lib/versatus.js';
            }
            catch (error) {
                console.error('Error locating wasm-wrapper.js in node_modules:', error);
                throw error;
            }
        }
        else {
            console.log('IN DEVELOPMENT ENVIRONMENT');
            // In the development environment
            wrapperFilePath = path.resolve(__dirname, './lib/wasm-wrapper.js');
            versatusHelpersFilepath = path.resolve(__dirname, './lib/versatus.js');
        }
        // Copy the wrapper file to the build directory
        const distWrapperFilePath = path.join(buildPath, 'lib', 'wasm-wrapper.js');
        fs.copyFileSync(wrapperFilePath, distWrapperFilePath);
        const versatusWrapperFilePath = path.join(buildPath, 'lib', 'versatus.js');
        fs.copyFileSync(versatusHelpersFilepath, versatusWrapperFilePath);
        try {
            let wrapperContent = fs.readFileSync(wrapperFilePath, 'utf8');
            wrapperContent = wrapperContent.replace(/^import start from '.*';?$/m, `import start from '${filePath}';`);
            wrapperContent = wrapperContent.replace(/from '.*versatus';?$/m, `from '${versatusWrapperFilePath}.js'`);
            return fs.promises.writeFile(distWrapperFilePath, wrapperContent, 'utf8');
        }
        catch (error) {
            console.error('Error updating wrapper.js in dist:', error);
            throw error;
        }
    }
}
export async function runTestProcess(inputJsonPath, target = 'node') {
    let scriptDir;
    if (isInstalledPackage) {
        scriptDir = installedPackagePath;
    }
    else {
        scriptDir = process.cwd();
    }
    const testScriptPath = path.resolve(scriptDir, 'lib', 'scripts', target === 'node' ? 'test-node.sh' : 'test-wasm.sh');
    const testProcess = spawn('bash', [testScriptPath, inputJsonPath], {
        stdio: 'inherit',
    });
    testProcess.on('error', (error) => {
        console.error(`test-wasm.sh spawn error: ${error}`);
    });
    testProcess.on('exit', (code) => {
        if (code !== 0) {
            console.error(`test-wasm.sh exited with code ${code}`);
        }
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
