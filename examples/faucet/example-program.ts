import {
  Program,
  ProgramUpdate,
} from '@versatus/versatus-javascript/lib/programs/Program'
import { ComputeInputs } from '@versatus/versatus-javascript/lib/types'
import { Outputs } from '@versatus/versatus-javascript/lib/programs/Outputs'

import {
  buildCreateInstruction,
  buildProgramUpdateField,
  buildTokenDistributionInstruction,
  buildTokenUpdateField,
  buildTransferInstruction,
  buildUpdateInstruction,
} from '@versatus/versatus-javascript/lib/programs/instruction-builders/builder-helpers'
import { THIS } from '@versatus/versatus-javascript/lib/consts'
import {
  checkIfValuesAreUndefined,
  formatAmountToHex,
  formatHexToAmount,
  parseAmountToBigInt,
  validate,
  validateAndCreateJsonString,
} from '@versatus/versatus-javascript/lib/utils'
import { TokenOrProgramUpdate } from '@versatus/versatus-javascript/lib/programs/Token'
import { AddressOrNamespace } from '@versatus/versatus-javascript/lib/programs/Address-Namespace'

export class FaucetProgram extends Program {
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      addProgram: this.addProgram.bind(this),
      create: this.create.bind(this),
      faucet: this.faucet.bind(this),
    })
  }

  addProgram(computeInputs: ComputeInputs) {
    try {
      const { transaction, accountInfo } = computeInputs
      const { transactionInputs, from } = transaction

      const { programAccountData } = accountInfo

      const txInputs = validate(
        JSON.parse(transactionInputs),
        'transaction inputs not parsable'
      )

      const {
        programAddress,
        faucetAmount,
        amountToAdd,
        addressTimeoutMinutes,
      } = txInputs

      checkIfValuesAreUndefined({
        programAddress,
        faucetAmount,
        amountToAdd,
        addressTimeoutMinutes,
      })

      const transferToFaucetInstruction = buildTransferInstruction({
        from: from,
        to: 'this',
        tokenAddress: programAddress,
        amount: parseAmountToBigInt(amountToAdd),
      })

      const faucetProgramsStr = validate(
        programAccountData?.programs,
        'Please create the program first.'
      )

      const faucetPrograms = validate(
        JSON.parse(faucetProgramsStr),
        "couldn't parse the faucet's account programs"
      )

      const faucetUpdate = buildProgramUpdateField({
        field: 'data',
        value: JSON.stringify({
          programs: JSON.stringify({
            ...faucetPrograms,
            [programAddress]: JSON.stringify({
              pipeData: JSON.stringify({
                faucetAmount: formatAmountToHex(faucetAmount),
                addressTimeoutMinutes,
              }),
              recipients: JSON.stringify({}),
            }),
          }),
        }),
        action: 'extend',
      })

      const faucetDataUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), [faucetUpdate])
        ),
      })

      return new Outputs(computeInputs, [
        transferToFaucetInstruction,
        faucetDataUpdateInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }
  create(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { transactionInputs } = transaction

      const txInputs = validate(
        JSON.parse(transactionInputs),
        'unable to parse transactionInputs'
      )

      // metadata
      const totalSupply = txInputs?.totalSupply
      const initializedSupply = txInputs?.initializedSupply
      const symbol = txInputs?.symbol
      const name = txInputs?.name

      const metadataStr = validateAndCreateJsonString({
        symbol,
        name,
        totalSupply,
        initializedSupply,
      })

      const addProgramMetadata = buildProgramUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      const addTokenMetadata = buildTokenUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      // data
      const imgUrl = txInputs?.imgUrl
      const methods = 'addProgram,create,faucet,update'

      const dataStr = validateAndCreateJsonString({
        type: 'faucet',
        imgUrl,
        methods,
        programs: JSON.stringify({}),
      })

      const addProgramData = buildProgramUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const addTokenData = buildTokenUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      // instructions
      const programDataUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), [addProgramData])
        ),
      })

      const programMetadataUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), [addProgramMetadata])
        ),
      })

      const faucetDistributionInstruction = buildTokenDistributionInstruction({
        programId: THIS,
        to: transaction.from,
        initializedSupply: formatAmountToHex('1'),
        tokenUpdates: [addTokenMetadata, addTokenData],
      })

      const createInstruction = buildCreateInstruction({
        from: transaction.from,
        programId: THIS,
        programOwner: transaction.from,
        totalSupply: formatAmountToHex('1'),
        initializedSupply: formatAmountToHex('1'),
        programNamespace: THIS,
        distributionInstruction: faucetDistributionInstruction,
      })

      return new Outputs(computeInputs, [
        createInstruction,
        programMetadataUpdateInstruction,
        programDataUpdateInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }
  faucet(computeInputs: ComputeInputs) {
    try {
      const { transaction, accountInfo } = computeInputs
      const { transactionInputs, from } = transaction
      const parsedInputMetadata = JSON.parse(transactionInputs)
      const to = parsedInputMetadata?.to
      const programToSend = parsedInputMetadata?.programAddress

      const supportedProgramsStr = validate(
        accountInfo?.programAccountData?.programs,
        'No programs found. Faucet is not initialized.'
      )

      const programsMap = validate(
        JSON.parse(supportedProgramsStr),
        'Requested program not found'
      )

      const faucetProgramDetails = validate(
        JSON.parse(programsMap[programToSend]),
        'No program details found. Faucet is not initialized.'
      )

      const faucetProgramData = validate(
        JSON.parse(faucetProgramDetails.pipeData),
        'Faucet pipedata not found'
      )

      const amountToFaucet = BigInt(faucetProgramData.faucetAmount)
      const addressTimeoutMinutes = faucetProgramData.addressTimeoutMinutes

      checkIfValuesAreUndefined({
        amountToFaucet,
        addressTimeoutMinutes,
      })

      const recipients = validate(
        JSON.parse(faucetProgramDetails.recipients),
        'No recipients object found.  Faucet is not initialized'
      )

      const faucetRecipientCanClaim = canClaimTokens(
        to,
        recipients,
        addressTimeoutMinutes
      )

      const currentTime = new Date().getTime()
      const faucetRecipientsUpdate = buildProgramUpdateField({
        field: 'data',
        value: JSON.stringify({
          programs: JSON.stringify({
            ...programsMap,
            [programToSend]: JSON.stringify({
              pipeData: faucetProgramDetails.pipeData,
              recipients: JSON.stringify({ ...recipients, [to]: currentTime }),
            }),
          }),
        }),
        action: 'extend',
      })

      const programUpdates = [faucetRecipientsUpdate]

      const faucetDataUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)
        ),
      })

      const transferToCaller = buildTransferInstruction({
        from: 'this',
        to: to,
        tokenAddress: programToSend,
        amount: amountToFaucet,
      })

      return new Outputs(computeInputs, [
        transferToCaller,
        faucetDataUpdateInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }
}

function canClaimTokens(
  recipientAddress: string,
  recipients: any,
  cycleTimeMin: string = '1'
) {
  const currentTime = new Date().getTime()
  const lastClaimTime = recipients[recipientAddress]
  if (lastClaimTime === undefined) {
    return true
  }

  const parsedCycleTimeMin = parseInt(cycleTimeMin)
  const oneHour = 60 * 1000 * parsedCycleTimeMin
  const timeSinceLastClaim = currentTime - lastClaimTime
  return timeSinceLastClaim >= oneHour
}

const start = (input: ComputeInputs) => {
  try {
    const contract = new FaucetProgram()
    return contract.start(input)
  } catch (e) {
    throw e
  }
}

process.stdin.setEncoding('utf8')

let data = ''

process.stdin.on('readable', () => {
  try {
    let chunk

    while ((chunk = process.stdin.read()) !== null) {
      data += chunk
    }
  } catch (e) {
    throw e
  }
})

process.stdin.on('end', () => {
  try {
    const parsedData = JSON.parse(data)
    const result = start(parsedData)
    process.stdout.write(JSON.stringify(result))
  } catch (err) {
    // @ts-ignore
    process.stdout.write(err.message)
  }
})
