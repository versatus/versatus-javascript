import { Address, AddressOrNamespace } from '@/lib/programs/Address-Namespace'
import { TokenDistribution, TokenOrProgramUpdate } from '@/lib/programs/Token'
import { TInstructionKinds } from '@/lib/types'

/**
 * Represents a generic instruction in a blockchain or token management system, encapsulating various
 * types of operations such as creating, updating, transferring, burning, or logging related to tokens
 * or programs. This class is designed to unify these operations under a single instruction type, providing
 * a consistent interface for serialization to JSON.
 */
export class Instruction {
  private kind: TInstructionKinds
  private value:
    | CreateInstruction
    | UpdateInstruction
    | TransferInstruction
    | BurnInstruction
    | LogInstruction

  /**
   * Constructs an instance of an Instruction, setting its kind and specific value based on the operation being performed.
   *
   * @param {TInstructionKinds} kind - The kind of instruction, indicating the type of operation (e.g., create, update, transfer, burn, log).
   * @param {CreateInstruction | UpdateInstruction | TransferInstruction | BurnInstruction | LogInstruction} value - The specific instruction value, containing details necessary for executing the operation.
   */
  constructor(
    kind: TInstructionKinds,
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

  /**
   * Serializes the instruction to a JSON object, facilitating interoperability and storage.
   * The JSON representation includes the kind of instruction as the key, and the serialized
   * value of the instruction as the value.
   *
   * @returns {object} The JSON representation of the instruction, with the instruction kind as the key and the serialized instruction details as the value.
   */
  toJson(): object {
    return { [this.kind]: this.value.toJson() }
  }
}

/**
 * Represents a create instruction in a blockchain or smart contract platform, encapsulating all the necessary
 * details to create a new token or program. This instruction includes information about the program namespace,
 * program identifier, the program owner, the total and initialized supply of tokens, and distribution details
 * if applicable.
 */
export class CreateInstruction {
  private programNamespace: AddressOrNamespace | null
  private programId: AddressOrNamespace | null
  private programOwner: Address | null
  private totalSupply: string | null
  private initializedSupply: string | null
  private distribution: TokenDistribution[]

  /**
   * Constructs a new CreateInstruction instance.
   *
   * @param {AddressOrNamespace | null} programNamespace - The namespace under which the program or token is to be created.
   * @param {AddressOrNamespace | null} programId - The unique identifier of the program or token being created.
   * @param {Address | null} programOwner - The owner of the program or token.
   * @param {string | null} totalSupply - The total supply of the token, for tokens with a fixed supply.
   * @param {string | null} initializedSupply - The amount of the token that is initially created and possibly distributed.
   * @param {TokenDistribution[]} distribution - Details of the initial token distribution, if applicable.
   */
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

  /**
   * Converts the create instruction to a JSON object for serialization and storage.
   * This method ensures that all components of the instruction are represented in a format
   * suitable for transmission or storage.
   *
   * @returns {object} The JSON representation of the create instruction, including program details and distribution information.
   */
  toJson(): object {
    // Convert the program namespace and ID to their JSON representation, or use null if not set.
    const programNamespaceJson = this.programNamespace?.toJson() ?? null
    const programIdJson = this.programId?.toJson() ?? null

    return {
      programNamespace: programNamespaceJson,
      programId: programIdJson,
      programOwner: this.programOwner?.toJson() ?? null,
      totalSupply: this.totalSupply?.toString() ?? null,
      initializedSupply: this.initializedSupply?.toString() ?? null,
      distribution: this.distribution.map((dist) => dist.toJson()),
    }
  }
}

/**
 * Represents an update instruction in a blockchain or smart contract platform, designed to modify
 * the properties or state of tokens or programs. This instruction encapsulates one or more updates,
 * each specifying the particular changes to be applied.
 */
export class UpdateInstruction {
  private updates: TokenOrProgramUpdate[]

  /**
   * Constructs a new UpdateInstruction instance.
   *
   * @param {TokenOrProgramUpdate[]} updates - An array of updates to be applied. Each update is an instance
   *                                           of TokenOrProgramUpdate, detailing the specific changes to make.
   */
  constructor(updates: TokenOrProgramUpdate[]) {
    this.updates = updates
  }

