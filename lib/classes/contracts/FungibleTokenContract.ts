import { Contract } from './Contract'
import { Inputs } from '../../types'
import {
  BurnInstructionBuilder,
  CreateInstructionBuilder,
  TokenDistributionBuilder,
  TokenUpdateBuilder,
  TransferInstructionBuilder,
  UpdateInstructionBuilder,
} from '../builders'
import { AddressOrNamespace, TokenOrProgramUpdate } from '../utils'
import Address from '../Address'
import { Outputs } from '../Outputs'
import { Instruction, UpdateInstruction } from '../Instruction'
import {
  TokenField,
  TokenFieldValue,
  TokenMetadataExtend,
  TokenUpdate,
  TokenUpdateField,
} from '../Token'
import { bigIntToHexString } from '../../helpers'
import { ApprovalsExtend, ApprovalsValue } from '../Approvals'

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

  approve(inputs: Inputs) {
    const { transaction } = inputs
    const { inputs: approveData, programId } = transaction
    const tokenId = new AddressOrNamespace(new Address(programId))
    const caller = new Address(transaction.from)
    const update = new TokenUpdateField(
      new TokenField('approvals'),
      new TokenFieldValue(
        'insert',
        new ApprovalsValue(new ApprovalsExtend([JSON.parse(approveData)]))
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

    return new Outputs(inputs, [updateInstruction]).toJson()
  }

  burn(inputs: Inputs) {
    const { transaction, programId } = inputs
    const caller = new Address(transaction.from)

    const burnInstruction = new BurnInstructionBuilder()
      .setProgramId(new AddressOrNamespace('this'))
      .setCaller(caller)
      .setTokenAddress(new Address(transaction.programId))
      .setBurnFromAddress(new AddressOrNamespace(caller))
      .setAmount(bigIntToHexString(BigInt(transaction?.value ?? 0)))
      .build()

    return new Outputs(inputs, [burnInstruction]).toJson()
  }

  create(inputs: Inputs) {
    const { transaction, inputs: contractInputs } = inputs
    const caller = new Address(transaction.from)

    const createInstruction = new CreateInstructionBuilder()
      .setProgramId(new AddressOrNamespace('this'))
      .setTotalSupply(
        bigIntToHexString(BigInt(JSON.parse(contractInputs).totalSupply))
      )
      .setInitializedSupply(bigIntToHexString(BigInt(0)))
      .setProgramOwner(caller)
      .setProgramNamespace(new AddressOrNamespace('this'))
      .build()

    return new Outputs(inputs, [createInstruction]).toJson()
  }

  createAndDistribute(inputs: Inputs) {
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
    const totalSupply = JSON.parse(createMetadata)?.totalSupply ?? 0
    const initalizedSupply = transaction?.value ?? 0

    const initUpdates = [update]
    const initDistribution = new TokenDistributionBuilder()
      .setProgramId(new AddressOrNamespace('this'))
      .setAmount(bigIntToHexString(BigInt(initalizedSupply)))
      .setReceiver(new AddressOrNamespace(caller))
      .extendUpdateFields(initUpdates)
      .build()

    const createInstruction = new CreateInstructionBuilder()
      .setProgramId(new AddressOrNamespace('this'))
      .setTotalSupply(bigIntToHexString(BigInt(totalSupply)))
      .setInitializedSupply(bigIntToHexString(BigInt(initalizedSupply)))
      .setProgramOwner(caller)
      .setProgramNamespace(new AddressOrNamespace('this'))
      .addTokenDistribution(initDistribution)
      .build()

    return new Outputs(inputs, [createInstruction]).toJson()
  }

  mint(inputs: Inputs) {
    const { transaction } = inputs
    const caller = new Address(transaction.from)
    const payable = BigInt(transaction?.value ?? 0)
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

    return new Outputs(inputs, [transferTo, transferFrom]).toJson()
  }
}
