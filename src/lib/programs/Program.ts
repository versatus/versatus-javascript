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
import {
  checkIfValuesAreUndefined,
  formatAmountToHex,
  validate,
  validateAndCreateJsonString,
} from '@/lib/utils'
import { Address, AddressOrNamespace } from '@/lib/programs/Address-Namespace'
import { StatusValue, TokenOrProgramUpdate } from '@/lib/programs/Token'

/**
 * Represents a program with strategies for handling various operations such as `create` and `update`.
 * The program is initialized with a map of method strategies that bind specific methods to operation keys.
 * This structure allows for dynamic execution of methods based on the operation specified in the input.
 */
export class Program {
  /**
   * A dictionary mapping operation keys to their corresponding methods.
   * @type {{ [key: string]: Function }}
   */
  methodStrategies: { [key: string]: Function }

  /**
   * Constructs a new instance of the Program class, initializing the `methodStrategies` with `create` and `update` operations.
   */
  constructor() {
    this.methodStrategies = {
      create: this.create.bind(this),
      update: this.update.bind(this),
    }
  }

  /**
   * Handles the `create` operation by processing the given computeInputs, validating and transforming them into a structured output.
   * This method performs a series of validations and transformations, constructs various instructions for token and program updates,
   * and ultimately returns a JSON representation of the operation results.
   *
   * @param {ComputeInputs} computeInputs - Inputs necessary for computing the create operation, including transaction details.
   * @returns {string} JSON string representing the outputs of the create operation.
   * @throws {Error} Throws an error if any validation fails or if an unexpected error occurs during the process.
   */
  create(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { transactionInputs, from, to } = transaction
      const txInputs = validate(
        JSON.parse(transactionInputs),
        'unable to parse transactionInputs'
      )

      const {
        symbol,
        name,
        totalSupply,
        initializedSupply: txInitializedSupply,
        imgUrl,
        recipientAddress,
        paymentProgramAddress,
        conversionRate,
      } = txInputs

      checkIfValuesAreUndefined({
        symbol,
        name,
        totalSupply,
        initializedSupply: txInitializedSupply,
        imgUrl,
        paymentProgramAddress,
        conversionRate,
      })

      // metadata
      const metadataStr = validateAndCreateJsonString({
        symbol,
        name,
        totalSupply: formatAmountToHex(totalSupply),
      })

      // data
      const dataStr = validateAndCreateJsonString({
        type: 'fungible',
        imgUrl,
        paymentProgramAddress,
        conversionRate,
      })

      const addTokenMetadata = buildTokenUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      const addTokenData = buildTokenUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const addProgramData = buildProgramUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const distributionInstruction = buildTokenDistributionInstruction({
        programId: THIS,
        initializedSupply: formatAmountToHex(txInitializedSupply),
        to: recipientAddress ?? to,
        tokenUpdates: [addTokenMetadata, addTokenData],
      })

      const createAndDistributeInstruction = buildCreateInstruction({
        from,
        initializedSupply: formatAmountToHex(txInitializedSupply),
        totalSupply,
        programId: THIS,
        programOwner: from,
        programNamespace: THIS,
        distributionInstruction,
      })

      const addProgramMetadata = buildProgramUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      const programUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), [
            addProgramMetadata,
            addProgramData,
          ])
        ),
      })

      return new Outputs(computeInputs, [
        createAndDistributeInstruction,
        programUpdateInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }

  /**
   * Executes the method corresponding to the operation specified in the input.
   * This method looks up the strategy for the operation in the `methodStrategies` map and executes it.
   *
   * @param {ComputeInputs} inputs - Inputs containing the operation to be executed along with any necessary data.
   * @returns {any} The result of executing the method associated with the specified operation.
   * @throws {Error} Throws an error if the operation is unknown or if the associated method throws an error.
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
   * Starts the execution process by invoking `executeMethod` with the provided computeInputs.
   * This is a convenience method that serves as an entry point to execute a method based on the operation specified in the inputs.
   *
   * @param {ComputeInputs} computeInputs - Inputs necessary for executing a method, including the operation to be performed.
   * @returns {any} The result of executing the method associated with the specified operation.
   * @throws {Error} Throws an error if `executeMethod` throws an error.
   */
  start(computeInputs: ComputeInputs) {
    try {
      return this.executeMethod(computeInputs)
    } catch (e) {
      throw e
    }
  }

  /**
   * Handles the `update` operation by processing the given computeInputs, performing validations, and transforming them into structured output.
   * Similar to the `create` method, this method processes inputs related to program updates, constructs various update instructions,
   * and returns a JSON representation of the operation results.
   *
   * @param {ComputeInputs} computeInputs - Inputs necessary for computing the update operation, including transaction details.
   * @returns {string} JSON string representing the outputs of the update operation.
   * @throws {Error} Throws an error if any validation fails or if an unexpected error occurs during the process.
   */
  update(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { transactionInputs } = transaction
      const txInputs = JSON.parse(transactionInputs)
      const { data, metadata } = txInputs
      const programUpdates = []
      if (metadata) {
        const fieldUpdate = buildProgramUpdateField({
          field: 'metadata',
          value: JSON.stringify(metadata),
          action: 'extend',
        })
        programUpdates.push(fieldUpdate)
      }

      if (data) {
        const fieldUpdate = buildProgramUpdateField({
          field: 'data',
          value: JSON.stringify(data),
          action: 'extend',
        })
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
    } catch (e) {
      throw e
    }
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