  /**
   * Converts the update instruction to a JSON object for serialization and storage. This method formats
   * the instruction and its updates in a structure suitable for transmission or storage, ensuring that
   * all changes are represented in a comprehensible and accessible manner.
   *
   * @returns {object} The JSON representation of the update instruction, including all specified updates
   *                   and their detailed changes.
   */
  toJson(): object {
    return {
      updates: this.updates.map((update) => update.toJson()), // Map each update to its JSON representation.
    }
  }
}

/**
 * Represents a transfer instruction in a blockchain or smart contract platform, encapsulating the necessary
 * details for transferring tokens from one address to another. This instruction can be used for both fungible
 * and non-fungible tokens, supporting transfers by amount or by specific token IDs.
 */
export class TransferInstruction {
  private token: Address | null
  private transferFrom: AddressOrNamespace | null
  private transferTo: AddressOrNamespace | null
  private amount: string | null
  private ids: string[]

  /**
   * Constructs a new TransferInstruction instance.
   *
   * @param {Address | null} token - The token's address being transferred. Null indicates a native token or unspecified token.
   * @param {AddressOrNamespace | null} transferFrom - The address or namespace from which tokens are being transferred.
   * @param {AddressOrNamespace | null} transferTo - The destination address or namespace for the tokens.
   * @param {string | null} amount - The amount of tokens to transfer, applicable for fungible tokens. Null indicates transfer by IDs.
   * @param {string[]} ids - An array of token IDs being transferred, applicable for non-fungible tokens or specific fungible token units.
   */
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

  /**
   * Converts the transfer instruction to a JSON object for serialization and storage. This method ensures
   * that the instruction is formatted in a structure suitable for transmission or storage, making clear the
   * transfer's source, destination, and specifics (amount or IDs).
   *
   * @returns {object} The JSON representation of the transfer instruction, detailing the token, source, destination,
   *                   amount, and token IDs involved in the transfer.
   */
  toJson(): object {
    return {
      token: this.token?.toJson(), // Serialize the token address, if specified.
      from: this.transferFrom?.toJson(), // Serialize the source address or namespace.
      to: this.transferTo?.toJson(), // Serialize the destination address or namespace.
      amount: this.amount, // Include the transfer amount, if applicable.
      ids: this.ids, // Include the list of token IDs being transferred, if applicable.
    }
  }
}

/**
 * Represents a burn instruction in a blockchain or smart contract platform, designed to permanently remove
 * a specified amount of tokens or specific token IDs from circulation. This instruction includes details about
 * the initiating caller, the program associated with the tokens, the tokens themselves, the source of the tokens,
 * and the quantity or identifiers of the tokens to be burned.
 */
export class BurnInstruction {
  private caller: Address | null
  private programId: AddressOrNamespace | null
  private token: Address | null
  private burnFrom: AddressOrNamespace | null
  private amount: string | null
  private tokenIds: string[]

  /**
   * Constructs a new BurnInstruction instance.
   *
   * @param {Address | null} caller - The address of the caller initiating the burn operation.
   * @param {AddressOrNamespace | null} programId - The program ID associated with the tokens being burned.
   * @param {Address | null} token - The address of the token being burned.
   * @param {AddressOrNamespace | null} burnFrom - The address or namespace from which tokens are being burned.
   * @param {string | null} amount - The amount of tokens to burn, applicable for fungible tokens. Null indicates burn by IDs.
   * @param {string[]} tokenIds - An array of token IDs being burned, applicable for non-fungible tokens or specific fungible token units.
   */
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

  /**
   * Converts the burn instruction to a JSON object for serialization and storage. This method formats
   * the instruction and its details in a structure suitable for transmission or storage, clearly conveying
   * the action's initiator, target tokens, and the quantity or specific tokens to be removed.
   *
   * @returns {object} The JSON representation of the burn instruction, including the caller, program, token details,
   *                   source of the burn, and the amount or token IDs to be burned.
   */
  toJson(): object {
    return {
      caller: this.caller?.toJson(), // Serialize the caller address, if specified.
      programId: this.programId?.toJson(), // Serialize the program ID, if specified.
      token: this.token?.toJson(), // Serialize the token address, if specified.
      from: this.burnFrom?.toJson(), // Serialize the source of the burn.
      amount: this.amount, // Include the burn amount, if applicable.
      tokenIds: this.tokenIds, // Include the list of token IDs being burned, if applicable.
    }
  }
}

export class LogInstruction {
  toJson(): object {
    return {}
  }
}
