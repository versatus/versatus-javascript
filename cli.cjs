#!/usr/bin/env node

const yargs = require('yargs')
const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')

const argv = yargs(process.argv.slice(2))
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

function runBuildProcess(filePath) {
    // The actual build command you want to run, for example:
    const webpackCommand = `npx webpack --config ${path.resolve(__dirname, 'lib', 'webpack.config.cjs')}`;
    const javyCommand = `javy compile dist/bundle.js -o dist/build.wasm`;

    // You might need to adjust the paths and commands according to your project's structure
    const fullBuildCommand = `${webpackCommand} && ${javyCommand}`;

    // Execute the build command
    exec(fullBuildCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
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
