import { TokenDistribution, TokenOrProgramUpdate, TokenUpdateField } from '../../../lib/programs/Token';
import { TProgramFieldValues, TTokenFieldValues } from '../../../lib/types';
import { ProgramUpdateField } from '../../../lib/programs/Program';
import { Address } from '../../../lib/programs/Address-Namespace';
import { Instruction } from '../../../lib/programs';
/**
 * Constructs a create instruction for initiating a token or program with specified properties. This utility
 * function streamlines the process of configuring a `CreateInstructionBuilder`, allowing for the specification
 * of program identification, ownership, supply details, and distribution instructions.
 *
 * @param {Object} params - The parameters required to build the create instruction.
 * @param {string} params.programId - The identifier of the program or token to be created.
 * @param {string} params.initializedSupply - The initial supply of the token, if applicable, as a string.
 * @param {string} params.totalSupply - The total supply limit of the token, if applicable, as a string.
 * @param {string} params.programOwner - The address of the owner of the program or token.
 * @param {string} params.programNamespace - The namespace within which the program or token resides.
 * @param {TokenDistribution} [params.distributionInstruction] - An optional distribution instruction associated with the creation.
 * @returns {Instruction} A create instruction configured with the provided details.
 *
 * @throws {Error} Propagates any errors that occur during the instruction building process.
 */
export declare function buildCreateInstruction({ programId, initializedSupply, totalSupply, programOwner, programNamespace, distributionInstruction, }: {
    programId: string;
    from: string;
    initializedSupply?: string;
    totalSupply?: string;
    programOwner: string;
    programNamespace: string;
    distributionInstruction?: TokenDistribution;
}): Instruction;
/**
 * Constructs an update instruction for modifying a token or program's properties. This function
 * simplifies the creation of an update instruction by utilizing an `UpdateInstructionBuilder` to
 * incorporate the specified updates into a single instruction.
 *
 * @param {Object} params - The parameters required to build the update instruction.
 * @param {TokenOrProgramUpdate} params.update - The update to be applied, encapsulating changes to be made.
 * @returns {Instruction} An update instruction configured with the provided updates.
 */
export declare function buildUpdateInstruction({ update, }: {
    update: TokenOrProgramUpdate;
}): Instruction;
/**
 * Constructs a transfer instruction for moving tokens from one address to another. This function
 * facilitates specifying the sender and receiver addresses, the token to be transferred, and the
 * amount or specific token IDs to transfer. It supports both fungible and non-fungible tokens through
 * the optional `amount` and `tokenIds` parameters.
 *
 * @param {Object} params - The parameters required to build the transfer instruction.
 * @param {string} params.from - The sender's address.
 * @param {string} params.to - The recipient's address.
 * @param {string} params.tokenAddress - The address of the token being transferred.
 * @param {BigInt} [params.amount] - The amount of the token to transfer, for fungible tokens.
 * @param {string[]} [params.tokenIds] - The IDs of the tokens to transfer, for non-fungible tokens.
 * @returns {Instruction} A transfer instruction configured with the provided details.
 *
 * @throws {Error} Propagates any errors that occur during the instruction building process.
 */
export declare function buildTransferInstruction({ from, to, tokenAddress, amount, tokenIds, extendTokenIds, }: {
    from: string;
    to: string;
    tokenAddress: string;
    amount?: bigint;
    tokenIds?: string[];
    extendTokenIds?: string[];
}): Instruction;
/**
 * Constructs a burn instruction for a given token. This utility function simplifies the creation of
 * a burn instruction by abstracting the details of setting up a `BurnInstructionBuilder`, configuring it
 * with the necessary parameters, and building the burn instruction.
 *
 * @param {Object} params - The parameters required to build the burn instruction.
 * @param {string} params.from - The address from which the token will be burned.
 * @param {string} params.caller - The address of the caller initiating the burn operation.
 * @param {string} params.programId - The program ID associated with the token to be burned.
 * @param {string} params.tokenAddress - The address of the token to be burned.
 * @param {string} params.amount - The amount of the token to burn, expressed as a string.
 * @returns {Instruction} A burn instruction configured with the provided details.
 */
export declare function buildBurnInstruction({ from, caller, programId, tokenAddress, amount, tokenIds, }: {
    from: string;
    caller: string;
    programId: string;
    tokenAddress: string;
    amount?: string;
    tokenIds?: string[];
}): Instruction;
/**
 * Constructs a token distribution instruction, facilitating the setup of token distribution specifics, including
 * the program ID, supply details, recipient, and optional token updates. This function provides flexibility for
 * distributing both fungible and non-fungible tokens by adjusting the distribution based on the `nonFungible` flag.
 *
 * @param {Object} params - The parameters required to build the token distribution instruction.
 * @param {string} params.programId - The identifier of the program associated with the token distribution.
 * @param {string} params.initializedSupply - The supply of tokens to be distributed, expressed as a string.
 * @param {string} params.to - The recipient's address for the token distribution.
 * @param {TokenUpdateField[]} [params.tokenUpdates] - Optional fields representing updates to the token's properties.
 * @param {boolean} [params.nonFungible] - Flag indicating whether the token is non-fungible. If `true`, treats
 * `initializedSupply` as a count of individual tokens to distribute.
 * @returns {TokenDistribution} A token distribution object configured with the provided details.
 */
