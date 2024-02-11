import { AddressOrNamespace, TokenOrProgramUpdate } from './utils'
import { TokenDistribution, TokenUpdate, TokenUpdateField } from './Token'
import { U256 } from './U256'
import Address from './Address'
import {
  BurnInstruction,
  CreateInstruction,
  Instruction,
  TransferInstruction,
  UpdateInstruction,
} from './Instruction'
import { Outputs } from './Outputs'

export class TokenUpdateBuilder {
  private account: AddressOrNamespace | null
  private token: AddressOrNamespace | null
  private updates: TokenOrProgramUpdate[]

  constructor() {
    this.account = null
    this.token = null
    this.updates = []
  }

  addUpdateAccountAddress(account: AddressOrNamespace): TokenUpdateBuilder {
    this.account = account
    return this
  }

  addTokenAddress(tokenAddress: AddressOrNamespace): TokenUpdateBuilder {
    this.token = tokenAddress
    return this
  }

  addUpdateField(updateField: TokenOrProgramUpdate): TokenUpdateBuilder {
    this.updates.push(updateField)
    return this
  }

  build(): Instruction {
    const account =
      this.account instanceof AddressOrNamespace
        ? (this.account.toJson() as AddressOrNamespace)
        : this.account ?? null
    const token = this.token ?? null
    return new Instruction(
      'update',
      new UpdateInstruction(
        this.updates.map((update) => update.toJson()) as TokenOrProgramUpdate[]
      )
    )
  }
}

export class TokenDistributionBuilder {
  private programId: AddressOrNamespace | null
  private to: AddressOrNamespace | null
  private amount: string | null
  private tokenIds: string[]
  private updateFields: TokenUpdateField[]

  constructor() {
    this.programId = null
    this.to = null
    this.amount = null
    this.tokenIds = []
    this.updateFields = []
  }

  setProgramId(programId: AddressOrNamespace): TokenDistributionBuilder {
    this.programId = programId
    return this
  }

  setReceiver(receiver: AddressOrNamespace): TokenDistributionBuilder {
    this.to = receiver
    return this
  }

  setAmount(amount: string): TokenDistributionBuilder {
    this.amount = amount
    return this
  }

  addTokenId(tokenId: string): TokenDistributionBuilder {
    this.tokenIds.push(tokenId)
    return this
  }

  addUpdateField(updateField: TokenUpdateField): TokenDistributionBuilder {
    this.updateFields.push(updateField)
    return this
  }

  extendTokenIds(items: string[]): TokenDistributionBuilder {
    this.tokenIds.push(...items)
    return this
  }

  extendUpdateFields(items: TokenUpdateField[]): TokenDistributionBuilder {
    this.updateFields.push(...items)
    return this
  }

  build(): TokenDistribution {
    const programId =
      this.programId instanceof AddressOrNamespace
        ? (this.programId.toJson() as AddressOrNamespace)
        : this.programId ?? null

    const to =
      this.to instanceof AddressOrNamespace
        ? (this.to.toJson() as AddressOrNamespace)
        : this.to ?? null

    return new TokenDistribution(
      programId,
      to,
      this.amount,
      this.tokenIds.map((tokenId) => tokenId as string),
      this.updateFields.map((updateField) =>
        updateField.toJson()
      ) as TokenUpdateField[]
    )
  }
}

export class CreateInstructionBuilder {
  private programNamespace: AddressOrNamespace | null = null
  private programId: AddressOrNamespace | null = null
  private programOwner: Address | null = null
  private totalSupply: string | null = null
  private initializedSupply: string | null = null
  private distribution: TokenDistribution[] = []

  setProgramNamespace(
    programNamespace: AddressOrNamespace
  ): CreateInstructionBuilder {
    this.programNamespace = programNamespace
    return this
  }

  setProgramId(programId: AddressOrNamespace): CreateInstructionBuilder {
    this.programId = programId
    return this
  }

  setProgramOwner(programOwner: Address): CreateInstructionBuilder {
    this.programOwner = programOwner
    return this
  }

  setTotalSupply(totalSupply: string): CreateInstructionBuilder {
    this.totalSupply = totalSupply
    return this
  }

  setInitializedSupply(initializedSupply: string): CreateInstructionBuilder {
    this.initializedSupply = initializedSupply
    return this
  }

