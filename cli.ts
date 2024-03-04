#!/usr/bin/env node
import yargs, { Arguments, Argv, CommandBuilder } from 'yargs'
import { promises as fsp } from 'fs'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'
import { runCommand, runSpawn } from '@/lib/shell'
import {
  BuildCommandArgs,
  buildNode,
  CallCommandArgs,
  callCreate,
  callProgram,
  checkWallet,
  copyDirectory,
  DeployCommandArgs,
  getSecretKey,
  getSecretKeyFromKeyPairFile,
  InitCommandArgs,
  initializeWallet,
  installedPackagePath,
  isInstalledPackage,
  isTypeScriptProject,
  registerProgram,
  runTestProcess,
  SendCommandArgs,
  sendTokens,
  TestCommandArgs,
} from '@/lib/cli-helpers'
import { LASR_RPC_URL, VIPFS_ADDRESS } from '@/lib/consts'

export const __dirname = path.dirname(fileURLToPath(import.meta.url))

const initCommand: CommandBuilder<{}, InitCommandArgs> = (yargs: Argv) => {
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

const buildCommand: CommandBuilder<{}, BuildCommandArgs> = (yargs: Argv) => {
  return yargs
    .positional('file', {
      describe: 'Contract file to include in the build',
      type: 'string',
    })
    .positional('target', {
      describe: 'Build target',
      type: 'string',
      choices: ['node', 'wasm'],
      default: 'node',
    })
}

const testCommand: CommandBuilder<{}, TestCommandArgs> = (yargs: Argv) => {
  return yargs.option('inputJson', {
    describe:
      'Path to the JSON input file or directory containing JSON files for testing',
    type: 'string',
    demandOption: true,
  })
}

const deployCommand: CommandBuilder<{}, DeployCommandArgs> = (yargs: Argv) => {
  return yargs
    .option('author', {
      describe: 'Author of the contract',
      type: 'string',
      demandOption: true,
      alias: 'a',
    })
    .option('name', {
      describe: 'Name of the contract',
      type: 'string',
      demandOption: true,
      alias: 'n',
    })
    .option('symbol', {
      describe: 'Symbol for the program',
      type: 'string',
      demandOption: true,
      alias: 's',
    })
    .option('programName', {
      describe: 'Name for the program',
      type: 'string',
      demandOption: true,
      alias: 'pn',
    })
    .option('initializedSupply', {
      describe:
        'Supply of the token to be sent to either the caller or the program',
      type: 'string',
      demandOption: true,
      alias: 'is',
    })
    .option('totalSupply', {
      describe: 'Total supply of the token to be created',
      type: 'string',
      demandOption: true,
      alias: 'ts',
    })
    .option('recipientAddress', {
      describe: 'Address for the initialized supply',
      type: 'string',
      demandOption: true,
      alias: 'ra',
    })
    .option('inputs', {
      describe: 'Additional inputs for the program',
      type: 'string',
      alias: 'i',
    })
    .option('keypairPath', {
      describe: 'Path to the keypair file',
      type: 'string',
    })
    .option('secretKey', {
      describe: 'Secret key for the wallet',
      type: 'string',
    })
    .option('target', {
      describe: 'Build target',
      type: 'string',
      choices: ['node', 'wasm'],
      default: 'node',
      alias: 't',
    })
}

const sendCommand: CommandBuilder<{}, SendCommandArgs> = (yargs: Argv) => {
  return yargs
    .option('programAddress', {
      describe: 'Program address to be send',
      type: 'string',
      demandOption: true,
    })
    .option('amount', {
      describe: 'Amount to be send (in verse)',
      type: 'string',
      demandOption: true,
    })
    .option('recipientAddress', {
      describe: 'Address for the initialized supply',
      type: 'string',
      demandOption: true,
    })
    .option('keypairPath', {
      describe: 'Path to the keypair file',
      type: 'string',
    })
    .option('secretKey', {
      describe: 'Secret key for the wallet',
      type: 'string',
    })
}

const callCommand: CommandBuilder<{}, CallCommandArgs> = (yargs: Argv) => {
  return yargs
    .option('programAddress', {
      describe: 'Program address to be send',
      type: 'string',
      demandOption: true,
    })
    .option('op', {
      describe: 'Operation to be performed by the program',
      type: 'string',
      demandOption: true,
    })
    .option('inputs', {
      describe: 'Input json required by the operation',
      type: 'string',
      demandOption: true,
    })
    .option('keypairPath', {
      describe: 'Path to the keypair file',
      type: 'string',
    })
    .option('secretKey', {
      describe: 'Secret key for the wallet',
      type: 'string',
    })
}

yargs(process.argv.slice(2))
  .command(
    'init [example] [flags]',
    'Initialize a project with an example program',
    initCommand,
    (argv: Arguments<InitCommandArgs>) => {
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
            console.error(
              `Error copying file ${srcFile} to ${destFile}:`,
              error
            )
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
        `\x1b[0;33mvsjs build example-program${
          isTsProject ? '.ts' : '.js'
        }\x1b[0m`
      )
      console.log()
      console.log()
    }
  )
  .command(
    'build [file]',
    'Build the project with the specified contract',
    buildCommand,
    (argv: Arguments<BuildCommandArgs>) => {
      let scriptDir: string, sysCheckScriptPath

      if (isInstalledPackage) {
        scriptDir = installedPackagePath
        sysCheckScriptPath = path.resolve(
          scriptDir,
          'lib',
          'scripts',
          'sys_check.sh'
        )
      } else {
        // In the development environment
        scriptDir = path.resolve(__dirname, '../')
        sysCheckScriptPath = path.resolve(
          scriptDir,
          'lib',
          'scripts',
          'sys_check.sh'
        )
      }

      console.log(
        `\x1b[0;37mRunning system check script: ${sysCheckScriptPath}\x1b[0m`
      )

      exec(
        `bash "${sysCheckScriptPath}"`,
        (sysCheckError, sysCheckStdout, sysCheckStderr) => {
          if (sysCheckError) {
            console.error(`Error during system check: ${sysCheckError}`)
            return
          }

          console.log(sysCheckStdout) // Output from sys_check.sh
          if (sysCheckError) {
            console.error(`Error during system check: ${sysCheckError}`)
            return
          }
          console.log(
            '\x1b[0;37mSystem check passed. Proceeding with build...\x1b[0m'
          )

          // Proceed with build process if system check is successful
          if (argv.file) {
            console.log('\x1b[0;37mStarting build...\x1b[0m')
            const filePath = path.resolve(process.cwd(), argv.file)

            if (filePath.endsWith('.ts')) {
              console.log(
                '\x1b[0;37mTypeScript file detected. Transpiling...\x1b[0m'
              )

              const outDir = path.resolve(process.cwd(), 'build')

              const command = isInstalledPackage
                ? `tsc --outDir ${outDir} ${filePath}`
                : 'tsc && tsc-alias && chmod +x dist/cli.js && node dist/lib/scripts/add-extensions.js'
              exec(command, (tscError, tscStdout, tscStderr) => {
                if (tscError) {
                  console.error(
                    `Error during TypeScript transpilation: ${tscError}`
                  )
                  return
                }

                console.log(
                  '\x1b[0;37mTranspilation complete. Proceeding with build...\x1b[0m'
                )
                injectFileInWrapper(filePath, argv.target)
                  .then(() => {
                    runBuildProcess(argv.target)
                  })
                  .catch((error) => {
                    console.error('Error during the build process:', error)
                  })
              })
            } else {
              injectFileInWrapper(filePath, argv.target)
                .then(() => {
                  runBuildProcess(argv.target)
                })
                .catch((error) => {
                  console.error('Error during the build process:', error)
                })
            }
          } else {
            console.error('You must specify a contract file to build.')
            process.exit(1)
          }
        }
      )
    }
  )
  .command(
    'test [inputJson]',
    'Run the test suite for the project',
    testCommand,
    async (argv: Arguments<TestCommandArgs>) => {
      if (argv.inputJson) {
        const inputPath = path.resolve(process.cwd(), argv.inputJson)

        try {
          const stats = await fsp.stat(inputPath)
          let scriptDir = isInstalledPackage
            ? installedPackagePath
            : process.cwd()
          let target: string

          const checkWasmScriptPath = path.resolve(
            scriptDir,
            'lib',
            'scripts',
            'check_cli.sh'
          )
          await runSpawn('bash', [checkWasmScriptPath], { stdio: 'inherit' })

          if (fs.existsSync('./build/lib/example-program.js')) {
            target = 'node'
          } else if (fs.existsSync('./build/build.wasm')) {
            target = 'wasm'
            const checkWasmScriptPath = path.resolve(
              scriptDir,
              'lib',
              'scripts',
              'check_wasm.sh'
            )
            await runSpawn('bash', [checkWasmScriptPath], { stdio: 'inherit' })
          } else {
            throw new Error('No build artifacts found.')
          }

          console.log('\x1b[0;37mStarting test...\x1b[0m')

          if (stats.isDirectory()) {
            const files = await fsp.readdir(inputPath)
            const jsonFiles = files.filter(
              (file) => path.extname(file) === '.json'
            )
            const testPromises = jsonFiles.map((file) => {
              const filePath = path.join(inputPath, file)
              return runTestProcess(filePath, target)
            })

            const results = await Promise.allSettled(testPromises)

            // Print a summary of all test outcomes
            console.log(
              '\x1b[0;37mAll tests completed. Summary of results:\x1b[0m'
            )
            results.forEach((result, index) => {
              if (result.status === 'fulfilled') {
                console.log(
                  `\x1b[0;37mTest ${index + 1}\x1b[0m (${
                    jsonFiles[index]
                  }):\x1b[0;32m Passed\x1b[0m`
                )
              } else {
                console.error(
                  `\x1b[0;37mTest ${index + 1}\x1b[0m (${
                    jsonFiles[index]
                  }):\x1b[0;31m Failed\x1b[0m`
                )
              }
            })
          } else if (stats.isFile()) {
            await runTestProcess(inputPath, target)
          } else {
            console.error('The input path is neither a file nor a directory.')
            process.exit(1)
          }
        } catch (err) {
          console.log(typeof err)
          //@ts-ignore
          if (typeof err === 'string' && err.indexOf('Error: ') > -1) {
            //@ts-ignore
            err = err.split('Error: ')[1].split('\n')[0]
          }
          // @ts-ignore
          console.log(`\x1b[0;31m${err}\x1b[0m`)
          process.exit(1)
        }
      } else {
        console.error('You must specify an inputJson path to test with.')
        process.exit(1)
      }
    }
  )
  .command(
    'deploy [flags]',
    'Deploy a contract',
    deployCommand,
    async (argv: Arguments<DeployCommandArgs>) => {
      try {
        const secretKey = await getSecretKey(argv.keypairPath, argv.secretKey)
        console.log('\x1b[0;33mPublishing program...\x1b[0m')
        const isWasm = argv.target === 'wasm'

        process.env.LASR_RPC_URL = LASR_RPC_URL
        process.env.VIPFS_ADDRESS = VIPFS_ADDRESS

        let command
        if (isWasm) {
          command = `
          build/versatus-wasm publish \n
            -a ${argv.author} \n
             -n ${argv.name} \n
             -v 0 \n
             -w build/build.wasm \n 
             -r \n
             --is-srv true`
        } else {
          command = `
          build/lasr_cli publish --author ${argv.author} --name ${argv.name} --package-path build/lib --entrypoint build/lib/example-program.js -r --remote ${VIPFS_ADDRESS} --runtime ${argv.target} --content-type program --from-secret-key --secret-key "${secretKey}"`
        }

        const output = await runCommand(command)

        const cidPattern = /(bafy[a-zA-Z0-9]{44,59})/g
        const ipfsHashMatch = output.match(cidPattern)
        if (!ipfsHashMatch)
          throw new Error('Failed to extract CID from publish output.')
        console.log(
          `\x1b[0;32mProgram published.\x1b[0m
==> cid: ${ipfsHashMatch[ipfsHashMatch.length - 1]}`
        )
        const cid = ipfsHashMatch[ipfsHashMatch.length - 1]

        console.log('\x1b[0;33mRegistering program...\x1b[0m')
        const registerResponse = await registerProgram(cid, secretKey)

        const programAddressMatch = registerResponse.match(
          /"program_address":\s*"(0x[a-fA-F0-9]{40})"/
        )
        if (!programAddressMatch)
          throw new Error('Failed to extract program address from the output.')

        const programAddress = programAddressMatch[1]
        console.log(`\x1b[0;32mProgram registered.\x1b[0m
==> programAddress: ${programAddress}`)
        console.log('\x1b[0;33mCreating program...\x1b[0m')
        const createResponse = await callCreate(
          programAddress,
          String(argv.symbol),
          String(argv.programName),
          String(argv.initializedSupply),
          String(argv.totalSupply),
          String(argv.recipientAddress),
          secretKey,
          String(argv.inputs)
        )

        if (createResponse) {
          console.log(`\x1b[0;32mProgram created successfully.\x1b[0m
==> programAddress: ${programAddress}
==> symbol: ${argv.symbol}
==> tokenName: ${argv.programName}
==> initializedSupply: ${argv.initializedSupply}
==> totalSupply: ${argv.totalSupply}
==> recipientAddress: ${argv.recipientAddress}
          `)
        }
      } catch (error) {
        console.error(`Deployment error: ${error}`)
      }
    }
  )
  .command(
    'send [flags]',
    'Send a specified amount of tokens to a recipient',
    sendCommand,
    async (argv: Arguments<SendCommandArgs>) => {
      try {
        const secretKey = await getSecretKey(argv.keypairPath, argv.secretKey)

        process.env.LASR_RPC_URL = LASR_RPC_URL
        process.env.VIPFS_ADDRESS = VIPFS_ADDRESS

        const sendResponse = await sendTokens(
          String(argv.programAddress),
          String(argv.recipientAddress),
          String(argv.amount),
          secretKey
        )

        console.log('sendResponse', sendResponse)
      } catch (error) {
        console.error(`Deployment error: ${error}`)
      }
    }
  )
  .command(
    'call [flags]',
    'Call a program method with the specified arguments',
    callCommand,
    async (argv: Arguments<CallCommandArgs>) => {
      try {
        const secretKey = await getSecretKey(argv.keypairPath, argv.secretKey)

        process.env.LASR_RPC_URL = LASR_RPC_URL
        process.env.VIPFS_ADDRESS = VIPFS_ADDRESS

        const sendResponse = await callProgram(
          String(argv.programAddress),
          String(argv.op),
          String(argv.inputs),
          secretKey
        )

        console.log('sendResponse', sendResponse)
      } catch (error) {
        console.error(`Deployment error: ${error}`)
      }
    }
  )
  .help().argv

