import { Arguments, Argv, CommandBuilder } from 'yargs'
import {
  copyDirectory,
  installedPackagePath,
  isInstalledPackage,
  isTypeScriptProject,
} from '@/lasrCtrl/cli-helpers'
import path from 'path'
import fs from 'fs'
import { __dirname } from '@/lasrCtrl/cli'

export interface InitCommandArgs {
  example: string
  target?: string
}

export const initCommandFlags: CommandBuilder<{}, InitCommandArgs> = (
  yargs: Argv
) => {
  return yargs
    .positional('example', {
      describe: 'The example program to initialize',
      type: 'string',
      choices: ['fungible-token', 'snake', 'faucet'],
      demandOption: true,
    })
    .option('target', {
      describe: 'Build target',
      type: 'string',
      choices: ['node', 'wasm'],
      default: 'node',
      alias: 't',
    })
}

const init = (argv: Arguments<InitCommandArgs>) => {
  console.log(
    `\x1b[0;33mInitializing example program: ${
      argv.example || 'hello-lasr' || 'fungible-token' || 'faucet'
    }...\x1b[0m`
  )
  const isTsProject = isTypeScriptProject()
  const exampleDir = isInstalledPackage
    ? path.resolve(
        installedPackagePath,
        isTsProject ? '' : 'dist',
        'examples',
        argv.example || 'hello-lasr'
      )
    : path.resolve(
        isTsProject ? process.cwd() : __dirname,
        'examples',
        argv.example || 'hello-lasr'
      )

  const targetDir = process.cwd()
  const targetFilePath = path.join(
    targetDir,
    isTsProject ? 'example-program.ts' : 'example-program.js'
  )

  fs.copyFileSync(
    path.join(
      exampleDir,
      isTsProject ? 'example-program.ts' : 'example-program.js'
    ),
    targetFilePath
  )

  let exampleContractContent = fs.readFileSync(targetFilePath, 'utf8')

  fs.writeFileSync(targetFilePath, exampleContractContent, 'utf8')
  const inputsDir = path.join(
    isInstalledPackage ? installedPackagePath : process.cwd(),
    'examples',
    argv.example || 'hello-lasr',
    'inputs'
  )

  const targetInputsDir = path.join(targetDir, 'inputs')

  if (fs.existsSync(inputsDir)) {
    if (!fs.existsSync(targetInputsDir)) {
      fs.mkdirSync(targetInputsDir)
    }
    fs.readdirSync(inputsDir).forEach((file: string) => {
      const srcFile = path.join(inputsDir, file)
      const destFile = path.join(targetInputsDir, file)
      try {
        fs.copyFileSync(srcFile, destFile)
      } catch (error) {
        console.error(`Error copying file ${srcFile} to ${destFile}:`, error)
      }
    })
  }

  if (isInstalledPackage) {
    const filesDir = path.join(installedPackagePath, 'dist', 'lib')
    const targetFilesDir = path.join(targetDir, 'build', 'lib')
    if (!fs.existsSync(targetFilesDir)) {
      fs.mkdirSync(targetFilesDir, { recursive: true })
    }

    copyDirectory(filesDir, targetFilesDir)
  }

  console.log(
    '\x1b[0;37mExample contract and inputs initialized successfully.\x1b[0m'
  )
  console.log()
  console.log(`\x1b[0;35mReady to run:\x1b[0m`)
  console.log(
    `\x1b[0;33mvsjs build example-program${isTsProject ? '.ts' : '.js'}\x1b[0m`
  )
  console.log()
  console.log()
}

export default init
