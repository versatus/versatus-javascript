import fs, { promises as fsp } from 'fs'
import path from 'path'
import { exec, spawn } from 'child_process'
import { KeyPairArray } from '@/lib/types'
import { runCommand } from '@/lasrctrl/shell'
import { FAUCET_URL, LASR_RPC_URL, VIPFS_ADDRESS } from '@/lib/consts'

export const isInstalledPackage = fs.existsSync(
  path.resolve(
    process.cwd(),
    'node_modules',
    '@versatus',
    'versatus-javascript'
  )
)

export const isTypeScriptProject = () => {
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json')
  return fs.existsSync(tsConfigPath)
}

export const installedPackagePath = path.resolve(
  process.cwd(),
  'node_modules',
  '@versatus',
  'versatus-javascript'
)

export function copyDirectory(src: string, dest: string) {
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

export async function runBuildProcess(programFilePath: string) {
  await buildNode(programFilePath)
}

export async function buildNode(buildPath: string) {
  const configPath = isInstalledPackage
    ? `${installedPackagePath}/webpack.config.js`
    : './webpack.config.js'
  const webpackCommand = `npx webpack --config ${configPath} --entry ${buildPath}`
  exec(webpackCommand, (tscError, tscStdout, tscStderr) => {
    if (tscError) {
      console.error(`Error during TypeScript transpilation: ${tscError}`)
      return
    }

    console.log('\x1b[0;37mBuild complete...\x1b[0m')
    console.log()
    console.log(`\x1b[0;35mReady to run:\x1b[0m`)
    console.log(`\x1b[0;33mlasrctl test inputs\x1b[0m`)
    console.log()
  })
}

export async function getSecretKeyFromKeyPairFile(
  keypairFilePath: string
): Promise<string> {
  try {
    let keyPairs: KeyPairArray = []
    try {
      console.log('Getting secret key from keypair file')
      const absolutePath = path.resolve(keypairFilePath) // Ensure the path is absolute
      const fileContent = await fsp.readFile(absolutePath, 'utf8')
      keyPairs = JSON.parse(fileContent) as KeyPairArray
    } catch (error) {
      await initializeWallet()
      const absolutePath = path.resolve(keypairFilePath) // Ensure the path is absolute
      const fileContent = await fsp.readFile(absolutePath, 'utf8')
      keyPairs = JSON.parse(fileContent) as KeyPairArray
    }

    if (keyPairs.length > 0) {
      return keyPairs[0].secret_key
    } else {
      new Error('No keypairs found in the specified file.')
      return ''
    }
  } catch (error) {
    console.error(`Failed to retrieve the secret key: ${error}`)
    throw error
  }
}

export async function getAddressFromKeyPairFile(
  keypairFilePath: string
): Promise<string> {
  try {
    console.log('Getting address from keypair file')
    const absolutePath = path.resolve(keypairFilePath) // Ensure the path is absolute
    const fileContent = await fsp.readFile(absolutePath, 'utf8')
    const keyPairs: KeyPairArray = JSON.parse(fileContent)

    if (keyPairs.length > 0) {
      return keyPairs[0].address
    } else {
      new Error('No keypairs found in the specified file.')
      return ''
    }
  } catch (error) {
    console.error(`Failed to retrieve the secret key: ${error}`)
    throw error
  }
}

export async function registerProgram(cid: string, secretKey: string) {
  try {
    process.env.LASR_RPC_URL = `${LASR_RPC_URL}`
    process.env.VIPFS_ADDRESS = `${VIPFS_ADDRESS}`
    const command = `
  ./build/lasr_cli wallet register-program --from-secret-key --secret-key "${secretKey}" --cid "${cid}"`
    return await runCommand(command)
  } catch (e) {
    throw new Error(`Failed to register program: ${e}`)
  }
}

export const getSecretKey = async (
  secretKeyPath?: string,
  secretKey?: string
) => {
  if (secretKey) return secretKey

  if (!fs.existsSync('.lasr/wallet/keypair.json')) {
    console.log('\x1b[0;33mInitializing wallet...\x1b[0m')
    await initializeWallet()
  } else {
    console.log('\x1b[0;33mUsing existing keypair...\x1b[0m')
  }

  let retrievedSecretKey: string

  const keypairPath = '.lasr/wallet/keypair.json'
  retrievedSecretKey = await getSecretKeyFromKeyPairFile(String(keypairPath))
  return retrievedSecretKey
}

export async function callCreate(
  programAddress: string,
  symbol: string,
  name: string,
  initializedSupply: string,
  totalSupply: string,
  recipientAddress: string,
  secretKey: string,
  inputs?: string
) {
  if (
    !programAddress ||
    !symbol ||
    !name ||
    !initializedSupply ||
    !recipientAddress ||
    !totalSupply ||
    !secretKey
  ) {
    throw new Error(
      `programAddress (${programAddress}), symbol (${symbol}), name (${name}), initializedSupply (${initializedSupply}), totalSupply(${totalSupply}), and secretKey are required to call create.`
    )
  }

  process.env.LASR_RPC_URL = `${LASR_RPC_URL}`
  process.env.VIPFS_ADDRESS = `${VIPFS_ADDRESS}`
  const command = `./build/lasr_cli wallet call --from-secret-key --secret-key "${secretKey}" --op "create" --inputs '{"name":"${name}","symbol":"${symbol}","initializedSupply":"${initializedSupply}","totalSupply":"${totalSupply}"${`,"to":"${recipientAddress}"`}}' --to "${programAddress}" --content-namespace "${programAddress}"`
  return await runCommand(command)
}

export async function sendTokens(
  programAddress: string,
  recipientAddress: string,
  amount: string,
  secretKey: string
) {
  if (!programAddress || !recipientAddress || !amount || !secretKey) {
    throw new Error(
      `programAddress (${programAddress}), recipientAddress (${recipientAddress}), amount (${amount}), and secretKey are required to call create.`
    )
  }

  process.env.LASR_RPC_URL = `${LASR_RPC_URL}`
  process.env.VIPFS_ADDRESS = `${VIPFS_ADDRESS}`
  const command = `./build/lasr_cli wallet send --to ${recipientAddress} -c ${programAddress} --value ${amount} -u verse --from-secret-key --secret-key "${secretKey}"`
  return await runCommand(command)
}

export async function callProgram(
  programAddress: string,
  op: string,
  inputs: string,
  secretKey: string
) {
  if (!programAddress || !op || !inputs || !secretKey) {
    throw new Error(
      `programAddress (${programAddress}), op (${op}), inputs (${inputs}), and secretKey are required to call create.`
    )
  }

  process.env.LASR_RPC_URL = `${LASR_RPC_URL}`
  process.env.VIPFS_ADDRESS = `${VIPFS_ADDRESS}`
  const command = `./build/lasr_cli wallet call --from-secret-key --secret-key "${secretKey}" --op ${op} --inputs '${inputs}' --to ${programAddress} --content-namespace ${programAddress}`
  return await runCommand(command)
}

export function runTestProcess(inputJsonPath: string, target = 'node') {
  return new Promise((resolve, reject) => {
    let scriptDir = isInstalledPackage ? installedPackagePath : process.cwd()
    const testScriptPath = path.resolve(
      scriptDir,
      'scripts',
      target === 'node' ? 'test-node.sh' : 'test-wasm.sh'
    )

    const testProcess = spawn('bash', [testScriptPath, inputJsonPath], {
      stdio: ['inherit', 'inherit', 'pipe'],
    })

    let errorOutput = ''

    testProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    testProcess.on('error', (error) => {
      reject(`Spawn error: ${error}`)
    })

    testProcess.on('exit', (code) => {
      if (code !== 0) {
        reject(`Exited with code ${code}: ${errorOutput}`)
      } else {
        resolve(`Test for ${inputJsonPath} passed`)
      }
    })
  })
}

export async function initializeWallet() {
  await runCommand(`./build/lasr_cli wallet new --save`)
  console.log(
    'Wallet initialized and keypair.json created at ./.lasr/wallet/keypair.json'
  )
}

export async function checkWallet(address: string) {
  try {
    try {
      console.log('Checking wallet...')
      const command = `./build/lasr_cli wallet get-account --address ${address}`

      await runCommand(command)
    } catch (e) {
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        address,
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      }

      await fetch(`${FAUCET_URL}/api/faucet/verse`, requestOptions)
        .then((response) => response.text())
        .catch((error) => console.error(error))
    }

    console.log('Wallet check successful')
  } catch (error) {
    // Handle specific error messages or take actions based on the error
    console.error('Failed to validate keypair file:', error)
    process.exit(1) // Exit the process if the keypair file is not valid or other errors occur
  }
}
