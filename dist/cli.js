#!/usr/bin/env node
import yargs from 'yargs';
import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isInstalledPackage = fs.existsSync(path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript'));
const installedPackagePath = path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript');
function copyDirectory(src, dest) {
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
const isTypeScriptProject = () => {
    const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
    return fs.existsSync(tsConfigPath);
};
const argv = yargs(process.argv.slice(2))
    .command('init [example]', 'Initialize a project with an example contract', (yargs) => {
    return yargs.positional('example', {
        describe: 'The example contract to initialize',
        type: 'string',
        choices: ['fungible-token'],
        demandOption: true,
        demand: 'You must specify an example contract to initialize',
    });
}, (argv) => {
    console.log('\x1b[0;33mInitializing example contract...\x1b[0m');
    const isTsProject = isTypeScriptProject();
    const exampleDir = isInstalledPackage
        ? path.resolve(installedPackagePath, isTsProject ? '' : 'dist', 'examples', argv.example || 'fungible-token')
        : path.resolve(isTsProject ? process.cwd() : __dirname, 'examples', argv.example || 'fungible-token');
    const targetDir = process.cwd();
    const targetFilePath = path.join(targetDir, isTsProject ? 'example-contract.ts' : 'example-contract.js');
    // Copy the example file to the target directory
    fs.copyFileSync(path.join(exampleDir, isTsProject ? 'example-contract.ts' : 'example-contract.js'), targetFilePath);
    let exampleContractContent = fs.readFileSync(targetFilePath, 'utf8');
    // Update the import path for any contract class based on the environment
    const contractClassRegEx = /^import \{ (.*) \} from '.*\/lib\/contracts\/.*'$/gm;
    console.log({ isInstalledPackage });
    exampleContractContent = exampleContractContent.replace(contractClassRegEx, (match, className) => {
        console.log('HERE!!!!');
        const importPath = isInstalledPackage
            ? `'@versatus/versatus-javascript'`
            : `'./lib/contracts/${className}'`;
        console.log({ importPath });
        return `import { ${className} } from ${importPath};`;
    });
    if (isTsProject) {
        const typesRegex = /^import \{ (.*) \} from '.*\/types'$/gm;
        exampleContractContent = exampleContractContent.replace(typesRegex, (match, className) => {
            const importPath = isInstalledPackage
                ? `'@versatus/versatus-javascript'`
                : `'./lib/types'`;
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
    if (installedPackagePath) {
        const filesDir = path.join(installedPackagePath, 'dist', 'lib');
        const targetFilesDir = path.join(targetDir, 'build', 'lib');
        if (!fs.existsSync(targetFilesDir)) {
            fs.mkdirSync(targetFilesDir, { recursive: true });
        }
        copyDirectory(filesDir, targetFilesDir);
    }
    console.log('\x1b[0;32mExample contract and inputs initialized successfully.\x1b[0m');
})
    .usage('Usage: $0 build [options]')
    .command('build [file]', 'Build the project with the specified contract', (yargs) => {
    return yargs.positional('file', {
        describe: 'Contract file to include in the build',
        type: 'string',
    });
}, (argv) => {
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
    // const sysCheckScriptPath = path.resolve(__dirname, 'lib', 'scripts', 'sys_check.sh');
    console.log(`Running system check script: ${sysCheckScriptPath}`); // Debug log
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
        console.log('System check passed. Proceeding with build...');
        // Proceed with build process if system check is successful
        if (argv.file) {
            console.log('\x1b[0;33mStarting build...\x1b[0m');
            const filePath = path.resolve(process.cwd(), argv.file);
            if (filePath.endsWith('.ts')) {
                console.log('TypeScript file detected. Transpiling...');
                // Specify the output directory for the transpiled files
                const outDir = path.resolve(process.cwd(), 'build');
                // Run tsc to transpile the TypeScript file
                exec(`tsc --outDir ${outDir} ${filePath}`, (tscError, tscStdout, tscStderr) => {
                    if (tscError) {
                        console.error(`Error during TypeScript transpilation: ${tscError}`);
                        return;
                    }
                    console.log('Transpilation complete. Proceeding with build...');
                    injectFileInWrapper(filePath)
                        .then(() => {
                        runBuildProcess();
                    })
                        .catch((error) => {
                        console.error('Error during the build process:', error);
                    });
                });
            }
            else {
                injectFileInWrapper(filePath)
                    .then(() => {
                    runBuildProcess();
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
    .command('test [inputJson]', 'Run the test suite for the project', (yargs) => {
    return yargs.positional('inputJson', {
        describe: 'Path to the JSON input file for testing',
        type: 'string',
        demandOption: true, // Make this argument required
        demand: 'You must specify a JSON input file for testing',
    });
}, (argv) => {
    if (argv.inputJson) {
        let scriptDir;
        if (isInstalledPackage) {
            scriptDir = installedPackagePath;
        }
        else {
            // In the development environment
            scriptDir = process.cwd();
        }
        const checkWasmScriptPath = path.resolve(scriptDir, 'lib', 'scripts', 'check_wasm.sh');
        const child = spawn('bash', [checkWasmScriptPath], { stdio: 'inherit' });
        child.on('error', (error) => {
            console.error(`Error during WASM check: ${error}`);
        });
        child.on('close', (code) => {
            if (code !== 0) {
                console.error(`WASM check script exited with code ${code}`);
                return;
            }
            console.log('\x1b[0;33mStarting test...\x1b[0m');
            const filePath = path.resolve(process.cwd(), argv.inputJson);
            runTestProcess(filePath);
        });
    }
    else {
        console.error('You must specify an inputJson file to test with.');
        process.exit(1);
    }
})
    .help().argv;
async function injectFileInWrapper(filePath) {
    const projectRoot = process.cwd();
    const buildPath = path.join(projectRoot, 'build');
    const buildLibPath = path.join(projectRoot, 'build', 'lib');
    // Ensure the dist directory exists
    if (!fs.existsSync(buildLibPath)) {
        fs.mkdirSync(buildLibPath, { recursive: true });
    }
    let wrapperFilePath;
    let versatusHelpersFilepath = path.resolve(process.cwd(), './lib/versatus');
    // Check if the script is running from within node_modules
    if (isInstalledPackage) {
        // In an installed package environment
        try {
            wrapperFilePath =
                'node_modules/@versatus/versatus-javascript/dist/lib/wrapper.js'; // Adjust this path to your default wrapper file
            versatusHelpersFilepath =
                'node_modules/@versatus/versatus-javascript/dist/lib/versatus.js'; // Adjust this path to your default helpers file
        }
        catch (error) {
            console.error('Error locating wrapper.js in node_modules:', error);
            throw error;
        }
    }
    else {
        console.log('IN DEVELOPMENT ENVIRONMENT');
        // In the development environment
        wrapperFilePath = path.resolve(__dirname, './lib/wrapper.js');
        versatusHelpersFilepath = path.resolve(__dirname, './lib/versatus.js');
    }
    // Copy the wrapper file to the build directory
    const distWrapperFilePath = path.join(buildPath, 'lib', 'wrapper.js');
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
function runBuildProcess() {
    const projectRoot = process.cwd();
    const distPath = path.join(projectRoot, 'dist');
    const buildPath = path.join(projectRoot, 'build');
    if (!fs.existsSync(distPath) && !isInstalledPackage) {
        console.log("Creating the 'dist' directory...");
        fs.mkdirSync(distPath, { recursive: true });
    }
    if (!fs.existsSync(buildPath)) {
        console.log("Creating the 'build' directory...");
        fs.mkdirSync(buildPath, { recursive: true });
    }
    let webpackConfigPath;
    if (isInstalledPackage) {
        // In an installed package environment
        webpackConfigPath = path.resolve(installedPackagePath, 'lib', 'webpack.config.cjs');
    }
    else {
        // In the development environment
        webpackConfigPath = path.resolve(__dirname, '../', 'lib', 'webpack.config.dev.cjs');
    }
    const webpackCommand = `npx webpack --config ${webpackConfigPath}`;
    exec(webpackCommand, (webpackError, webpackStdout, webpackStderr) => {
        if (webpackError) {
            console.error(`Webpack exec error: ${webpackError}`);
            return;
        }
        console.log(`Webpack stdout: ${webpackStdout}`);
        if (webpackStderr) {
            console.error(`Webpack stderr: ${webpackStderr}`);
        }
        const bundleBuildPath = path.join(buildPath, 'bundle.js');
        // Now run Javy
        const javyCommand = `javy compile ${bundleBuildPath} -o ${path.join(buildPath, 'build.wasm')}`;
        exec(javyCommand, (javyError, javyStdout, javyStderr) => {
            if (javyError) {
                console.error(`Javy exec error: ${javyError}`);
                return;
            }
            if (javyStderr) {
                console.error(`Javy stderr: ${javyStderr}`);
            }
        });
    });
}
function runTestProcess(inputJsonPath) {
    let scriptDir;
    if (isInstalledPackage) {
        // In an installed package environment
        scriptDir = installedPackagePath;
    }
    else {
        // In the development environment
        scriptDir = process.cwd();
    }
    const testScriptPath = path.resolve(scriptDir, 'lib', 'scripts', 'test.sh');
    // Spawn a shell and execute the test.sh script within the shell
    const testProcess = spawn('bash', [testScriptPath, inputJsonPath], {
        stdio: 'inherit',
    });
    testProcess.on('error', (error) => {
        console.error(`test.sh spawn error: ${error}`);
    });
    testProcess.on('exit', (code) => {
        if (code !== 0) {
            console.error(`test.sh exited with code ${code}`);
        }
    });
}
