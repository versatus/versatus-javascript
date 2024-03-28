#!/usr/bin/env node
import yargs from 'yargs';
import path from 'path';
import { fileURLToPath } from 'url';
import init, { initCommandFlags } from '../lasrctrl/commands/init.js';
import build, { buildCommandFlags } from '../lasrctrl/commands/build.js';
import test, { testCommandFlags } from '../lasrctrl/commands/test.js';
import deploy, { deployCommandFlags } from '../lasrctrl/commands/deploy.js';
import call, { callCommandFlags } from '../lasrctrl/commands/call.js';
import send, { sendCommandFlags } from '../lasrctrl/commands/send.js';
export const __dirname = path.dirname(fileURLToPath(import.meta.url));
yargs(process.argv.slice(2))
    .command('$0', 'The lasrctrl tool', () => { }, (argv) => {
    console.log(`Welcome to \x1b[0;35mLASR\x1b[0m CONTROL!
=======================================
This is your one-stop-shop to 
build, test, deploy, and call
programs on \x1b[0;35mLASR\x1b[0m.
=======================================
\x1b[0;34mPlease use the --help flag to get started.\x1b[0m`);
})
    .command('init [example] [flags]', 'Initialize a project with an example program', 
//@ts-ignore
initCommandFlags, init)
    .command('build [file]', 'Build the project with the specified contract', 
//@ts-ignore
buildCommandFlags, build)
    .command('test [flags]', 'Run the test suite for the project', 
//@ts-ignore
testCommandFlags, test)
    //@ts-ignore
    .command('deploy [flags]', 'Deploy a program to LASR', 
//@ts-ignore
deployCommandFlags, deploy)
    .command('send [flags]', 'Send a specified amount of tokens to a recipient', 
//@ts-ignore
sendCommandFlags, send)
    .command('call [flags]', 'Call a program method with the specified arguments', 
//@ts-ignore
callCommandFlags, call)
    .help().argv;
