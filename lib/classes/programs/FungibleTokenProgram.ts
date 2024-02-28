import { Program } from './Program'
import { ComputeInputs } from '../../types'
import { TokenUpdateBuilder } from '../builders'
import { AddressOrNamespace, TokenOrProgramUpdate } from '../utils'
import Address from '../Address'
import { Outputs } from '../Outputs'

import {
  TokenField,
  TokenFieldValue,
  TokenUpdate,
  TokenUpdateField,
} from '../Token'
import {
  buildBurnInstruction,
  buildCreateInstruction,
  buildMintInstructions,
  buildTokenUpdateField,
  buildTokenDistributionInstruction,
  buildProgramUpdateField,
  buildUpdateInstruction,
} from '../../builders'
import { ApprovalsExtend, ApprovalsValue } from '../Approvals'
import { ETH_PROGRAM_ADDRESS, THIS } from '../../consts'
import { ProgramUpdate } from '../Program'
import { formatVerse } from '../../utils'

/**
 * Class representing a fungible token program, extending the base `Program` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export class FungibleTokenProgram extends Program {
  /**
   * Constructs a new instance of the FungibleTokenProgram class.
   */
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      approve: this.approve.bind(this),
      burn: this.burn.bind(this),
      create: this.create.bind(this),
      mint: this.mint.bind(this),
    })
  }

  approve(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const { transactionInputs, programId } = transaction
    const tokenId = new AddressOrNamespace(new Address(programId))
    const caller = new Address(transaction.from)
    const update = new TokenUpdateField(
      new TokenField('approvals'),
      new TokenFieldValue(
        'insert',
        new ApprovalsValue(new ApprovalsExtend([JSON.parse(transactionInputs)]))
      )
    )

    const tokenUpdate = new TokenUpdate(
      new AddressOrNamespace(caller),
      tokenId,
      [update]
    )
    const tokenOrProgramUpdate = new TokenOrProgramUpdate(
      'tokenUpdate',
      tokenUpdate
    )
    const updateInstruction = new TokenUpdateBuilder()
      .addTokenAddress(tokenId)
      .addUpdateField(tokenOrProgramUpdate)
      .build()

    return new Outputs(computeInputs, [updateInstruction]).toJson()
  }

  burn(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const burnInstruction = buildBurnInstruction({
      from: transaction.from,
      caller: transaction.from,
      programId: THIS,
      tokenAddress: transaction.programId,
      amount: transaction.value,
    })

    return new Outputs(computeInputs, [burnInstruction]).toJson()
  }

  create(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const { transactionInputs, from } = transaction
    const txInputs = JSON.parse(transactionInputs)
    const totalSupply = formatVerse(txInputs?.totalSupply)
    const initializedSupply = formatVerse(txInputs?.initializedSupply)
    const to = txInputs?.to ?? from
    const symbol = txInputs?.symbol
    const name = txInputs?.name

    if (!totalSupply || !initializedSupply) {
      throw new Error('Invalid totalSupply or initializedSupply')
    }

    if (!symbol || !name) {
      throw new Error('Invalid symbol or name')
    }

    const tokenUpdateField = buildTokenUpdateField({
      field: 'metadata',
      value: JSON.stringify({ symbol, name, totalSupply }),
      action: 'extend',
    })
    if (tokenUpdateField instanceof Error) {
      throw tokenUpdateField
    }

    const programUpdateField = buildProgramUpdateField({
      field: 'metadata',
      value: JSON.stringify({ symbol, name, totalSupply }),
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

    const tokenUpdates = [tokenUpdateField]

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

    return new Outputs(computeInputs, [
      createAndDistributeInstruction,
      programMetadataUpdateInstruction,
    ]).toJson()
  }

  mint(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const inputTokenAddress = ETH_PROGRAM_ADDRESS
    const paymentValue = BigInt(transaction?.value)
    const conversionRate = BigInt(2)
    const returnedValue = paymentValue / conversionRate

    const mintInstructions = buildMintInstructions({
      from: transaction.from,
      programId: transaction.programId,
      paymentTokenAddress: inputTokenAddress,
      paymentValue: paymentValue,
      returnedValue: returnedValue,
    })

    return new Outputs(computeInputs, mintInstructions).toJson()
  }
}
