import { copyDirectory, getSecretKeyFromKeyPairFile, installedPackagePath, isInstalledPackage, isTypeScriptProject, KEY_PAIR_FILE_PATH, } from '../../lasrctrl/cli-helpers.js';
import path from 'path';
import fs from 'fs';
import { __dirname } from '../../lasrctrl/cli.js';
import { runSpawn } from '../../lasrctrl/shell.js';
export const initCommandFlags = (yargs) => {
    return yargs.positional('example', {
        describe: 'The example program to initialize',
        type: 'string',
        choices: ['blank', 'fungible', 'non-fungible', 'faucet', 'hello-lasr'],
        default: 'hello-lasr',
    });
};
const init = async (argv) => {
    console.log(`\x1b[0;33mInitializing example program: ${argv.example ||
        'blank' ||
        'fungible' ||
        'non-fungible' ||
        'hello-lasr' ||
        'faucet'}...\x1b[0m`);
    let scriptDir = isInstalledPackage ? installedPackagePath : process.cwd();
    const checkForCli = path.resolve(scriptDir, 'scripts', 'check_cli.sh');
    await runSpawn('bash', [checkForCli], { stdio: 'inherit' });
    await getSecretKeyFromKeyPairFile(KEY_PAIR_FILE_PATH);
    const isTsProject = isTypeScriptProject();
    const exampleDir = isInstalledPackage
        ? path.resolve(installedPackagePath, 'examples', argv.example || 'blank')
        : path.resolve(isTsProject ? process.cwd() : __dirname, 'examples', argv.example || 'blank');
    const targetDir = process.cwd();
    const targetFilePath = path.join(targetDir, isInstalledPackage ? '' : 'src', isTsProject ? 'example-program.ts' : 'example-program.js');
    fs.copyFileSync(path.join(exampleDir, isTsProject ? 'example-program.ts' : 'example-program.js'), targetFilePath);
    let exampleContractContent = fs.readFileSync(targetFilePath, 'utf8');
    if (isInstalledPackage) {
        const importPathRegex = /@versatus\/versatus-javascript\/lib\/[^']+/g;
        exampleContractContent = exampleContractContent.replace(importPathRegex, '@versatus/versatus-javascript');
    }
    fs.writeFileSync(targetFilePath, exampleContractContent, 'utf8');
    const inputsDir = path.join(isInstalledPackage ? installedPackagePath : process.cwd(), 'examples', argv.example || 'blank', 'example-program-inputs');
    const targetInputsDir = path.join(targetDir, 'example-program-inputs');
    if (fs.existsSync(inputsDir)) {
        if (fs.existsSync(targetInputsDir)) {
            fs.rmSync(targetInputsDir, { recursive: true, force: true });
        }
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
    const targetFilesDir = path.join(targetDir, 'build', 'lib');
    if (fs.existsSync(targetFilesDir)) {
        fs.rmSync(targetFilesDir, { recursive: true, force: true });
    }
    if (isInstalledPackage) {
        const filesDir = path.join(installedPackagePath, 'dist', 'lib');
        if (!fs.existsSync(targetFilesDir)) {
            fs.mkdirSync(targetFilesDir, { recursive: true });
        }
        copyDirectory(filesDir, targetFilesDir);
    }
    console.log('\x1b[0;37mExample contract and inputs initialized successfully.\x1b[0m');
    console.log();
    console.log(`\x1b[0;35mReady to run:\x1b[0m`);
    console.log(`\x1b[0;33mlasrctl build ${isInstalledPackage ? '' : 'src/'}example-program${isTsProject ? '.ts' : '.js'}\x1b[0m`);
    console.log();
};
export default init;