export async function runBuildProcess(target: string = 'node') {
  const projectRoot = process.cwd()
  const distPath = path.join(projectRoot, 'dist')
  const buildPath = path.join(projectRoot, 'build')

  if (!fs.existsSync(distPath) && !isInstalledPackage) {
    console.log("\x1b[0;37mCreating the 'dist' directory...\x1b[0m")
    fs.mkdirSync(distPath, { recursive: true })
  }

  if (!fs.existsSync(buildPath)) {
    console.log("\x1b[0;37mCreating the 'build' directory...\x1b[0m")
    fs.mkdirSync(buildPath, { recursive: true })
  }

  if (target === 'node') {
    await buildNode(buildPath)
  } else if (target === 'wasm') {
    await buildWasm(buildPath)
  }
}

export async function injectFileInWrapper(filePath: string, target = 'node') {
  const projectRoot = process.cwd()
  const buildPath = path.join(projectRoot, 'build')
  const buildLibPath = path.join(projectRoot, 'build', 'lib')
  if (!fs.existsSync(buildLibPath)) {
    fs.mkdirSync(buildLibPath, { recursive: true })
  }
  let wrapperFilePath
  if (target === 'node') {
    let contractFilePath
    if (isTypeScriptProject()) {
      if (isInstalledPackage) {
      } else {
        contractFilePath = './dist/example-program.js'
        if (fs.existsSync(contractFilePath)) {
          console.log('The contract file exists.')
        } else {
          console.log('The contract file does not exist. You must build first.')
        }
      }
    }

    if (isInstalledPackage) {
      try {
        wrapperFilePath =
          'node_modules/@versatus/versatus-javascript/dist/lib/node-wrapper.js'
      } catch (error) {
        console.error('Error locating node-wrapper.js in node_modules:', error)
        throw error
      }
    } else {
      console.log('IN DEVELOPMENT ENVIRONMENT')
      wrapperFilePath = path.resolve(__dirname, './lib/node-wrapper.js')
    }
    const distWrapperFilePath = path.join(buildPath, 'lib', 'node-wrapper.js')
    fs.copyFileSync(wrapperFilePath, distWrapperFilePath)
    let wrapperContent = fs.readFileSync(wrapperFilePath, 'utf8')
    wrapperContent = wrapperContent.replace(
      /^import start from '.*';?$/m,
      `import start from './dist/example-program.js';`
    )
    return fs.promises.writeFile(distWrapperFilePath, wrapperContent, 'utf8')
  } else if (target === 'wasm') {
    let versatusHelpersFilepath = path.resolve(process.cwd(), './lib/versatus')
    if (isInstalledPackage) {
      try {
        wrapperFilePath =
          'node_modules/@versatus/versatus-javascript/dist/lib/wasm-wrapper.js'
        versatusHelpersFilepath =
          'node_modules/@versatus/versatus-javascript/dist/lib/versatus.js'
      } catch (error) {
        console.error('Error locating wasm-wrapper.js in node_modules:', error)
        throw error
      }
    } else {
      console.log('IN DEVELOPMENT ENVIRONMENT')
      // In the development environment
      wrapperFilePath = path.resolve(__dirname, './lib/wasm-wrapper.js')
      versatusHelpersFilepath = path.resolve(__dirname, './lib/versatus.js')
    }
    // Copy the wrapper file to the build directory
    const distWrapperFilePath = path.join(buildPath, 'lib', 'wasm-wrapper.js')
    fs.copyFileSync(wrapperFilePath, distWrapperFilePath)
    const versatusWrapperFilePath = path.join(buildPath, 'lib', 'versatus.js')
    fs.copyFileSync(versatusHelpersFilepath, versatusWrapperFilePath)
    try {
      let wrapperContent = fs.readFileSync(wrapperFilePath, 'utf8')
      wrapperContent = wrapperContent.replace(
        /^import start from '.*';?$/m,
        `import start from '${filePath}';`
      )
      wrapperContent = wrapperContent.replace(
        /from '.*versatus';?$/m,
        `from '${versatusWrapperFilePath}.js'`
      )
      return fs.promises.writeFile(distWrapperFilePath, wrapperContent, 'utf8')
    } catch (error) {
      console.error('Error updating wrapper.js in dist:', error)
      throw error
    }
  }
}

