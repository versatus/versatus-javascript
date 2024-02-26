import { Program } from './Program'
import { ComputeInputs } from '../../types'
import { Outputs } from '../Outputs'

import {
  buildCreateInstruction,
  buildTokenUpdateField,
  buildTokenDistributionInstruction,
  buildTransferInstruction,
  buildProgramMetadataUpdateInstruction,
  buildProgramUpdateField,
  buildUpdateInstruction,
} from '../../builders'
import { ETH_PROGRAM_ADDRESS, THIS } from '../../consts'
import { AddressOrNamespace, TokenOrProgramUpdate } from '../utils'
import { ProgramUpdate } from '../Program'
import { formatVerse } from '../../utils'

/**
 * Class representing a fungible token program, extending the base `Program` class.
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
      create: this.create.bind(this),
      createAndDistribute: this.createAndDistribute.bind(this),
      faucet: this.faucet.bind(this),
    })
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

    return new Outputs(computeInputs, [createInstruction]).toJson()
  }

  createAndDistribute(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const { transactionInputs, from, programId } = transaction
    const parsedInputMetadata = JSON.parse(transactionInputs)
    const totalSupply = parsedInputMetadata?.totalSupply ?? '0'
    const initializedSupply = parsedInputMetadata?.initializedSupply ?? '0'
    const to = parsedInputMetadata?.to ?? from

    const tokenUpdateField = buildTokenUpdateField({
      field: 'metadata',
      value: transactionInputs,
      action: 'extend',
    })
    if (tokenUpdateField instanceof Error) {
      throw tokenUpdateField
    }

    const tokenUpdates = [tokenUpdateField]

    const programMetadataUpdateInstruction =
      buildProgramMetadataUpdateInstruction({ transactionInputs })

    const distributionInstruction = buildTokenDistributionInstruction({
      programId: THIS,
      initializedSupply,
      to,
      tokenUpdates,
    })

    const createAndDistributeInstruction = buildCreateInstruction({
      from,
      initializedSupply,
      totalSupply,
      programId: THIS,
      programOwner: from,
      programNamespace: THIS,
      distributionInstruction,
    })

    const faucetRecipientsInit = buildProgramUpdateField({
      field: 'data',
      value: JSON.stringify({
        programs: JSON.stringify({
          [programId]: JSON.stringify({ recipients: JSON.stringify({}) }),
        }),
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

    return new Outputs(computeInputs, [
      createAndDistributeInstruction,
      programMetadataUpdateInstruction,
      createSupportedProgramsAndRecipientsUpdateInstruction,
    ]).toJson()
  }

  faucet(computeInputs: ComputeInputs) {
    const { transaction, accountInfo } = computeInputs
    const { transactionInputs, from } = transaction
    const parsedInputMetadata = JSON.parse(transactionInputs)
    const amountToFaucet = BigInt(formatVerse('1'))
    const to = parsedInputMetadata?.to
    const programAddressToFaucet =
      parsedInputMetadata?.programAddressToFaucet ?? transaction.programId

    const transferToCaller = buildTransferInstruction({
      from: 'this',
      to: to,
      tokenAddress: programAddressToFaucet,
      amount: amountToFaucet,
    })

    const supportedProgramsStr = accountInfo?.programAccountData.programs
    if (!supportedProgramsStr) {
      throw new Error('No programs found')
    }

    const programsMap = JSON.parse(supportedProgramsStr)
    if (!programsMap) {
      throw new Error('Requested program not found')
    }

    const desiredProgramMap = JSON.parse(programsMap[programAddressToFaucet])
    if (!desiredProgramMap) {
      throw new Error('Desired program not found')
    }

    const recipients = desiredProgramMap.recipients
    const faucetRecipientCanClaim = canClaimTokens(to, recipients)

    if (!faucetRecipientCanClaim) {
      throw new Error('Too soon to claim tokens.')
    }

    const currentTime = new Date().getTime()

    const faucetRecipientsUpdate = buildProgramUpdateField({
      field: 'data',
      value: JSON.stringify({
        recipients: JSON.stringify({ [to]: currentTime }),
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
      transferToCaller,
      programDataUpdateInstruction,
    ]).toJson()
  }
}

function canClaimTokens(recipientAddress: string, recipients: any) {
  const currentTime = new Date().getTime()
  const lastClaimTime = recipients[recipientAddress]
  if (lastClaimTime === undefined) {
    return true
  }

  const oneHour = 60 * 1000
  const timeSinceLastClaim = currentTime - lastClaimTime
  return timeSinceLastClaim >= oneHour
}
