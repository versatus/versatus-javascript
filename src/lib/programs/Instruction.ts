import { Address, AddressOrNamespace } from '@/lib/programs/Address-Namespace'
import { TokenDistribution, TokenOrProgramUpdate } from '@/lib/programs/Token'
import { InstructionKinds } from '@/lib/types'

export class Instruction {
  private kind: InstructionKinds
  private value:
    | CreateInstruction
    | UpdateInstruction
    | TransferInstruction
    | BurnInstruction
    | LogInstruction

  constructor(
    kind: InstructionKinds,
    value:
      | CreateInstruction
      | UpdateInstruction
      | TransferInstruction
      | BurnInstruction
      | LogInstruction
  ) {
    this.kind = kind
    this.value = value
  }

  toJson(): object {
    return { [this.kind]: this.value.toJson() }
  }
}

export class CreateInstruction {
  private programNamespace: AddressOrNamespace | null
  private programId: AddressOrNamespace | null
  private programOwner: Address | null
  private totalSupply: string | null
  private initializedSupply: string | null
  private distribution: TokenDistribution[]

  constructor(
    programNamespace: AddressOrNamespace | null,
    programId: AddressOrNamespace | null,
    programOwner: Address | null,
    totalSupply: string | null,
    initializedSupply: string | null,
    distribution: TokenDistribution[]
  ) {
    this.programNamespace = programNamespace
    this.programId = programId
    this.programOwner = programOwner
    this.totalSupply = totalSupply
    this.initializedSupply = initializedSupply
    this.distribution = distribution
  }

  toJson(): object {
    const programNamespace =
      this.programNamespace instanceof AddressOrNamespace
        ? this.programNamespace.toJson()
        : this.programNamespace ?? null

    const programId =
      this.programId instanceof AddressOrNamespace
        ? this.programId.toJson()
        : this.programId ?? null
    return {
      programNamespace,
      programId,
      programOwner: this.programOwner?.toJson(),
      totalSupply: this.totalSupply?.toString(),
      initializedSupply: this.initializedSupply?.toString(),
      distribution: this.distribution.map((dist) => dist.toJson()),
    }
  }
}

export class UpdateInstruction {
  private updates: TokenOrProgramUpdate[]

  constructor(updates: TokenOrProgramUpdate[]) {
    this.updates = updates
  }

  toJson(): object {
    return {
      updates: this.updates.map((update) => update.toJson()),
    }
  }
}

export class TransferInstruction {
  private token: Address | null
  private transferFrom: AddressOrNamespace | null
  private transferTo: AddressOrNamespace | null
  private amount: string | null
  private ids: string[]

  constructor(
    token: Address | null,
    transferFrom: AddressOrNamespace | null,
    transferTo: AddressOrNamespace | null,
    amount: string | null,
    ids: string[]
  ) {
    this.token = token
    this.transferFrom = transferFrom
    this.transferTo = transferTo
    this.amount = amount
    this.ids = ids
  }

  toJson(): object {
    return {
      token: this.token?.toJson(),
      from: this.transferFrom?.toJson(),
      to: this.transferTo?.toJson(),
      amount: this.amount,
      ids: this.ids.map((id) => id),
    }
  }
}

export class BurnInstruction {
  private caller: Address | null
  private programId: AddressOrNamespace | null
  private token: Address | null
  private burnFrom: AddressOrNamespace | null
  private amount: string | null
  private tokenIds: string[]

  constructor(
    caller: Address | null,
    programId: AddressOrNamespace | null,
    token: Address | null,
    burnFrom: AddressOrNamespace | null,
    amount: string | null,
    tokenIds: string[]
  ) {
    this.caller = caller
    this.programId = programId
    this.token = token
    this.burnFrom = burnFrom
    this.amount = amount
    this.tokenIds = tokenIds
  }

  toJson(): object {
    return {
      caller: this.caller?.toJson(),
      programId: this.programId?.toJson(),
      token: this.token?.toJson(),
      from: this.burnFrom?.toJson(),
      amount: this.amount === null ? null : this.amount,
      tokenIds: this.tokenIds.map((id) => id),
    }
  }
}

export class LogInstruction {
  toJson(): object {
    return {}
  }
}
