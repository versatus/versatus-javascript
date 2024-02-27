import { Program } from './Program'
import { ComputeInputs } from '../../types'
import { Outputs } from '../Outputs'

import {
  buildCreateInstruction,
  buildTransferInstruction,
  buildProgramUpdateField,
  buildUpdateInstruction,
} from '../../builders'
import { THIS } from '../../consts'
import { AddressOrNamespace, TokenOrProgramUpdate } from '../utils'
import { ProgramUpdate } from '../Program'
import { formatVerse, parseVerse } from '../../utils'

/**
 * Class representing a faucet program, extending the base `Program` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export class FaucetProgram extends Program {
  /**
   * Constructs a new instance of the FungibleTokenProgram class.
   */
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      addProgram: this.addProgram.bind(this),
      create: this.create.bind(this),
      faucet: this.faucet.bind(this),
    })
  }

  addProgram(computeInputs: ComputeInputs) {
    const { transaction, accountInfo } = computeInputs
    const { transactionInputs, from } = transaction
    const parsedTransactionInput = JSON.parse(transactionInputs)
    const programAddressToFaucet =
      parsedTransactionInput?.programAddressToFaucet
    const tankAmount = parseVerse(parsedTransactionInput?.tankAmount)
    const flowAmount = parsedTransactionInput?.flowAmount ?? '1'
    const flowAmountFormatted = formatVerse(flowAmount)

    const faucetAccountData = accountInfo?.programAccountData

    const transferToProgram = buildTransferInstruction({
      from: from,
      to: 'this',
      tokenAddress: programAddressToFaucet,
      amount: tankAmount,
    })

    const supportedProgramsStr = faucetAccountData?.programs
    if (!supportedProgramsStr) {
      throw new Error('Faucet not created yet')
    }

    const programsMap = JSON.parse(supportedProgramsStr)
    if (!programsMap) {
      throw new Error(
        'Programs Object not found. Have you created the Faucet yet?'
      )
    }

    const faucetRecipientsUpdate = buildProgramUpdateField({
      field: 'data',
      value: JSON.stringify({
        programs: JSON.stringify({
          ...programsMap,
          [programAddressToFaucet]: JSON.stringify({
            pipeData: JSON.stringify({
              flowAmount: flowAmountFormatted,
              cycleTimeMin: '1',
            }),
            recipients: JSON.stringify({}),
          }),
        }),
      }),
      action: 'extend',
    })

    if (faucetRecipientsUpdate instanceof Error) {
      throw faucetRecipientsUpdate
    }

    const programUpdates = [faucetRecipientsUpdate]

    const programDataUpdateInstruction = buildUpdateInstruction({
      update: new TokenOrProgramUpdate(
        'programUpdate',
        new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)
      ),
    })

    return new Outputs(computeInputs, [
      transferToProgram,
      programDataUpdateInstruction,
    ]).toJson()
  }

  create(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const { transactionInputs } = transaction
    const initializedSupply =
      JSON.parse(transactionInputs)?.initializedSupply ?? '0'
    const totalSupply = JSON.parse(transactionInputs)?.totalSupply ?? '0'

    const createInstruction = buildCreateInstruction({
      from: transaction.from,
      initializedSupply: initializedSupply,
      totalSupply: totalSupply,
      programId: THIS,
      programOwner: transaction.from,
      programNamespace: THIS,
    })

    const faucetRecipientsInit = buildProgramUpdateField({
      field: 'data',
      value: JSON.stringify({
        programs: JSON.stringify({}),
      }),
      action: 'extend',
    })

    if (faucetRecipientsInit instanceof Error) {
      throw faucetRecipientsInit
    }

    const createSupportedProgramsAndRecipientsUpdateInstruction =
      buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), [
            faucetRecipientsInit,
          ])
        ),
      })

    const programUpdateField = buildProgramUpdateField({
      field: 'metadata',
      value: transactionInputs,
      action: 'extend',
    })

    if (programUpdateField instanceof Error) {
      throw programUpdateField
    }

    const programUpdates = [programUpdateField]

    const programMetadataUpdateInstruction = buildUpdateInstruction({
      update: new TokenOrProgramUpdate(
        'programUpdate',
        new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)
      ),
    })

    return new Outputs(computeInputs, [
      createInstruction,
      programMetadataUpdateInstruction,
      createSupportedProgramsAndRecipientsUpdateInstruction,
    ]).toJson()
  }

  faucet(computeInputs: ComputeInputs) {
    const { transaction, accountInfo } = computeInputs
    const { transactionInputs, from } = transaction
    const parsedInputMetadata = JSON.parse(transactionInputs)
    const to = parsedInputMetadata?.to
    const programAddressToFaucet =
      parsedInputMetadata?.programAddressToFaucet ?? transaction.programId

    const faucetAccountData = accountInfo?.programAccountData

    if (!faucetAccountData) {
      throw new Error('Faucet not initialized')
    }

    const supportedProgramsStr = faucetAccountData.programs
    if (!supportedProgramsStr) {
      throw new Error('No programs found. Faucet is not initialized.')
    }

    const programsMap = JSON.parse(supportedProgramsStr)
    if (!programsMap) {
      throw new Error('Requested program not found')
    }

    const faucetProgramMap = JSON.parse(programsMap[programAddressToFaucet])
    if (!faucetProgramMap) {
      throw new Error('Desired program not found')
    }

    const faucetProgramData = faucetProgramMap.pipeData
    if (!faucetProgramData) {
      throw new Error('Faucet pipeData not found')
    }

    const amountToFaucet = parseVerse(faucetProgramData.flowAmount ?? '1')
    const cycleTimeMin = faucetProgramData.cycleTimeMin ?? '1'
    const recipients = faucetProgramMap.recipients
    const faucetRecipientCanClaim = canClaimTokens(to, recipients, cycleTimeMin)

    if (!faucetRecipientCanClaim) {
      throw new Error('Too soon to claim tokens.')
    }

    const currentTime = new Date().getTime()
    const faucetRecipientsUpdate = buildProgramUpdateField({
      field: 'data',
      value: JSON.stringify({
        programs: JSON.stringify({
          [programAddressToFaucet]: JSON.stringify({
            recipients: JSON.stringify({ [to]: currentTime }),
          }),
        }),
      }),
      action: 'extend',
    })

    if (faucetRecipientsUpdate instanceof Error) {
      throw faucetRecipientsUpdate
    }

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
      tokenAddress: programAddressToFaucet,
      amount: amountToFaucet,
    })

    return new Outputs(computeInputs, [
      transferToCaller,
      faucetDataUpdateInstruction,
    ]).toJson()
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
