#!/usr/bin/env node

import yargs from 'yargs'
import { promises as fsp } from 'fs'
import fs from 'fs'
import path from 'path'
import { exec, spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { KeyPairArray } from './lib'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isInstalledPackage = fs.existsSync(
  path.resolve(
    process.cwd(),
    'node_modules',
    '@versatus',
    'versatus-javascript'
  )
)
const installedPackagePath = path.resolve(
  process.cwd(),
  'node_modules',
  '@versatus',
  'versatus-javascript'
)

function copyDirectory(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true })
  let entries = fs.readdirSync(src, { withFileTypes: true })

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name)
    let destPath = path.join(dest, entry.name)

    entry.isDirectory()
      ? copyDirectory(srcPath, destPath)
      : fs.copyFileSync(srcPath, destPath)
  }
}

const isTypeScriptProject = () => {
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json')
  return fs.existsSync(tsConfigPath)
}

const argv = yargs(process.argv.slice(2))
  .command(
    'init [example]',
    'Initialize a project with an example contract',
    (yargs) => {
      return yargs.positional('example', {
        describe: 'The example contract to initialize',
        type: 'string',
        choices: ['fungible-token'],
        demandOption: true,
        demand: 'You must specify an example contract to initialize',
      })
    },
    (argv) => {
      console.log('\x1b[0;33mInitializing example contract...\x1b[0m')

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

      // Copy the example file to the target directory
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
        /^import \{ (.*) \} from '.*\/lib\/classes\/contracts\/.*'*$/gm

      exampleContractContent = exampleContractContent.replace(
        contractClassRegEx,
        (match: any, className: any) => {
          const importPath = isInstalledPackage
            ? `'@versatus/versatus-javascript'`
            : `'./lib/classes/contracts/${className}'`
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

      console.log(
        '\x1b[0;37mExample contract and inputs initialized successfully.\x1b[0m'
      )
      console.log()
      console.log(`\x1b[0;35mReady to run:\x1b[0m`)
      console.log(
        `\x1b[0;33mvsjs build example-contract${
          isTsProject ? '.ts' : '.js'
        }\x1b[0m`
      )
      console.log()
      console.log()
    }
  )
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

      // const sysCheckScriptPath = path.resolve(__dirname, 'lib', 'scripts', 'sys_check.sh');
      console.log(
        `\x1b[0;37mRunning system check script: ${sysCheckScriptPath}\x1b[0m`
      ) // Debug log

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

              // Specify the output directory for the transpiled files
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

                console.log(
                  '\x1b[0;37mTranspilation complete. Proceeding with build...\x1b[0m'
                )
                injectFileInWrapper(filePath)
                  .then(() => {
                    runBuildProcess()
                  })
                  .catch((error) => {
                    console.error('Error during the build process:', error)
                  })
              })
            } else {
              injectFileInWrapper(filePath)
                .then(() => {
                  runBuildProcess()
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
    (yargs) => {
      return yargs.positional('inputJson', {
        describe:
          'Path to the JSON input file or directory containing JSON files for testing',
        type: 'string',
        demandOption: true,
        demand: 'You must specify a JSON input file or directory for testing',
      })
    },
    async (argv) => {
      // Make this function async
      if (argv.inputJson) {
        const inputPath = path.resolve(process.cwd(), argv.inputJson)

        try {
          const stats = await fsp.stat(inputPath)

          let scriptDir
          if (isInstalledPackage) {
            scriptDir = installedPackagePath
          } else {
            scriptDir = process.cwd() // In the development environment
          }

          const checkWasmScriptPath = path.resolve(
            scriptDir,
            'lib',
            'scripts',
            'check_wasm.sh'
          )

          // Assuming spawn is wrapped in a function that returns a Promise
          await runSpawn('bash', [checkWasmScriptPath], { stdio: 'inherit' })

          console.log('\x1b[0;37mStarting test...\x1b[0m')

          if (stats.isDirectory()) {
            const files = await fsp.readdir(inputPath)
            for (let file of files) {
              if (path.extname(file) === '.json') {
                const filePath = path.join(inputPath, file)
                // Ensure runTestProcess is an async function or returns a Promise
                await runTestProcess(filePath)
              }
            }
          } else if (stats.isFile()) {
            // Ensure runTestProcess is an async function or returns a Promise
            await runTestProcess(inputPath)
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
    'deploy [author] [name] [keypair]',
    'Deploy a contract',
    (yargs) => {
      yargs
        .positional('author', {
          describe: 'Author of the contract',
          type: 'string',
          demandOption: true,
        })
        .positional('name', {
          describe: 'Name of the contract',
          type: 'string',
          demandOption: true,
        })
        .positional('keypairPath', {
          describe: 'Path to the keypair file',
          type: 'string',
        })
        .positional('secretKey', {
          describe: 'Secret key for the wallet',
          type: 'string',
        })
    },
    async (argv) => {
      try {
        if (!argv.secretKey) {
          if (!argv.keypairPath) {
            console.log('\x1b[0;33mInitializing wallet...\x1b[0m')
            await initializeWallet()
          } else {
            console.log('\x1b[0;33mUsing existing keypair...\x1b[0m')
            await checkWallet(String(argv.keypairPath))
          }
        }

        let secretKey: string
        if (argv.secretKey) {
          secretKey = String(argv.secretKey)
        } else {
          secretKey = await getSecretKeyFromKeyPairFile(
            String(argv.keypairPath)
          )
        }

        console.log('\x1b[0;33mPublishing contract...\x1b[0m')
        const cid = await publishContract(
          String(argv.author),
          String(argv.name)
        )

        console.log('\x1b[0;33mRegistering contract...\x1b[0m')
        await registerContract(cid, secretKey)
      } catch (error) {
        console.error(`Deployment error: ${error}`)
      }
    }
  )
  .help().argv

function runSpawn(
  command: string,
  args: readonly string[] | undefined,
  options: { stdio: string }
) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    const child = spawn(command, args, options)

    // @ts-ignore
    child.on('close', (code) => {
      if (code === 0) {
        resolve(code) // Resolve the promise successfully if the process exits with code 0
      } else {
        reject(new Error(`Process exited with code ${code}`)) // Reject the promise if the process exits with a non-zero code
      }
    })

    // @ts-ignore
    child.on('error', (error) => {
      reject(error) // Reject the promise if an error occurs
    })
  })
}

async function injectFileInWrapper(filePath: string) {
  const projectRoot = process.cwd()
  const buildPath = path.join(projectRoot, 'build')
  const buildLibPath = path.join(projectRoot, 'build', 'lib')

  // Ensure the dist directory exists
  if (!fs.existsSync(buildLibPath)) {
    fs.mkdirSync(buildLibPath, { recursive: true })
  }

  let wrapperFilePath
  let versatusHelpersFilepath = path.resolve(process.cwd(), './lib/versatus')

  // Check if the script is running from within node_modules
  if (isInstalledPackage) {
    // In an installed package environment
    try {
      wrapperFilePath =
        'node_modules/@versatus/versatus-javascript/dist/lib/wrapper.js' // Adjust this path to your default wrapper file
      versatusHelpersFilepath =
        'node_modules/@versatus/versatus-javascript/dist/lib/versatus.js' // Adjust this path to your default helpers file
    } catch (error) {
      console.error('Error locating wrapper.js in node_modules:', error)
      throw error
    }
  } else {
    console.log('IN DEVELOPMENT ENVIRONMENT')
    // In the development environment
    wrapperFilePath = path.resolve(__dirname, './lib/wrapper.js')
    versatusHelpersFilepath = path.resolve(__dirname, './lib/versatus.js')
  }

  // Copy the wrapper file to the build directory
  const distWrapperFilePath = path.join(buildPath, 'lib', 'wrapper.js')
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

function runBuildProcess() {
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

async function runTestProcess(inputJsonPath: string) {
  let scriptDir: string
  if (isInstalledPackage) {
    // In an installed package environment
    scriptDir = installedPackagePath
  } else {
    // In the development environment
    scriptDir = process.cwd()
  }

  const testScriptPath = path.resolve(scriptDir, 'lib', 'scripts', 'test.sh')

  const testProcess = spawn('bash', [testScriptPath, inputJsonPath], {
    stdio: 'inherit',
  })

  testProcess.on('error', (error) => {
    console.error(`test.sh spawn error: ${error}`)
  })

  testProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`test.sh exited with code ${code}`)
    }
  })
}

async function initializeWallet() {
  await runCommand('./build/cli wallet new --save')
  console.log(
    'Wallet initialized and keypair.json created at ./.lasr/wallet/keypair.json'
  )
}

async function checkWallet(keypairPath: string) {
  try {
    // Assuming keypairPath is a relative path from the current working directory to the keypair.json file
    const command = `./build/cli wallet get-account --from-file --path ${keypairPath}`
    const output = await runCommand(command)
    console.log('Wallet check successful')
  } catch (error) {
    // Handle specific error messages or take actions based on the error
    console.error('Failed to validate keypair file:', error)
    process.exit(1) // Exit the process if the keypair file is not valid or other errors occur
  }
}

async function getSecretKeyFromKeyPairFile(
  keypairFilePath: string
): Promise<string> {
  try {
    console.log('getting secret key from keypair file')
    const absolutePath = path.resolve(keypairFilePath) // Ensure the path is absolute
    const fileContent = await fsp.readFile(absolutePath, 'utf8')
    const keyPairs: KeyPairArray = JSON.parse(fileContent)

    // Assuming you want the first keypair's secret key
    if (keyPairs.length > 0) {
      return keyPairs[0].secret_key
    } else {
      throw new Error('No keypairs found in the specified file.')
    }
  } catch (error) {
    console.error(`Failed to retrieve the secret key: ${error}`)
    throw error // Rethrow the error for further handling if needed
  }
}

async function publishContract(author: string, name: string): Promise<string> {
  const output = await runCommand(
    `./build/versatus-wasm publish -a ${author} -n ${name} -s _storage._tcp.incomplete.io -v 0 -w build/build.wasm -r --is-srv true`
  )
  const cidMatch = output.match(/Content ID for Web3 Package is (\S+)/)
  if (!cidMatch) throw new Error('Failed to extract CID from publish output.')
  console.log(`Contract published with CID: ${cidMatch[1]}`)
  return cidMatch[1]
}

async function registerContract(cid: string, secretKey: string) {
  await runCommand(
    `./build/cli wallet register-program --from-secret-key --secret-key "${secretKey}" --cid "${cid}"`
  )
  console.log('Contract registered.')
}

async function runCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error.message}`)
        return
      }
      if (stderr) {
        // If the stderr contains a specific error message, you might want to handle it differently
        if (stderr.includes('No such file or directory')) {
          reject('KeyPair file not found. Please ensure the path is correct.')
        } else {
          reject(`stderr: ${stderr}`)
        }
        return
      }
      resolve(stdout)
    })
  })
}
