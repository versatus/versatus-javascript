#!/usr/bin/env node

import yargs, { Arguments, Argv, CommandBuilder } from 'yargs'
import { promises as fsp } from 'fs'
import fs from 'fs'
import path from 'path'
import { exec, spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { runCommand, runSpawn } from './lib/utils'
import {
  BuildCommandArgs,
  buildNode,
  checkWallet,
  copyDirectory,
  DeployCommandArgs,
  getSecretKeyFromKeyPairFile,
  InitCommandArgs,
  initializeWallet,
  installedPackagePath,
  isInstalledPackage,
  isTypeScriptProject,
  publishProgram,
  registerProgram,
  runTestProcess,
  TestCommandArgs,
} from './lib/cli-helpers'
import { VIPFS_ADDRESS } from './lib/env'
import log from './lib/log'

export const __dirname = path.dirname(fileURLToPath(import.meta.url))

const initCommand: CommandBuilder<{}, InitCommandArgs> = (yargs: Argv) => {
  return yargs.positional('example', {
    describe: 'The example contract to initialize',
    type: 'string',
    choices: ['fungible-token', 'snake', 'faucet'],
    demandOption: true,
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
    })
    .option('name', {
      describe: 'Name of the contract',
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
    .option('target', {
      describe: 'Build target',
      type: 'string',
      choices: ['node', 'wasm'],
      default: 'node',
    })
}

yargs(process.argv.slice(2))
  .command(
    'init [example]',
    'Initialize a project with an example contract',
    initCommand,
    (argv: Arguments<InitCommandArgs>) => {
      log.info(
        `\x1b[0;33mInitializing example contract: ${
          argv.example || 'fungible-token' || 'faucet'
        }...\x1b[0m`
      )
      const isTsProject = isTypeScriptProject()
      const exampleDir = isInstalledPackage
        ? path.resolve(
            installedPackagePath,
            isTsProject ? '' : 'dist',
            'examples',
            argv.example || 'fungible-token'
          )
        : path.resolve(
            isTsProject ? process.cwd() : __dirname,
            'examples',
            argv.example || 'fungible-token'
          )

      const targetDir = process.cwd()
      const targetFilePath = path.join(
        targetDir,
        isTsProject ? 'example-contract.ts' : 'example-contract.js'
      )

      fs.copyFileSync(
        path.join(
          exampleDir,
          isTsProject ? 'example-contract.ts' : 'example-contract.js'
        ),
        targetFilePath
      )

      let exampleContractContent = fs.readFileSync(targetFilePath, 'utf8')

      // Update the import path for any contract class based on the environment
      const contractClassRegEx =
        /^import \{ (.*) \} from '.*\/lib\/classes\/programs\/.*'*$/gm

      exampleContractContent = exampleContractContent.replace(
        contractClassRegEx,
        (match: any, className: any) => {
          const importPath = isInstalledPackage
            ? `'@versatus/versatus-javascript'`
            : `'./lib/classes/programs/${className}'`
          return `import { ${className} } from ${importPath};`
        }
      )

      if (isTsProject) {
        const typesRegex = /^import \{ (.*) \} from '.*\/lib'$/gm
        exampleContractContent = exampleContractContent.replace(
          typesRegex,
          (match: any, className: any) => {
            const importPath = isInstalledPackage
              ? `'@versatus/versatus-javascript'`
              : `'./lib'`
            return `import { ${className} } from ${importPath};`
          }
        )
      }

      // Write the updated content back to the example file
      fs.writeFileSync(targetFilePath, exampleContractContent, 'utf8')

      const inputsDir = path.join(
        isInstalledPackage ? installedPackagePath : process.cwd(),
        'examples',
        argv.example || 'fungible-token',
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

      log.info(
        '\x1b[0;37mExample contract and inputs initialized successfully.\x1b[0m'
      )
      log.info()
      log.info(`\x1b[0;35mReady to run:\x1b[0m`)
      log.info(
        `\x1b[0;33mlasrctl build example-contract${
          isTsProject ? '.ts' : '.js'
        }\x1b[0m`
      )
      log.info()
      log.info()
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

      log.info(
        `\x1b[0;37mRunning system check script: ${sysCheckScriptPath}\x1b[0m`
      )

      exec(
        `bash "${sysCheckScriptPath}"`,
        (sysCheckError, sysCheckStdout, sysCheckStderr) => {
          if (sysCheckError) {
            console.error(`Error during system check: ${sysCheckError}`)
            return
          }

          log.info(sysCheckStdout) // Output from sys_check.sh
          if (sysCheckError) {
            console.error(`Error during system check: ${sysCheckError}`)
            return
          }
          log.info(
            '\x1b[0;37mSystem check passed. Proceeding with build...\x1b[0m'
          )

          // Proceed with build process if system check is successful
          if (argv.file) {
            log.info('\x1b[0;37mStarting build...\x1b[0m')
            const filePath = path.resolve(process.cwd(), argv.file)

            if (filePath.endsWith('.ts')) {
              log.info(
                '\x1b[0;37mTypeScript file detected. Transpiling...\x1b[0m'
              )

              const outDir = path.resolve(process.cwd(), 'build')

              const command = isInstalledPackage
                ? `tsc --outDir ${outDir} ${filePath}`
                : 'tsc && chmod +x dist/cli.js && node dist/lib/scripts/add-extensions.js'
              // Run tsc to transpile the TypeScript file
              exec(command, (tscError, tscStdout, tscStderr) => {
                if (tscError) {
                  console.error(
                    `Error during TypeScript transpilation: ${tscError}`
                  )
                  return
                }

                log.info(
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
      // Make this function async
      if (argv.inputJson) {
        const inputPath = path.resolve(process.cwd(), argv.inputJson)

        try {
          const stats = await fsp.stat(inputPath)

          let scriptDir
          if (isInstalledPackage) {
            scriptDir = installedPackagePath
          } else {
            scriptDir = process.cwd()
          }

          let target

          const checkWasmScriptPath = path.resolve(
            scriptDir,
            'lib',
            'scripts',
            'check_cli.sh'
          )

          // Assuming spawn is wrapped in a function that returns a Promise
          await runSpawn('bash', [checkWasmScriptPath], { stdio: 'inherit' })

          if (fs.existsSync('./build/lib/node-wrapper.js')) {
            target = 'node'
          } else if (fs.existsSync('./build/build.wasm')) {
            target = 'wasm'
            const checkWasmScriptPath = path.resolve(
              scriptDir,
              'lib',
              'scripts',
              'check_wasm.sh'
            )

            // Assuming spawn is wrapped in a function that returns a Promise
            await runSpawn('bash', [checkWasmScriptPath], { stdio: 'inherit' })
          } else {
            new Error('No build artifacts found.')
          }

          log.info('\x1b[0;37mStarting test...\x1b[0m')

          if (stats.isDirectory()) {
            const files = await fsp.readdir(inputPath)
            for (let file of files) {
              if (path.extname(file) === '.json') {
                const filePath = path.join(inputPath, file)
                // Ensure runTestProcess is an async function or returns a Promise
                await runTestProcess(filePath, target)
              }
            }
          } else if (stats.isFile()) {
            // Ensure runTestProcess is an async function or returns a Promise
            await runTestProcess(inputPath, target)
          } else {
            console.error('The input path is neither a file nor a directory.')
            process.exit(1)
          }
        } catch (err) {
          // @ts-ignore
          console.error(`Error: ${err.message}`)
          process.exit(1)
        }
      } else {
        console.error('You must specify an inputJson path to test with.')
        process.exit(1)
      }
    }
  )
  .command(
    'deploy [author] [name] [keypairPath] [secretKey] [target]',
    'Deploy a contract',
    deployCommand,
    async (argv: Arguments<DeployCommandArgs>) => {
      try {
        if (!argv.secretKey) {
          log.info('NO SECRET KEY!')
          if (
            !argv.keypairPath &&
            fs.existsSync('./lasr/wallet/keypair.json')
          ) {
            log.info('\x1b[0;33mInitializing wallet...\x1b[0m')
            await initializeWallet()
          } else {
            log.info('\x1b[0;33mUsing existing keypair...\x1b[0m')
          }
        } else if (argv.keypairPath) {
          log.info('\x1b[0;33mUsing existing keypair...\x1b[0m')
          await checkWallet(String(argv.keypairPath))
        }

        let secretKey: string
        if (argv.secretKey) {
          secretKey = String(argv.secretKey)
        } else {
          const keypairPath = './.lasr/wallet/keypair.json'
          secretKey = await getSecretKeyFromKeyPairFile(String(keypairPath))
        }

        log.info('\x1b[0;33mPublishing program...\x1b[0m')
        const isWasm = argv.target === 'wasm'

        process.env.LASR_RPC_URL = 'http://lasr-sharks.versatus.io:9292'
        process.env.VIPFS_ADDRESS = '167.99.20.121:5001'

        let command
        if (isWasm) {
          command = `build/versatus-wasm publish -a ${argv.author} -n ${argv.name} -v 0 -w build/build.wasm -r --is-srv true`
        } else {
          command = `build/lasr_cli publish --author ${argv.author} --name ${
            argv.name
          } --package-path build/${
            isWasm ? '' : 'lib'
          } --entrypoint build/lib/node-wrapper.js -r --remote ${VIPFS_ADDRESS} --runtime ${
            argv.target
          } --content-type program --from-secret-key --secret-key "${secretKey}"`
        }

        log.info(command)

        const output = await runCommand(command)

        const cidPattern = /(bafy[a-zA-Z0-9]{44,59})/g
        const ipfsHashMatch = output.match(cidPattern)
        if (!ipfsHashMatch)
          throw new Error('Failed to extract CID from publish output.')
        log.info(`MATCHES: ${ipfsHashMatch.map((m) => m)}`)
        log.info(
          `Contract published with CID: ${
            ipfsHashMatch[ipfsHashMatch.length - 1]
          }`
        )
        const cid = ipfsHashMatch[ipfsHashMatch.length - 1]

        log.info('\x1b[0;33mRegistering program...\x1b[0m')
        const response = await registerProgram(cid, secretKey)
        log.info(response)
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
    log.info("\x1b[0;37mCreating the 'dist' directory...\x1b[0m")
    fs.mkdirSync(distPath, { recursive: true })
  }

  if (!fs.existsSync(buildPath)) {
    log.info("\x1b[0;37mCreating the 'build' directory...\x1b[0m")
    fs.mkdirSync(buildPath, { recursive: true })
  }

  if (target === 'node') {
    log.info('BUILDING NODE!')
    await buildNode(buildPath)
  } else if (target === 'wasm') {
    log.info('BUILDING WASM!')
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
        contractFilePath = './dist/example-contract.js'
        if (fs.existsSync(contractFilePath)) {
          log.info('The contract file exists.')
        } else {
          log.info('The contract file does not exist. You must build first.')
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
      log.info('IN DEVELOPMENT ENVIRONMENT')
      wrapperFilePath = path.resolve(__dirname, './lib/node-wrapper.js')
    }
    const distWrapperFilePath = path.join(buildPath, 'lib', 'node-wrapper.js')
    fs.copyFileSync(wrapperFilePath, distWrapperFilePath)
    let wrapperContent = fs.readFileSync(wrapperFilePath, 'utf8')
    wrapperContent = wrapperContent.replace(
      /^import start from '.*';?$/m,
      `import start from './dist/example-contract.js';`
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
      log.info('IN DEVELOPMENT ENVIRONMENT')
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
    log.info(`\x1b[0;37mWebpack stdout: ${webpackStdout}\x1b[0m`)
    if (webpackStderr) {
      console.error(`Webpack stderr: ${webpackStderr}`)
    }

    const bundleBuildPath = path.join(buildPath, 'bundle.js')

    log.info(`\x1b[0;37mBuilding wasm...\x1b[0m`)
    const javyCommand = `javy compile ${bundleBuildPath} -o ${path.join(
      buildPath,
      'build.wasm'
    )}`
    exec(javyCommand, (javyError, javyStdout, javyStderr) => {
      if (javyStdout) {
        log.info(`\x1b[0;37m${javyStdout}\x1b[0m`)
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
      log.info(`\x1b[0;37mWasm built...\x1b[0m`)
      log.info()
      log.info(`\x1b[0;35mReady to run:\x1b[0m`)
      log.info(`\x1b[0;33mlasrctl test inputs\x1b[0m`)
      log.info()
      log.info()
    })
  })
}
