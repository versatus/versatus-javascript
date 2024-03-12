import { Arguments, Argv, CommandBuilder } from 'yargs'
import { callProgram, getSecretKey } from '@/lasrctrl/cli-helpers'
import { NETWORK } from '@/lib/types'

export interface CallCommandArgs {
  programAddress: string
  op: string
  inputs: string
  network: string
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
    .option('inputs', {
      describe: 'Input json required by the operation',
      type: 'string',
      demandOption: true,
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
    const sendResponse = await callProgram(
      String(argv.programAddress),
      String(argv.op),
      String(argv.inputs),
      argv.network as NETWORK,
      secretKey
    )

    console.log('sendResponse', sendResponse)
  } catch (error) {
    console.error(`Deployment error: ${error}`)
  }
}

export default call
