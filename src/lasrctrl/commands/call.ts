import { Arguments, Argv, CommandBuilder } from 'yargs'
import { callProgram, getSecretKey } from '@/lasrctrl/cli-helpers'
import { TNetwork } from '@/lib/types'
import { ZERO_VALUE } from '@/lib/consts'

export interface CallCommandArgs {
  programAddress: string
  op: string
  txInputs: string
  network: string
  value?: string
  keypairPath?: string
  secretKey?: string
}

export const callCommandFlags: CommandBuilder<{}, CallCommandArgs> = (
  yargs: Argv
) => {
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
    .option('txInputs', {
      describe: 'Input json required by the operation',
      type: 'string',
      demandOption: true,
    })
    .option('value', {
      describe: 'Value (in verse) to be sent to the program method',
      type: 'string',
    })
    .option('network', {
      describe: 'desired network',
      type: 'string',
      options: ['stable', 'test'],
      default: 'stable',
    })
    .option('network', {
      describe: 'desired network',
      type: 'string',
      options: ['stable', 'test'],
      default: 'stable',
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

const call = async (argv: Arguments<CallCommandArgs>) => {
  try {
    const secretKey = await getSecretKey(argv.keypairPath, argv.secretKey)
    const value = argv.value ? String(argv.value) : undefined
    const sendResponse = await callProgram(
      String(argv.programAddress),
      String(argv.op),
      String(argv.txInputs),
      argv.network as TNetwork,
      secretKey,
      value
    )

    console.log('sendResponse', sendResponse)
  } catch (error) {
    console.error(`Deployment error: ${error}`)
  }
}

export default call
