import { exec, spawn } from 'child_process';
export function runSpawn(command, args, options) {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        const child = spawn(command, args, options);
        // @ts-ignore
        child.on('close', (code) => {
            if (code === 0) {
                resolve(code); // Resolve the promise successfully if the process exits with code 0
            }
            else {
                reject(new Error(`Process exited with code ${code}`)); // Reject the promise if the process exits with a non-zero code
            }
        });
        // @ts-ignore
        child.on('error', (error) => {
            reject(error); // Reject the promise if an error occurs
        });
    });
}
export async function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                const match = stderr.match(/&program_id = "([^"]+)"/);
                if (match && match[1]) {
                    resolve(match[1]);
                }
                if (stdout) {
                    resolve(stdout);
                }
                if (stderr.includes('No such file or directory')) {
                    reject('KeyPair file not found. Please ensure the path is correct.');
                }
                else {
                    reject(`stderr: ${stderr}`);
                }
                return;
            }
            resolve(stdout);
        });
    });
}
