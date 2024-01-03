#!/usr/bin/env node

const yargs = require('yargs')
const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')

const argv = yargs(process.argv.slice(2))
    .command(
        'init [example]',
        'Initialize a project with an example contract',
        (yargs) => {
            return yargs.positional('example', {
                describe: 'The example contract to initialize',
                type: 'string',
                choices: ['basic', 'erc-20'], // Add more example types if you have them
                demandOption: true,
                demand: 'You must specify an example contract to initialize'
            })
        },
        (argv) => {
            console.log("\x1b[0;33mInitializing example contract...\x1b[0m");

            // Check if the package is installed in the current project's node_modules
            const isInstalledPackage = fs.existsSync(path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript'));

            // Path to the examples directory
            const exampleDir = isInstalledPackage
                ? path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript', 'examples', argv.example || 'basic')
                : path.resolve(__dirname, 'examples', argv.example || 'basic');

            const targetDir = process.cwd();
            const targetFilePath = path.join(targetDir, 'example-contract.ts');

            // Copy the example file to the target directory
            fs.copyFileSync(
                path.join(exampleDir, 'example-contract.ts'),
                targetFilePath
            );

            // Read the content of the example file
            let exampleContractContent = fs.readFileSync(targetFilePath, 'utf8');

            // Update the import path for any contract class based on the environment
            const regex = /^import \{ (.*) \} from '.*\/contracts\/.*'$/gm;
            exampleContractContent = exampleContractContent.replace(regex, (match, className) => {
                console.log(className)
                const importPath = isInstalledPackage
                    ? `@versatus/versatus-javascript/lib/contracts/${className}`
                    : `./lib/contracts/${className}`;
                return `import { ${className} } from '${importPath}';`;
            });

            const regexType = /^import \{ (.*) \} from '.*\/types\/.*'$/gm;
            exampleContractContent = exampleContractContent.replace(regexType, (match, type) => {
                console.log(type)
                const importPath = isInstalledPackage
                    ? `@versatus/versatus-javascript/lib/types/${type}`
                    : `./lib/types/${type}`;
                return `import { ${type} } from '${importPath}';`;
            });

            // Write the updated content back to the example file
            fs.writeFileSync(targetFilePath, exampleContractContent, 'utf8');


            const inputsDir = path.join(exampleDir, 'inputs');
            const targetInputsDir = path.join(targetDir, 'inputs');

            if (fs.existsSync(inputsDir)) {
                if (!fs.existsSync(targetInputsDir)) {
                    fs.mkdirSync(targetInputsDir);
                }
                fs.readdirSync(inputsDir).forEach(file => {
                    const srcFile = path.join(inputsDir, file);
                    const destFile = path.join(targetInputsDir, file);
                    fs.copyFileSync(srcFile, destFile);
                });
            }

            console.log("\x1b[0;32mExample contract and inputs initialized successfully.\x1b[0m");
        }
    )
    .usage('Usage: $0 build [options]')
    .command(
        'build [file]',
        'Build the project with the specified contract',
        (yargs) => {
            return yargs.positional('file', {
                describe: 'Contract file to include in the build',
                type: 'string',
            })
        },
        (argv) => {
            if (argv.file) {
                console.log("\x1b[0;33mstarting build...\x1b[0m")
                const filePath = path.resolve(process.cwd(), argv.file)
                injectFileInWrapper(filePath)
                    .then(() => {
                        runBuildProcess()
                    })
                    .catch((error) => {
                        console.error('Error during the build process:', error)
                    })
            } else {
                console.error('You must specify a contract file to build.')
                process.exit(1)
            }
        }
    )
    .command(
        'test [inputJson]',
        'Run the test suite for the project',
        (yargs) => {
            return yargs.positional('inputJson', {
                describe: 'Path to the JSON input file for testing',
                type: 'string',
                demandOption: true, // Make this argument required
                demand: 'You must specify a JSON input file for testing'
            })
        },
        (argv) => {
            if (argv.inputJson) {
                console.log("\x1b[0;33mChecking and preparing WASM file...\x1b[0m");
                const checkWasmScriptPath = path.resolve(__dirname, "lib", 'scripts', 'check-wasm.sh');

                const execOptions = { maxBuffer: 1024 * 1024 }; // Increase buffer size to 1MB

                exec(`bash "${checkWasmScriptPath}"`, execOptions, (checkWasmError, checkWasmStdout, checkWasmStderr) => {
                    if (checkWasmError) {
                        console.error(`Error during WASM check: ${checkWasmError}`);
                        return;
                    }
                    if (checkWasmStderr) {
                        console.error(`WASM check stderr: ${checkWasmStderr}`);
                        return;
                    }
                    console.log("\x1b[0;33mStarting test...\x1b[0m");
                    const filePath = path.resolve(process.cwd(), argv.inputJson);
                    runTestProcess(filePath);
                });
            } else {
                console.error('You must specify an inputJson file to test with.')
                process.exit(1)
            }
        }
    )
    .help().argv

function injectFileInWrapper(filePath) {
    const projectRoot = process.cwd();
    const distPath = path.join(projectRoot, 'dist');

    // Ensure the dist directory exists
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
    }

    let wrapperFilePath
    let versatusHelpersFilepath  = path.resolve(process.cwd(), "./lib/versatus.ts")

    // Check if the script is running from within node_modules
    if (fs.existsSync(path.resolve(__dirname, '../../../node_modules'))) {
        // In an installed package environment
        try {
            wrapperFilePath = require.resolve('@versatus/versatus-javascript/lib/wrapper');
            versatusHelpersFilepath = require.resolve('@versatus/versatus-javascript/lib/versatus');
        } catch (error) {
            console.error('Error locating wrapper.ts in node_modules:', error);
            throw error;
        }
    } else {
        // In the development environment
        wrapperFilePath = path.resolve(__dirname, './lib/wrapper.ts');
        versatusHelpersFilepath = path.resolve(__dirname, './lib/versatus.ts');
    }

    // Copy the wrapper file to the dist directory
    const distWrapperFilePath = path.join(distPath, 'wrapper.ts');
    fs.copyFileSync(wrapperFilePath, distWrapperFilePath);

    try {
        let wrapperContent = fs.readFileSync(distWrapperFilePath, 'utf8');
        wrapperContent = wrapperContent.replace(
            /^import start from '.*';?$/m,
            `import start from '${filePath}';`
        );

        wrapperContent = wrapperContent.replace(
            /from '.*versatus.js';?$/m,
            `from '${versatusHelpersFilepath}'`
        );

        return fs.promises.writeFile(distWrapperFilePath, wrapperContent, 'utf8');
    } catch (error) {
        console.error('Error updating wrapper.ts in dist:', error);
        throw error;
    }
}