export declare function buildTokenDistribution({ programId, initializedSupply, to, tokenUpdates, nonFungible, }: {
    programId: string;
    initializedSupply: string;
    to: string;
    tokenUpdates?: TokenUpdateField[];
    nonFungible?: boolean;
}): TokenDistribution;
/**
 * Constructs a sequence of minting instructions that represent the process of transferring payment tokens
 * to a program and then transferring the minted tokens (or specified token IDs for NFTs) back to the caller.
 * This function automates the creation of these transfer instructions to facilitate various minting scenarios.
 *
 * @param {Object} params - The parameters required to build the mint instructions.
 * @param {string} params.from - The address of the caller initiating the mint operation.
 * @param {string} params.programId - The program ID associated with the minting process.
 * @param {string} params.paymentTokenAddress - The address of the token being used for payment.
 * @param {BigInt} params.inputValue - The amount of payment tokens being transferred to the program.
 * @param {string[]} [params.returnedTokenIds] - Optional. The IDs of the tokens being minted and returned to the caller.
 * @param {BigInt} [params.returnedValue] - Optional. The amount of tokens being minted and returned to the caller.
 * @returns {Instruction[]} An array of transfer instructions for the minting process.
 *
 * @throws {Error} Throws an error if neither `returnedValue` nor `returnedTokenIds` are provided,
 * indicating missing information necessary for the minting process.
 */
export declare function buildMintInstructions({ from, programId, paymentTokenAddress, inputValue, returnedTokenIds, returnedValue, }: {
    from: string;
    programId: string;
    paymentTokenAddress: string;
    inputValue: bigint;
    returnedTokenIds?: string[];
    returnedValue?: bigint;
}): Instruction[];
/**
 * Constructs a `TokenUpdateField` object for updating token fields with specified actions such as insert, extend, or remove.
 * This function supports various field types including metadata, data, approvals, and status, with specific actions tailored
 * to each field type. It validates the field and action types and constructs the appropriate update action object.
 *
 * @param {Object} params - The parameters required to build the token update field.
 * @param {TTokenFieldValues} params.field - The specific field of the token to be updated (e.g., metadata, data, approvals, status).
 * @param {string | Array<[Address, string]>} params.value - The new value for the field, which can be a string or an array of tuples for approvals.
 * @param {'insert' | 'extend' | 'remove'} params.action - The action to be taken on the field (insert, extend, remove).
 * @returns {TokenUpdateField} A token update field object configured with the provided details.
 *
 * @throws {Error} Throws an error if an invalid field or action is specified, or if the value format does not match the expected type for the field.
 */
export declare function buildTokenUpdateField({ field, value, action, }: {
    field: TTokenFieldValues;
    value: string | Array<[Address, string[]]>;
    action: 'insert' | 'extend' | 'remove';
}): TokenUpdateField;
/**
 * Constructs a `ProgramUpdateField` object for updating program fields with specified actions such as insert, extend, or remove.
 * This function supports various field types including metadata, data, and status, with specific actions tailored to each field type.
 * It validates the field and action types and constructs the appropriate update action object.
 *
 * @param {Object} params - The parameters required to build the program update field.
 * @param {TProgramFieldValues} params.field - The specific field of the program to be updated (e.g., metadata, data, status).
 * @param {string} params.value - The new value for the field, which must be a string.
 * @param {'insert' | 'extend' | 'remove'} params.action - The action to be taken on the field (insert, extend, remove).
 * @returns {ProgramUpdateField} A program update field object configured with the provided details.
 *
 * @throws {Error} Throws an error if an invalid field or action is specified, or if the value format does not match the expected type for the field.
 */
export declare function buildProgramUpdateField({ field, value, action, }: {
    field: TProgramFieldValues;
    value: string;
    action: 'insert' | 'extend' | 'remove';
}): ProgramUpdateField;
/**
 * Updates the metadata for a given program on LASR.
 *
 * @param {Object} params - The parameters for the update.
 * @param {string} [params.programAddress=THIS] - The address of the program to update. Defaults to THIS if not provided.
 * @param {object} params.metadata - The metadata object to update the program with.
 * @returns {Instruction} - The instruction to be executed for the update.
 * @throws {Error} - Throws an error if the update process fails.
 */
export declare const updateProgramMetadata: ({ programAddress, metadata, }: {
    programAddress?: string | undefined;
    metadata: object;
}) => Instruction;
/**
 * Updates the data for a given program on LASR.
 *
 * @param {Object} params - The parameters for the update.
 * @param {string} [params.programAddress=THIS] - The address of the program to update. Defaults to THIS if not provided.
 * @param {object} params.data - The data object to update the program with.
 * @returns {Instruction} - The instruction to be executed for the update.
 * @throws {Error} - Throws an error if the update process fails.
 */
