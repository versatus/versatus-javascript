import { Arguments, Argv, CommandBuilder } from 'yargs'
import {
  callCreate,
  checkWallet,
  getSecretKey,
  registerProgram,
} from '@/lasrctrl/cli-helpers'
import { LASR_RPC_URL, VIPFS_ADDRESS } from '@/lib/consts'
import { runCommand } from '@/lasrctrl/shell'

export interface DeployCommandArgs {
  author: string
  name: string
  symbol: string
  programName: string
  initializedSupply: string
  totalSupply: string
  recipientAddress: string
  inputs?: string
  keypairPath?: string
  secretKey?: string
  target?: string
}

export const deployCommandFlags: CommandBuilder<{}, DeployCommandArgs> = (
  yargs: Argv
) => {
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

const deploy = async (argv: Arguments<DeployCommandArgs>) => {
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

    console.log('\x1b[0;33mChecking wallet...\x1b[0m')
    await checkWallet(String(argv.recipientAddress))
    console.log('\x1b[0;32mWallet checked.\x1b[0m')

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

export default deploy
