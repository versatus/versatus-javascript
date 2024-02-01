import { Contract } from './Contract'
import { Inputs } from '../../types'
import {
  CreateInstructionBuilder,
  TokenDistributionBuilder,
  TokenUpdateBuilder,
  TransferInstructionBuilder,
} from '../builders'
import { AddressOrNamespace } from '../utils'
import Address from '../Address'
import { Outputs } from '../Outputs'
import { Instruction, UpdateInstruction } from '../Instruction'
import {
  TokenField,
  TokenFieldValue,
  TokenMetadataExtend,
  TokenUpdateField,
} from '../Token'
import { bigIntToHexString } from '../../helpers'

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
      create: this.create.bind(this),
      mint: this.mint.bind(this),
    }
  }

  approve(inputs: Inputs) {
    const { transaction } = inputs
    const { inputs: approveData, programId } = transaction
    const tokenId = new Address(programId)
    const caller = new Address(transaction.from)
    const update = new TokenUpdateField(
      new TokenField('approvals'),
      new TokenFieldValue(
        'approvals',
        new TokenMetadataExtend(JSON.parse(approveData))
      )
    )

    const approvalUpdate = new TokenUpdateBuilder()
      .addTokenAddress(new AddressOrNamespace(tokenId))
      .addUpdateAccountAddress(new AddressOrNamespace(caller))
      .addUpdateField(update)
      .build()

    const updateInstruction = new Instruction('update', approvalUpdate)

    return new Outputs(inputs, [updateInstruction]).toJson()
  }

  create(inputs: Inputs) {
    const { transaction } = inputs
    const { inputs: createMetadata } = transaction
    const caller = new Address(transaction.from)
    const update = new TokenUpdateField(
      new TokenField('metadata'),
      new TokenFieldValue(
        'metadata',
        new TokenMetadataExtend(JSON.parse(createMetadata))
      )
    )

    const initUpdates = [update]

    const initDistribution = new TokenDistributionBuilder()
      .setProgramId(new AddressOrNamespace('this'))
      .setAmount(bigIntToHexString(BigInt(transaction.value)))
      .setReceiver(new AddressOrNamespace(caller))
      .extendUpdateFields(initUpdates)
      .build()

    const create = new CreateInstructionBuilder()
      .setProgramId(new AddressOrNamespace('this'))
      .setTotalSupply(bigIntToHexString(BigInt(transaction.value)))
      .setInitializedSupply(bigIntToHexString(BigInt(transaction.value)))
      .setProgramOwner(caller)
      .setProgramNamespace(new AddressOrNamespace('this'))
      .addTokenDistribution(initDistribution)
      .build()

    const createInstruction = new Instruction('create', create)

    return new Outputs(inputs, [createInstruction]).toJson()
  }

  mint(inputs: Inputs) {
    const { transaction } = inputs
    const caller = new Address(transaction.from)
    const payable = BigInt(transaction.value)
    const payableToken = new Address(transaction.programId)
    const minter = transaction.to
    const amount = bigIntToHexString(payable / BigInt('0x1'))

    const transferTo = new TransferInstructionBuilder()
      .setTransferFrom(new AddressOrNamespace('this'))
      .setTransferTo(new AddressOrNamespace(caller))
      .setAmount(amount)
      .setTokenAddress(new Address(minter))
      .build()

    const transferFrom = new TransferInstructionBuilder()
      .setTransferFrom(new AddressOrNamespace(caller))
      .setTransferTo(new AddressOrNamespace('this'))
      .setAmount(bigIntToHexString(payable))
      .setTokenAddress(payableToken)
      .build()

    const transferToInstruction = new Instruction('transfer', transferTo)
    const transferFromInstruction = new Instruction('transfer', transferFrom)

    return new Outputs(inputs, [
      transferToInstruction,
      transferFromInstruction,
    ]).toJson()
  }
}
