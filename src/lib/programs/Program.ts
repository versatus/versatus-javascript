import { ComputeInputs, ProgramUpdateValueTypes } from '@/lib/types'
import {
  buildCreateInstruction,
  buildProgramUpdateField,
  buildTokenDistributionInstruction,
  buildTokenUpdateField,
  buildUpdateInstruction,
} from '@/lib/programs/instruction-builders/builder-helpers'
import { THIS } from '@/lib/consts'
import { Outputs } from '@/lib/programs/Outputs'
import { formatAmountToHex } from '@/lib/utils'
import { Address, AddressOrNamespace } from '@/lib/programs/Address-Namespace'
import { StatusValue, TokenOrProgramUpdate } from '@/lib/programs/Token'

/**
 * Class representing a Program with methods to manage and execute program strategies.
 */
export class Program {
  /**
   * A dictionary mapping method names to their corresponding strategy functions.
   * @type {{ [key: string]: Function }}
   */
  methodStrategies: { [key: string]: Function }

  /**
   * Constructs a new Program instance.
   */
  constructor() {
    this.methodStrategies = {
      create: this.create.bind(this),
      update: this.update.bind(this),
    }
  }

  create(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const { transactionInputs, from } = transaction
    const txInputs = JSON.parse(transactionInputs)
    const totalSupply = formatAmountToHex(txInputs?.totalSupply)
    const initializedSupply = formatAmountToHex(txInputs?.initializedSupply)
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
    const tokenUpdates = [tokenUpdateField]

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

  /**
   * Executes a program method strategy based on the given input.
   * @throws Will throw an error if the method name specified in `input` is not found in `methodStrategies`.
   * @returns The result of the strategy execution.
   * @param inputs
   */
  executeMethod(inputs: ComputeInputs) {
    const { op } = inputs
    const strategy = this.methodStrategies[op]

    if (strategy) {
      return strategy(inputs)
    }

    throw new Error(`Unknown method: ${op}`)
  }

  /**
   * Initiates the execution of a program method based on the provided input.
   * @returns The result of executing the program method.
   * @param computeInputs
   */
  start(computeInputs: ComputeInputs) {
    return this.executeMethod(computeInputs)
  }

  /**
   * Updates the program with the provided inputs.
   * @returns The result of updating the program.
   * @param computeInputs
   */
  update(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const { transactionInputs } = transaction
    const parsedTransactionInputs = JSON.parse(transactionInputs)

    const data = parsedTransactionInputs?.data ?? undefined
    const metadata = parsedTransactionInputs?.metadata ?? undefined
    // const status = parsedTransactionInputs?.status ?? ''

    const programUpdates = []

    if (metadata) {
      const fieldUpdate = buildProgramUpdateField({
        field: 'metadata',
        value: JSON.stringify(metadata),
        action: 'extend',
      })
      if (fieldUpdate instanceof Error) {
        throw fieldUpdate
      }
      programUpdates.push(fieldUpdate)
    }

    if (data) {
      const fieldUpdate = buildProgramUpdateField({
        field: 'data',
        value: JSON.stringify(data),
        action: 'extend',
      })
      if (fieldUpdate instanceof Error) {
        throw fieldUpdate
      }
      programUpdates.push(fieldUpdate)
    }

    const programMetadataUpdateInstruction = buildUpdateInstruction({
      update: new TokenOrProgramUpdate(
        'programUpdate',
        new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)
      ),
    })

    return new Outputs(computeInputs, [
      programMetadataUpdateInstruction,
    ]).toJson()
  }
}

export class ProgramUpdate {
  private account: AddressOrNamespace
  private updates: ProgramUpdateField[]

  constructor(account: AddressOrNamespace, updates: ProgramUpdateField[]) {
    this.account = account
    this.updates = updates
  }

  toJson(): object {
    return {
      account: this.account.toJson(),
      updates: this.updates.map((update) => update.toJson()),
    }
  }
}

