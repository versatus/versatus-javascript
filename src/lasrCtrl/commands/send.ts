import { Arguments, Argv, CommandBuilder } from 'yargs'
import { getSecretKey, sendTokens } from '@/lasrCtrl/cli-helpers'
import { LASR_RPC_URL, VIPFS_ADDRESS } from '@/lib/consts'

export interface SendCommandArgs {
  programAddress: string
  recipientAddress: string
  amount: string
  keypairPath?: string
  secretKey?: string
}

export const sendCommandFlags: CommandBuilder<{}, SendCommandArgs> = (
  yargs: Argv
) => {
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

const send = async (argv: Arguments<SendCommandArgs>) => {
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

export default send
