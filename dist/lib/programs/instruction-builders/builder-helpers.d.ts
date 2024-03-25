import { TokenDistribution, TokenOrProgramUpdate, TokenUpdateField } from '../../../lib/programs/Token';
import { ProgramFieldValues, TokenFieldValues } from '../../../lib/types';
import { ProgramUpdateField } from '../../../lib/programs/Program';
import { Address, Namespace } from '../../../lib/programs/Address-Namespace';
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
export declare function buildBurnInstruction({ from, caller, programId, tokenAddress, amount, }: {
    from: string;
    caller: string;
    programId: string;
    tokenAddress: string;
    amount: string;
}): import("..").Instruction;
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
}): import("..").Instruction;
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
}): import("..").Instruction;
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
export declare function buildTokenDistributionInstruction({ programId, initializedSupply, to, tokenUpdates, nonFungible, }: {
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
    inputValue: BigInt;
    returnedTokenIds?: string[];
    returnedValue?: BigInt;
}): import("..").Instruction[];
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
export declare function buildTransferInstruction({ from, to, tokenAddress, amount, tokenIds, }: {
    from: string;
    to: string;
    tokenAddress: string;
    amount?: BigInt;
    tokenIds?: string[];
}): import("..").Instruction;
/**
 * Constructs a `TokenUpdateField` object for updating token fields with specified actions such as insert, extend, or remove.
 * This function supports various field types including metadata, data, approvals, and status, with specific actions tailored
 * to each field type. It validates the field and action types and constructs the appropriate update action object.
 *
 * @param {Object} params - The parameters required to build the token update field.
 * @param {TokenFieldValues} params.field - The specific field of the token to be updated (e.g., metadata, data, approvals, status).
 * @param {string | Array<[Address, string]>} params.value - The new value for the field, which can be a string or an array of tuples for approvals.
 * @param {'insert' | 'extend' | 'remove'} params.action - The action to be taken on the field (insert, extend, remove).
 * @returns {TokenUpdateField} A token update field object configured with the provided details.
 *
 * @throws {Error} Throws an error if an invalid field or action is specified, or if the value format does not match the expected type for the field.
 */
export declare function buildTokenUpdateField({ field, value, action, }: {
    field: TokenFieldValues;
    value: string | Array<[Address, string]>;
    action: 'insert' | 'extend' | 'remove';
}): TokenUpdateField;
/**
 * Constructs a `ProgramUpdateField` object for updating program fields with specified actions such as insert, extend, or remove.
 * This function supports various field types including metadata, data, and status, with specific actions tailored to each field type.
 * It validates the field and action types and constructs the appropriate update action object.
 *
 * @param {Object} params - The parameters required to build the program update field.
 * @param {ProgramFieldValues} params.field - The specific field of the program to be updated (e.g., metadata, data, status).
 * @param {string} params.value - The new value for the field, which must be a string.
 * @param {'insert' | 'extend' | 'remove'} params.action - The action to be taken on the field (insert, extend, remove).
 * @returns {ProgramUpdateField} A program update field object configured with the provided details.
 *
 * @throws {Error} Throws an error if an invalid field or action is specified, or if the value format does not match the expected type for the field.
 */
export declare function buildProgramUpdateField({ field, value, action, }: {
    field: ProgramFieldValues;
    value: string;
    action: 'insert' | 'extend' | 'remove';
}): ProgramUpdateField;
/**
 * Constructs a token metadata update instruction for updating the metadata of a specified token. This function
 * streamlines the process of creating a token metadata update by using the `buildTokenUpdateField` and
 * `buildUpdateInstruction` utility functions to encapsulate the required operations into a single update instruction.
 *
 * @param {Object} params - The parameters required to build the token metadata update instruction.
 * @param {Address | Namespace | 'this'} params.accountAddress - The address or namespace of the account initiating the update, or 'this' to indicate the current program.
 * @param {Address | Namespace | 'this'} params.tokenAddress - The address or namespace of the token being updated, or 'this' to reference the current program's token.
 * @param {string} params.transactionInputs - The new metadata values to be extended into the token's existing metadata, in JSON string format.
 * @returns {Instruction} An update instruction configured to update the token's metadata with the provided values.
 *
 * @throws {Error} Propagates any errors that occur during the construction of the token metadata update instruction.
 */
export declare function buildTokenMetadataUpdateInstruction({ accountAddress, tokenAddress, transactionInputs, }: {
    accountAddress: Address | Namespace | 'this';
    tokenAddress: Address | Namespace | 'this';
    transactionInputs: string;
}): import("..").Instruction;
/**
 * Constructs a program metadata update instruction for updating the metadata of a program. This function
 * streamlines the process of creating a program metadata update by utilizing the `buildProgramUpdateField`
 * and `buildUpdateInstruction` utility functions to encapsulate the necessary operations into a single update
 * instruction.
 *
 * @param {Object} params - The parameters required to build the program metadata update instruction.
 * @param {string} params.transactionInputs - The new metadata values to be extended into the program's existing metadata, in JSON string format.
 * @returns {Instruction} An update instruction configured to update the program's metadata with the provided values.
 *
 * @throws {Error} Propagates any errors that occur during the construction of the program metadata update instruction.
 */
export declare function buildProgramMetadataUpdateInstruction({ transactionInputs, }: {
    transactionInputs: string;
}): import("..").Instruction;
/**
 * Constructs a program data update instruction for updating the data of a program. This function
 * streamlines the process of creating a program data update by utilizing the `buildProgramUpdateField`
 * and `buildUpdateInstruction` utility functions to encapsulate the necessary operations into a single update
 * instruction.
 *
 * Note: The provided implementation incorrectly sets the field to 'metadata' instead of 'data'. To correctly
 * update program data, the 'field' parameter should be set to 'data'.
 *
 * @param {Object} params - The parameters required to build the program data update instruction.
 * @param {string} params.transactionInputs - The new data values to be extended into the program's existing data, in JSON string format.
 * @returns {Instruction} An update instruction configured to update the program's data with the provided values.
 *
 * @throws {Error} Propagates any errors that occur during the construction of the program data update instruction.
 */
export declare function buildProgramDataUpdateInstruction({ transactionInputs, }: {
    transactionInputs: string;
}): import("..").Instruction;