function runBuildProcess() {
    const projectRoot = process.cwd();
    const distPath = path.join(projectRoot, 'dist');

    if (!fs.existsSync(distPath)) {
        console.log("Creating the 'dist' directory...");
        fs.mkdirSync(distPath, { recursive: true });
    }

    const webpackConfigPath = path.resolve(__dirname, 'lib', 'webpack.config.cjs');
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


        // Now run Javy
        const javyCommand = `javy compile ${path.join(distPath, 'bundle.js')} -o ${path.join(distPath, 'build.wasm')}`;
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
    // Define the path to the check-wasm.sh script
    const checkWasmScriptPath = path.resolve(__dirname, "lib", 'scripts', 'check-wasm.sh');

    // Execute the check-wasm.sh script
    exec(`bash "${checkWasmScriptPath}"`, (checkWasmError, checkWasmStdout, checkWasmStderr) => {
        if (checkWasmError) {
            console.error(`check-wasm.sh exec error: ${checkWasmError}`);
            return;
        }
        console.log(`check-wasm.sh stdout: ${checkWasmStdout}`);
        console.log(`check-wasm.sh stderr: ${checkWasmStderr}`);

        console.log("check-wasm.sh script executed successfully. Proceeding with test...");


        const testScriptPath = path.resolve(__dirname, "lib", 'scripts', 'test.sh');

        exec(`bash "${testScriptPath}" "${inputJsonPath}"`, (testError, testStdout, testStderr) => {
            if (testError) {
                console.error(`exec error: ${testError}`);
                return;
            }
            if (testStdout) {
                console.log(`stdout: ${testStdout}`);
            }
            if (testStderr) {
                console.error(`stderr: ${testStderr}`);
            }
        });
    });
}