export async function buildWasm(buildPath: string) {
  console.log('BUILDING WASM!')
  let webpackConfigPath
  if (isInstalledPackage) {
    // In an installed package environment
    webpackConfigPath = path.resolve(
      installedPackagePath,
      'lib',
      'webpack.config.cjs'
    )
  } else {
    // In the development environment
    webpackConfigPath = path.resolve(
      __dirname,
      '../',
      'lib',
      'webpack.config.dev.cjs'
    )
  }

  const webpackCommand = `npx webpack --config ${webpackConfigPath}`
  exec(webpackCommand, (webpackError, webpackStdout, webpackStderr) => {
    if (webpackError) {
      console.error(`Webpack exec error: ${webpackError}`)
      return
    }
    console.log(`\x1b[0;37mWebpack stdout: ${webpackStdout}\x1b[0m`)
    if (webpackStderr) {
      console.error(`Webpack stderr: ${webpackStderr}`)
    }

    const bundleBuildPath = path.join(buildPath, 'bundle.js')

    console.log(`\x1b[0;37mBuilding wasm...\x1b[0m`)
    const javyCommand = `javy compile ${bundleBuildPath} -o ${path.join(
      buildPath,
      'build.wasm'
    )}`
    exec(javyCommand, (javyError, javyStdout, javyStderr) => {
      if (javyStdout) {
        console.log(`\x1b[0;37m${javyStdout}\x1b[0m`)
        return
      }
      if (javyError) {
        console.error(`Javy exec error: ${javyError}`)
        return
      }
      if (javyStderr) {
        console.error(`Javy stderr: ${javyStderr}`)
        return
      }
      console.log(`\x1b[0;37mWasm built...\x1b[0m`)
      console.log()
      console.log(`\x1b[0;35mReady to run:\x1b[0m`)
      console.log(`\x1b[0;33mvsjs test inputs\x1b[0m`)
      console.log()
      console.log()
    })
  })
}
