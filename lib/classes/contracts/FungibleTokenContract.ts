import { Contract } from './Contract'
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
} from '../../helpers'
import { ApprovalsExtend, ApprovalsValue } from '../Approvals'
import { THIS } from '../../consts'

/**
 * Class representing a fungible token contract, extending the base `Contract` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export class FungibleTokenContract extends Contract {
  /**
   * Constructs a new instance of the FungibleTokenContract class.
   */
  constructor() {
    super()
    this.methodStrategies = {
      approve: this.approve.bind(this),
      burn: this.burn.bind(this),
      create: this.create.bind(this),
      createAndDistribute: this.createAndDistribute.bind(this),
      mint: this.mint.bind(this),
    }
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
    const { transactionInputs } = transaction
    const initializedSupply =
      JSON.parse(transactionInputs)?.initializedSupply ?? '0'
    const totalSupply = JSON.parse(transactionInputs)?.totalSupply

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
    const { transactionInputs } = transaction
    const parsedInputMetadata = JSON.parse(transactionInputs)
    const totalSupply = parsedInputMetadata?.totalSupply ?? '0'
    const initializedSupply = parsedInputMetadata?.initializedSupply ?? '0'
    const to = parsedInputMetadata?.to ?? transaction.from

    const tokenUpdateField = buildTokenUpdateField({
      field: 'metadata',
      value: transactionInputs,
      action: 'extend',
    })
    if (tokenUpdateField instanceof Error) {
      throw tokenUpdateField
    }

    const tokenUpdates = [tokenUpdateField]
    const initDistribution = buildTokenDistributionInstruction({
      programId: THIS,
      initializedSupply: initializedSupply,
      caller: to,
      tokenUpdates: tokenUpdates,
    })

    const createAndDistributeInstruction = buildCreateInstruction({
      from: transaction.from,
      initializedSupply: initializedSupply,
      totalSupply: totalSupply,
      programId: THIS,
      programOwner: transaction.from,
      programNamespace: THIS,
      distributionInstruction: initDistribution,
    })

    return new Outputs(computeInputs, [createAndDistributeInstruction]).toJson()
  }

  mint(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const inputTokenAddress = '0x0000000000000000000000000000000000000000'
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

    return new Outputs(computeInputs, [...mintInstructions]).toJson()
  }
}