export class ProgramUpdateField {
  private field: ProgramField
  private value: ProgramFieldValue

  constructor(field: ProgramField, value: ProgramFieldValue) {
    this.field = field
    this.value = value
  }

  toJson(): object {
    return {
      field: this.field.toJson(),
      value: this.value.toJson(),
    }
  }
}

export class ProgramField {
  private value: string

  constructor(value: string) {
    this.value = value
  }

  toJson(): string {
    return this.value
  }
}

export class LinkedProgramsInsert {
  private key: Address

  constructor(key: Address) {
    this.key = key
  }

  toJson(): object {
    return { insert: this.key.toJson() }
  }
}

export class LinkedProgramsExtend {
  private items: Address[]

  constructor(items: Address[]) {
    this.items = items
  }

  toJson(): object {
    return { extend: this.items.map((item) => item.toJson()) }
  }
}

export class LinkedProgramsRemove {
  private key: Address

  constructor(key: Address) {
    this.key = key
  }

  toJson(): object {
    return { remove: this.key.toJson() }
  }
}

export class LinkedProgramsValue {
  private value:
    | LinkedProgramsInsert
    | LinkedProgramsExtend
    | LinkedProgramsRemove

  constructor(
    value: LinkedProgramsInsert | LinkedProgramsExtend | LinkedProgramsRemove
  ) {
    this.value = value
  }

  toJson(): object {
    return { linkedPrograms: { linkedProgramValue: this.value.toJson() } }
  }
}

export class ProgramMetadataInsert {
  private key: string
  private value: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }

  toJson(): object {
    return { insert: [this.key, this.value] }
  }
}

export class ProgramMetadataExtend {
  private map: Record<string, string>

  constructor(map: Record<string, string>) {
    this.map = map
  }

  toJson(): object {
    return { extend: this.map }
  }
}

export class ProgramMetadataRemove {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  toJson(): object {
    return { remove: this.key }
  }
}

export class ProgramMetadataValue {
  private value:
    | ProgramMetadataInsert
    | ProgramMetadataExtend
    | ProgramMetadataRemove

  constructor(
    value: ProgramMetadataInsert | ProgramMetadataExtend | ProgramMetadataRemove
  ) {
    this.value = value
  }

  toJson(): object {
    return { metadata: this.value.toJson() }
  }
}

export class ProgramDataInsert {
  private key: string
  private value: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }

  toJson(): object {
    return { insert: [this.key, this.value] }
  }
}

export class ProgramDataExtend {
  private map: Record<string, string>

  constructor(map: Record<string, string>) {
    this.map = map
  }

  toJson(): object {
    return { extend: this.map }
  }
}

export class ProgramDataRemove {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  toJson(): object {
    return { remove: this.key }
  }
}

export class ProgramDataValue {
  private value: ProgramDataInsert | ProgramDataExtend | ProgramDataRemove

  constructor(
    value: ProgramDataInsert | ProgramDataExtend | ProgramDataRemove
  ) {
    this.value = value
  }

  toJson(): object {
    return { data: this.value.toJson() }
  }
}

export class ProgramAccountDataExtend {
  private map: Record<string, string>

  constructor(map: Record<string, string>) {
    this.map = map
  }

  toJson(): object {
    return { extend: this.map }
  }
}

export class ProgramFieldValue {
  private kind: string
  private value: ProgramUpdateValueTypes

  constructor(
    kind: string,
    value:
      | ProgramDataValue
      | ProgramDataInsert
      | ProgramDataExtend
      | ProgramDataRemove
      | ProgramMetadataValue
      | ProgramMetadataInsert
      | ProgramMetadataExtend
      | ProgramMetadataRemove
      | StatusValue
  ) {
    this.kind = kind
    this.value = value
  }

  toJson(): object {
    return { [this.kind]: this.value.toJson() }
  }
}
