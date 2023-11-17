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
            console.log("\033[0;33mInitializing example contract...\033[0m");
            const exampleDir = path.resolve(__dirname, 'examples', argv.example || 'basic');
            const targetDir = process.cwd();

            // Copy the contract file
            fs.copyFileSync(
                path.join(exampleDir, 'example-contract.js'),
                path.join(targetDir, 'example-contract.js')
            );

            // Copy the entire inputs directory
            const inputsDir = path.join(exampleDir, 'inputs');
            const targetInputsDir = path.join(targetDir, 'inputs');

            // Check if inputs directory exists
            if (fs.existsSync(inputsDir)) {
                // Ensure the target inputs directory exists or create it
                if (!fs.existsSync(targetInputsDir)) {
                    fs.mkdirSync(targetInputsDir);
                }
                // Copy all files from source inputs directory to target inputs directory
                fs.readdirSync(inputsDir).forEach(file => {
                    const srcFile = path.join(inputsDir, file);
                    const destFile = path.join(targetInputsDir, file);
                    fs.copyFileSync(srcFile, destFile);
                });
            }

            console.log("\033[0;32mExample contract and inputs initialized successfully.\033[0m");
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
                console.log("\033[0;33mstarting build...\033[0m")
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
                console.log("\033[0;33mstarting test...\033[0m");
                const filePath = path.resolve(process.cwd(), argv.inputJson)
                runTestProcess(filePath);
            } else {
                console.error('You must specify an inputJson file to test with.')
                process.exit(1)
            }
        }
    )
    .help().argv

function injectFileInWrapper(filePath) {
    const wrapperFilePath = path.resolve(__dirname, 'lib', 'wrapper.js');
    let wrapperContent = fs.readFileSync(wrapperFilePath, 'utf8');

    // Regular expression to match the import line
    // This matches 'import start' at the beginning of a line, followed by anything until the end of the line
    const importRegex = /^import start from '.*';?$/m;

    wrapperContent = wrapperContent.replace(
        importRegex,
        `import start from '${filePath}';`
    );

    return fs.promises.writeFile(wrapperFilePath, wrapperContent, 'utf8');
}

function runBuildProcess() {
    const webpackConfigPath = path.resolve(__dirname, 'lib', 'webpack.config.cjs');
    const distPath = path.resolve(__dirname, 'dist');
    const webpackCommand = `npx webpack --config ${webpackConfigPath}`;
    const javyCommand = `javy compile ${path.join(distPath, 'bundle.js')} -o ${path.join(distPath, 'build.wasm')}`;

    // Ensure dist directory exists
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath);
    }

    // Execute Webpack and then Javy only if Webpack succeeds
    exec(webpackCommand, (webpackError, webpackStdout, webpackStderr) => {
        if (webpackError) {
            console.error(`Webpack exec error: ${webpackError}`);
            return;
        }
        if (webpackStderr) {
            console.error(`Webpack stderr: ${webpackStderr}`);
            return;
        }
        console.log(`Webpack stdout: ${webpackStdout}`);

        // Now run Javy
        exec(javyCommand, (javyError, javyStdout, javyStderr) => {
            if (javyError) {
                console.error(`Javy exec error: ${javyError}`);
                return;
            }
            if (javyStderr) {
                console.error(`Javy stderr: ${javyStderr}`);
                return;
            }
            console.log(`Javy stdout: ${javyStdout}`);
        });
    });
}


function runTestProcess(inputJsonPath) {
    // Define the path to the test.sh script
    const testScriptPath = path.resolve(__dirname, "lib", 'scripts', 'test.sh');

    // Execute the test.sh script with the input JSON file path as an argument
    exec(`${testScriptPath} "${inputJsonPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stdout) {
            console.log(`stdout: ${stdout}`);
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
    });
}
