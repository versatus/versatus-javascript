#!/usr/bin/env node
import yargs from 'yargs';
import { promises as fsp } from 'fs';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { runSpawn } from './lib/utils.js';
import { checkWallet, copyDirectory, getSecretKeyFromKeyPairFile, initializeWallet, installedPackagePath, isInstalledPackage, isTypeScriptProject, publishProgram, registerProgram, runBuildProcess, runTestProcess, } from './lib/cli-helpers.js';
export const __dirname = path.dirname(fileURLToPath(import.meta.url));
const initCommand = (yargs) => {
    return yargs.positional('example', {
        describe: 'The example contract to initialize',
        type: 'string',
        choices: ['fungible-token'],
        demandOption: true,
    });
};
const buildCommand = (yargs) => {
    return yargs
        .positional('file', {
        describe: 'Contract file to include in the build',
        type: 'string',
    })
        .positional('target', {
        describe: 'Build target',
        type: 'string',
        choices: ['node', 'wasm'],
        default: 'node',
    });
};
const testCommand = (yargs) => {
    return yargs.option('inputJson', {
        describe: 'Path to the JSON input file or directory containing JSON files for testing',
        type: 'string',
        demandOption: true,
    });
};
const deployCommand = (yargs) => {
    return yargs
        .option('author', {
        describe: 'Author of the contract',
        type: 'string',
        demandOption: true,
    })
        .option('name', {
        describe: 'Name of the contract',
        type: 'string',
        demandOption: true,
    })
        .option('keypairPath', {
        describe: 'Path to the keypair file',
        type: 'string',
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
    });
};
yargs(process.argv.slice(2))
    .command('init [example]', 'Initialize a project with an example contract', initCommand, (argv) => {
    console.log('\x1b[0;33mInitializing example contract...\x1b[0m');
    const isTsProject = isTypeScriptProject();
    const exampleDir = isInstalledPackage
        ? path.resolve(installedPackagePath, isTsProject ? '' : 'dist', 'examples', argv.example || 'fungible-token')
        : path.resolve(isTsProject ? process.cwd() : __dirname, 'examples', argv.example || 'fungible-token');
    const targetDir = process.cwd();
    const targetFilePath = path.join(targetDir, isTsProject ? 'example-contract.ts' : 'example-contract.js');
    fs.copyFileSync(path.join(exampleDir, isTsProject ? 'example-contract.ts' : 'example-contract.js'), targetFilePath);
    let exampleContractContent = fs.readFileSync(targetFilePath, 'utf8');
    // Update the import path for any contract class based on the environment
    const contractClassRegEx = /^import \{ (.*) \} from '.*\/lib\/classes\/contracts\/.*'*$/gm;
    exampleContractContent = exampleContractContent.replace(contractClassRegEx, (match, className) => {
        const importPath = isInstalledPackage
            ? `'@versatus/versatus-javascript'`
            : `'./lib/classes/contracts/${className}'`;
        return `import { ${className} } from ${importPath};`;
    });
    if (isTsProject) {
        const typesRegex = /^import \{ (.*) \} from '.*\/lib'$/gm;
        exampleContractContent = exampleContractContent.replace(typesRegex, (match, className) => {
            const importPath = isInstalledPackage
                ? `'@versatus/versatus-javascript'`
                : `'./lib'`;
            return `import { ${className} } from ${importPath};`;
        });
    }
    // Write the updated content back to the example file
    fs.writeFileSync(targetFilePath, exampleContractContent, 'utf8');
    const inputsDir = path.join(isInstalledPackage ? installedPackagePath : process.cwd(), 'examples', argv.example || 'fungible-token', 'inputs');
    const targetInputsDir = path.join(targetDir, 'inputs');
    if (fs.existsSync(inputsDir)) {
        if (!fs.existsSync(targetInputsDir)) {
            fs.mkdirSync(targetInputsDir);
        }
        fs.readdirSync(inputsDir).forEach((file) => {
            const srcFile = path.join(inputsDir, file);
            const destFile = path.join(targetInputsDir, file);
            try {
                fs.copyFileSync(srcFile, destFile);
            }
            catch (error) {
                console.error(`Error copying file ${srcFile} to ${destFile}:`, error);
            }
        });
    }
    if (isInstalledPackage) {
        const filesDir = path.join(installedPackagePath, 'dist', 'lib');
        const targetFilesDir = path.join(targetDir, 'build', 'lib');
        if (!fs.existsSync(targetFilesDir)) {
            fs.mkdirSync(targetFilesDir, { recursive: true });
        }
        copyDirectory(filesDir, targetFilesDir);
    }
    console.log('\x1b[0;37mExample contract and inputs initialized successfully.\x1b[0m');
    console.log();
    console.log(`\x1b[0;35mReady to run:\x1b[0m`);
    console.log(`\x1b[0;33mvsjs build example-contract${isTsProject ? '.ts' : '.js'}\x1b[0m`);
    console.log();
    console.log();
})
    .command('build [file]', 'Build the project with the specified contract', buildCommand, (argv) => {
    let scriptDir, sysCheckScriptPath;
    if (isInstalledPackage) {
        scriptDir = installedPackagePath;
        sysCheckScriptPath = path.resolve(scriptDir, 'lib', 'scripts', 'sys_check.sh');
    }
    else {
        // In the development environment
        scriptDir = path.resolve(__dirname, '../');
        sysCheckScriptPath = path.resolve(scriptDir, 'lib', 'scripts', 'sys_check.sh');
    }
    console.log(`\x1b[0;37mRunning system check script: ${sysCheckScriptPath}\x1b[0m`);
    exec(`bash "${sysCheckScriptPath}"`, (sysCheckError, sysCheckStdout, sysCheckStderr) => {
        if (sysCheckError) {
            console.error(`Error during system check: ${sysCheckError}`);
            return;
        }
        console.log(sysCheckStdout); // Output from sys_check.sh
        if (sysCheckError) {
            console.error(`Error during system check: ${sysCheckError}`);
            return;
        }
        console.log('\x1b[0;37mSystem check passed. Proceeding with build...\x1b[0m');
        // Proceed with build process if system check is successful
        if (argv.file) {
            console.log('\x1b[0;37mStarting build...\x1b[0m');
            const filePath = path.resolve(process.cwd(), argv.file);
            if (filePath.endsWith('.ts')) {
                console.log('\x1b[0;37mTypeScript file detected. Transpiling...\x1b[0m');
                const outDir = path.resolve(process.cwd(), 'build');
                const command = isInstalledPackage
                    ? `tsc --outDir ${outDir} ${filePath}`
                    : 'tsc && chmod +x dist/cli.js && node dist/lib/scripts/add-extensions.js';
                // Run tsc to transpile the TypeScript file
                exec(command, (tscError, tscStdout, tscStderr) => {
                    if (tscError) {
                        console.error(`Error during TypeScript transpilation: ${tscError}`);
                        return;
                    }
                    console.log('\x1b[0;37mTranspilation complete. Proceeding with build...\x1b[0m');
                    injectFileInWrapper(filePath, argv.target)
                        .then(() => {
                        runBuildProcess(argv.target);
                    })
                        .catch((error) => {
                        console.error('Error during the build process:', error);
                    });
                });
            }
            else {
                injectFileInWrapper(filePath, argv.target)
                    .then(() => {
                    runBuildProcess(argv.target);
                })
                    .catch((error) => {
                    console.error('Error during the build process:', error);
                });
            }
        }
        else {
            console.error('You must specify a contract file to build.');
            process.exit(1);
        }
    });
})
    .command('test [inputJson]', 'Run the test suite for the project', testCommand, async (argv) => {
    // Make this function async
    if (argv.inputJson) {
        const inputPath = path.resolve(process.cwd(), argv.inputJson);
        try {
            const stats = await fsp.stat(inputPath);
            let scriptDir;
            if (isInstalledPackage) {
                scriptDir = installedPackagePath;
            }
            else {
                scriptDir = process.cwd(); // In the development environment
            }
            let target;
            const checkWasmScriptPath = path.resolve(scriptDir, 'lib', 'scripts', 'check_cli.sh');
            // Assuming spawn is wrapped in a function that returns a Promise
            await runSpawn('bash', [checkWasmScriptPath], { stdio: 'inherit' });
            if (fs.existsSync('./build/lib/node-wrapper.js')) {
                target = 'node';
            }
            else if (fs.existsSync('./build/build.wasm')) {
                target = 'wasm';
                const checkWasmScriptPath = path.resolve(scriptDir, 'lib', 'scripts', 'check_wasm.sh');
                // Assuming spawn is wrapped in a function that returns a Promise
                await runSpawn('bash', [checkWasmScriptPath], { stdio: 'inherit' });
            }
            else {
                new Error('No build artifacts found.');
            }
            console.log('\x1b[0;37mStarting test...\x1b[0m');
            if (stats.isDirectory()) {
                const files = await fsp.readdir(inputPath);
                for (let file of files) {
                    if (path.extname(file) === '.json') {
                        const filePath = path.join(inputPath, file);
                        // Ensure runTestProcess is an async function or returns a Promise
                        await runTestProcess(filePath, target);
                    }
                }
            }
            else if (stats.isFile()) {
                // Ensure runTestProcess is an async function or returns a Promise
                await runTestProcess(inputPath, target);
            }
            else {
                console.error('The input path is neither a file nor a directory.');
                process.exit(1);
            }
        }
        catch (err) {
            // @ts-ignore
            console.error(`Error: ${err.message}`);
            process.exit(1);
        }
    }
    else {
        console.error('You must specify an inputJson path to test with.');
        process.exit(1);
    }
})
    .command('deploy [author] [name] [keypairPath] [secretKey] [target]', 'Deploy a contract', deployCommand, async (argv) => {
    try {
        if (!argv.secretKey) {
            console.log('NO SECRET KEY!');
            if (!argv.keypairPath) {
                console.log('\x1b[0;33mInitializing wallet...\x1b[0m');
                await initializeWallet();
            }
        }
        else if (argv.keypairPath) {
            console.log('\x1b[0;33mUsing existing keypair...\x1b[0m');
            await checkWallet(String(argv.keypairPath));
        }
        let secretKey;
        if (argv.secretKey) {
            secretKey = String(argv.secretKey);
        }
        else {
            const keypairPath = './.lasr/wallet/keypair.json';
            secretKey = await getSecretKeyFromKeyPairFile(String(keypairPath));
        }
        console.log('\x1b[0;33mPublishing program...\x1b[0m');
        // @ts-ignore
        const cid = await publishProgram(String(argv.author), String(argv.name), String(argv.target), secretKey);
        console.log('\x1b[0;33mRegistering program...\x1b[0m');
        const response = await registerProgram(cid, secretKey);
        console.log(response);
    }
    catch (error) {
        console.error(`Deployment error: ${error}`);
    }
})
    .help().argv;
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
        wrapperContent = wrapperContent.replace(/^import start from '.*';?$/m, `import start from './dist/example-contract.js.js.js';`);
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