  addTokenDistribution(
    tokenDistribution: TokenDistribution
  ): CreateInstructionBuilder {
    this.distribution.push(tokenDistribution)
    return this
  }

  extendTokenDistribution(
    items: TokenDistribution[]
  ): CreateInstructionBuilder {
    this.distribution.push(...items)
    return this
  }

  build(): Instruction {
    return new Instruction(
      'create',
      new CreateInstruction(
        this.programNamespace,
        this.programId,
        this.programOwner,
        this.totalSupply,
        this.initializedSupply,
        this.distribution
      )
    )
  }
}

export class UpdateInstructionBuilder {
  private updates: TokenOrProgramUpdate[] = []

  addUpdate(update: TokenOrProgramUpdate): UpdateInstructionBuilder {
    this.updates.push(update)
    return this
  }

  extendUpdates(items: TokenOrProgramUpdate[]): UpdateInstructionBuilder {
    this.updates.push(...items)
    return this
  }

  build(): Instruction {
    return new Instruction('update', new UpdateInstruction(this.updates))
  }
}

export class TransferInstructionBuilder {
  private token: Address | null = null
  private transferFrom: AddressOrNamespace | null = null
  private transferTo: AddressOrNamespace | null = null
  private amount: string | null = null
  private ids: string[] = []

  setTokenAddress(tokenAddress: Address): TransferInstructionBuilder {
    this.token = tokenAddress
    return this
  }

  setTransferFrom(
    transferFrom: AddressOrNamespace
  ): TransferInstructionBuilder {
    this.transferFrom = transferFrom
    return this
  }

  setTransferTo(transferTo: AddressOrNamespace): TransferInstructionBuilder {
    this.transferTo = transferTo
    return this
  }

  setAmount(amount: string | null): TransferInstructionBuilder {
    this.amount = amount
    return this
  }

  addTokenIds(tokenIds: string[]): TransferInstructionBuilder {
    this.ids.push(...tokenIds)
    return this
  }

  extendTokenIds(items: string[]): TransferInstructionBuilder {
    this.ids.push(...items)
    return this
  }

  build(): Instruction {
    const token = this.token ?? null
    return new Instruction(
      'transfer',
      new TransferInstruction(
        token,
        this.transferFrom,
        this.transferTo,
        this.amount,
        this.ids
      )
    )
  }
}

export class BurnInstructionBuilder {
  private caller: Address | null = null
  private programId: AddressOrNamespace | null = null
  private token: Address | null = null
  private burnFrom: AddressOrNamespace | null = null
  private amount: string | null = null
  private tokenIds: string[] = []

  setCaller(caller: Address): BurnInstructionBuilder {
    this.caller = caller
    return this
  }

  setProgramId(programId: AddressOrNamespace): BurnInstructionBuilder {
    this.programId = programId
    return this
  }

  setTokenAddress(tokenAddress: Address): BurnInstructionBuilder {
    this.token = tokenAddress
    return this
  }

  setBurnFromAddress(
    burnFromAddress: AddressOrNamespace
  ): BurnInstructionBuilder {
    this.burnFrom = burnFromAddress
    return this
  }

  setAmount(amount: string): BurnInstructionBuilder {
    this.amount = amount
    return this
  }

  addTokenId(tokenId: string): BurnInstructionBuilder {
    this.tokenIds.push(tokenId)
    return this
  }

  extendTokenIds(items: string[]): BurnInstructionBuilder {
    this.tokenIds.push(...items)
    return this
  }

  build(): Instruction {
    return new Instruction(
      'burn',
      new BurnInstruction(
        this.caller,
        this.programId,
        this.token,
        this.burnFrom,
        this.amount,
        this.tokenIds
      )
    )
  }
}

export class LogInstructionBuilder {
  // Future implementation goes here
}

export class OutputBuilder {
  private inputs = null
  private instructions: Instruction[] = []

  setInputs(inputs: any): OutputBuilder {
    this.inputs = inputs
    return this
  }

  addInstruction(instruction: Instruction): OutputBuilder {
    this.instructions.push(instruction)
    return this
  }

  build(): Outputs {
    return new Outputs(this.inputs, this.instructions)
  }
}
