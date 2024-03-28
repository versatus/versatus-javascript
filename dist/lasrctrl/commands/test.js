import { installedPackagePath, isInstalledPackage, runTestProcess, } from '../../lasrctrl/cli-helpers.js';
import path from 'path';
import { promises as fsp } from 'fs';
import fs from 'fs';
import { runSpawn } from '../../lasrctrl/shell.js';
export const testCommandFlags = (yargs) => {
    return yargs
        .option('build', {
        describe: 'Filename of the built program to be deployed. Example: "example-program"',
        type: 'string',
        alias: 'b',
        demandOption: true,
    })
        .option('inputJson', {
        describe: 'Path to the JSON input file or directory containing JSON files for testing',
        type: 'string',
        alias: 'i',
        demandOption: true,
    });
};
const test = async (argv) => {
    if (argv.inputJson) {
        const pathToJsonToTest = path.resolve(process.cwd(), argv.inputJson);
        const programName = argv.build;
        try {
            const stats = await fsp.stat(pathToJsonToTest);
            let scriptDir = isInstalledPackage ? installedPackagePath : process.cwd();
            const files = fs.readdirSync('./build/lib');
            const hasJsFiles = files.some((file) => path.extname(file) === '.js');
            let target;
            const checkForCli = path.resolve(scriptDir, 'scripts', 'check_cli.sh');
            await runSpawn('bash', [checkForCli], { stdio: 'inherit' });
            if (hasJsFiles) {
                target = 'node';
            }
            else {
                throw new Error('No build artifacts found.');
            }
            console.log('\x1b[0;37mStarting test...\x1b[0m');
            if (stats.isDirectory()) {
                const files = await fsp.readdir(pathToJsonToTest);
                const jsonFiles = files.filter((file) => path.extname(file) === '.json');
                const testPromises = jsonFiles.map((file) => {
                    const jsonFileToTest = path.join(pathToJsonToTest, file);
                    return runTestProcess(programName, jsonFileToTest, target, false);
                });
                const results = await Promise.allSettled(testPromises);
                // Print a summary of all test outcomes
                console.log('\x1b[0;37mAll tests completed. Summary of results:\x1b[0m');
                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        console.log(`\x1b[0;37mTest ${index + 1}\x1b[0m (${jsonFiles[index]}):\x1b[0;32m Passed\x1b[0m`);
                    }
                    else {
                        console.error(`\x1b[0;37mTest ${index + 1}\x1b[0m (${jsonFiles[index]}):\x1b[0;31m Failed\x1b[0m`);
                    }
                });
            }
            else if (stats.isFile()) {
                await runTestProcess(programName, pathToJsonToTest, target, true);
            }
            else {
                console.error('The input path is neither a file nor a directory.');
                process.exit(1);
            }
        }
        catch (err) {
            // @ts-ignore
            console.log(`\x1b[0;31m${err}\x1b[0m`);
            process.exit(1);
        }
    }
    else {
        console.error('You must specify an inputJson path to test with.');
        process.exit(1);
    }
};
export default test;
