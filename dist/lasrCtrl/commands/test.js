import { installedPackagePath, isInstalledPackage, runTestProcess, } from '../../lasrCtrl/cli-helpers.js';
import path from 'path';
import { promises as fsp } from 'fs';
import fs from 'fs';
import { runSpawn } from '../../lasrCtrl/shell.js';
export const testCommandFlags = (yargs) => {
    return yargs.option('inputJson', {
        describe: 'Path to the JSON input file or directory containing JSON files for testing',
        type: 'string',
        demandOption: true,
    });
};
const test = async (argv) => {
    if (argv.inputJson) {
        const inputPath = path.resolve(process.cwd(), argv.inputJson);
        try {
            const stats = await fsp.stat(inputPath);
            let scriptDir = isInstalledPackage ? installedPackagePath : process.cwd();
            let target;
            const checkWasmScriptPath = path.resolve(scriptDir, 'scripts', 'check_cli.sh');
            await runSpawn('bash', [checkWasmScriptPath], { stdio: 'inherit' });
            if (fs.existsSync('./build/lib/example-program.js')) {
                target = 'node';
            }
            else if (fs.existsSync('./build/build.wasm')) {
                target = 'wasm';
                const checkWasmScriptPath = path.resolve(scriptDir, 'scripts', 'check_wasm.sh');
                await runSpawn('bash', [checkWasmScriptPath], { stdio: 'inherit' });
            }
            else {
                throw new Error('No build artifacts found.');
            }
            console.log('\x1b[0;37mStarting test...\x1b[0m');
            if (stats.isDirectory()) {
                const files = await fsp.readdir(inputPath);
                const jsonFiles = files.filter((file) => path.extname(file) === '.json');
                const testPromises = jsonFiles.map((file) => {
                    const filePath = path.join(inputPath, file);
                    return runTestProcess(filePath, target);
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
                await runTestProcess(inputPath, target);
            }
            else {
                console.error('The input path is neither a file nor a directory.');
                process.exit(1);
            }
        }
        catch (err) {
            console.log(typeof err);
            //@ts-ignore
            if (typeof err === 'string' && err.indexOf('Error: ') > -1) {
                //@ts-ignore
                err = err.split('Error: ')[1].split('\n')[0];
            }
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
