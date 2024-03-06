import { installedPackagePath, isInstalledPackage, runBuildProcess, } from '../../lasrctrl/cli-helpers.js';
import path from 'path';
import { exec } from 'child_process';
import { __dirname } from '../../lasrctrl/cli.js';
export const buildCommandFlags = (yargs) => {
    return yargs
        .positional('file', {
        describe: 'Contract file to include in the build',
        type: 'string',
        demandOption: true,
    })
        .positional('target', {
        describe: 'Build target',
        type: 'string',
        choices: ['node', 'wasm'],
        default: 'node',
    });
};
const build = (argv) => {
    let scriptDir, sysCheckScriptPath;
    if (isInstalledPackage) {
        sysCheckScriptPath = path.resolve(installedPackagePath, 'scripts', 'sys_check.sh');
    }
    else {
        // In the development environment
        scriptDir = path.resolve(__dirname, '../');
        sysCheckScriptPath = path.resolve(scriptDir, '../', 'scripts', 'sys_check.sh');
    }
    console.log(`\x1b[0;37mRunning system check script: ${sysCheckScriptPath}\x1b[0m`);
    exec(`bash "${sysCheckScriptPath}"`, (sysCheckError, sysCheckStdout, sysCheckStderr) => {
        if (sysCheckError) {
            console.error(`Error during system check: ${sysCheckError}`);
            return;
        }
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
                    : 'tsc && tsc-alias && chmod +x dist/lasrctrl/cli.js && node ./dist/lib/scripts/add-extensions.js';
                exec(command, (tscError, tscStdout, tscStderr) => {
                    if (tscError) {
                        console.error(`Error during TypeScript transpilation: ${tscError}`);
                        return;
                    }
                    runBuildProcess(argv.file).catch((error) => {
                        console.error('Error during the build process:', error);
                    });
                });
            }
            else {
                runBuildProcess(argv.file).catch((error) => {
                    console.error('Error during the build process:', error);
                });
            }
        }
        else {
            console.error('You must specify a contract file to build.');
            process.exit(1);
        }
    });
};
export default build;