export declare const updateProgramData: ({ programAddress, data, }: {
    programAddress?: string | undefined;
    data: object;
}) => Instruction;
/**
 * Removes a specific key from the data of a given program on LASR.
 *
 * @param {Object} params - The parameters for the removal.
 * @param {string} params.programAddress - The address of the program to update.
 * @param {string} params.key - The key to be removed from the program's data.
 * @returns {Instruction} - The instruction to be executed for the removal.
 * @throws {Error} - Throws an error if the removal process fails.
 */
export declare const removeProgramDataKey: ({ programAddress, key, }: {
    programAddress: string;
    key: string;
}) => Instruction;
/**
 * Adds a linked program to the specified program on LASR.
 *
 * @param {Object} params - The parameters for the addition.
 * @param {string} params.programAddress - The address of the program to update.
 * @param {string} params.program - The program to be linked.
 * @returns {Instruction} - The instruction to be executed for the addition.
 * @throws {Error} - Throws an error if the addition process fails.
 */
export declare const addLinkedProgram: ({ programAddress, program, }: {
    programAddress: string;
    program: string;
}) => Instruction;
/**
 * Adds multiple linked programs to the specified program on LASR.
 *
 * @param {Object} params - The parameters for the addition.
 * @param {string} params.programAddress - The address of the program to update.
 * @param {string[]} params.programs - An array of programs to be linked.
 * @returns {Instruction} - The instruction to be executed for the addition.
 * @throws {Error} - Throws an error if the addition process fails.
 */
export declare const addLinkedPrograms: ({ programAddress, programs, }: {
    programAddress: string;
    programs: string[];
}) => Instruction;
/**
 * Updates the metadata for a given token on LASR.
 *
 * @param {Object} params - The parameters for the update.
 * @param {string} params.accountAddress - The address of the account holding the token.
 * @param {string} [params.programAddress=THIS] - The address of the program associated with the token. Defaults to THIS if not provided.
 * @param {object} params.metadata - The metadata object to update the token with.
 * @returns {Instruction} - The instruction to be executed for the update.
 * @throws {Error} - Throws an error if the update process fails.
 */
export declare const updateTokenMetadata: ({ accountAddress, programAddress, metadata, }: {
    accountAddress: string;
    programAddress?: string | undefined;
    metadata: object;
}) => Instruction;
/**
 * Updates the data for a given token on LASR.
 *
 * @param {Object} params - The parameters for the update.
 * @param {string} params.accountAddress - The address of the account holding the token.
 * @param {string} [params.programAddress=THIS] - The address of the program associated with the token. Defaults to THIS if not provided.
 * @param {object} params.data - The data object to update the token with.
 * @returns {Instruction} - The instruction to be executed for the update.
 * @throws {Error} - Throws an error if the update process fails.
 */
export declare const updateTokenData: ({ accountAddress, programAddress, data, }: {
    accountAddress: string;
    programAddress?: string | undefined;
    data: object;
}) => Instruction;
/**
 * Removes a specific key from the data of a given token on LASR.
 *
 * @param {Object} params - The parameters for the removal.
 * @param {string} params.accountAddress - The address of the account holding the token.
 * @param {string} [params.programAddress=THIS] - The address of the program associated with the token. Defaults to THIS if not provided.
 * @param {string} params.key - The key to be removed from the token's data.
 * @returns {Instruction} - The instruction to be executed for the removal.
 * @throws {Error} - Throws an error if the removal process fails.
 */
export declare const removeTokenDataKey: ({ accountAddress, programAddress, key, }: {
    accountAddress: string;
    programAddress: string;
    key: string;
}) => Instruction;
/**
 * Adds an approval to a token on LASR.
 *
 * @param {Object} params - The parameters for the addition.
 * @param {string} params.accountAddress - The address of the account holding the token.
 * @param {string} params.programAddress - The address of the program associated with the token.
 * @param {Array<[Address, string[]]>} params.approval - The approval information to be added. An array of tuples, where each tuple contains an Address and an array of strings representing the approvals.
 * @returns {Instruction} - The instruction to be executed for the addition.
 * @throws {Error} - Throws an error if the addition process fails.
 */
export declare const addTokenApproval: ({ accountAddress, programAddress, approval, }: {
    accountAddress: string;
    programAddress: string;
    approval: Array<[Address, string[]]>;
}) => Instruction;
/**
 * Adds multiple approvals to a token on LASR.
 *
 * @param {Object} params - The parameters for the addition.
 * @param {string} params.accountAddress - The address of the account holding the token.
 * @param {string} params.programAddress - The address of the program associated with the token.
 * @param {Array<[Address, string[]]>} params.approvals - An array of tuples, where each tuple contains an Address and an array of strings representing the approvals to be added.
 * @returns {Instruction} - The instruction to be executed for the addition.
 * @throws {Error} - Throws an error if the addition process fails.
 */
export declare const addTokenApprovals: ({ accountAddress, programAddress, approvals, }: {
    accountAddress: string;
    programAddress: string;
    approvals: Array<[Address, string[]]>;
}) => Instruction;
