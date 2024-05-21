import { BurnInstructionBuilder, CreateInstructionBuilder, TokenDistributionBuilder, TransferInstructionBuilder, UpdateInstructionBuilder, } from '../../../lib/programs/instruction-builders/builders.js';
import { ApprovalsExtend, ApprovalsInsert, StatusValue, TokenDataExtend, TokenDataInsert, TokenDataRemove, TokenField, TokenFieldValue, TokenMetadataExtend, TokenMetadataInsert, TokenMetadataRemove, TokenOrProgramUpdate, TokenUpdate, TokenUpdateField, } from '../../../lib/programs/Token.js';
import { LinkedProgramsExtend, LinkedProgramsInsert, LinkedProgramsRemove, ProgramDataExtend, ProgramDataInsert, ProgramDataRemove, ProgramFieldValue, ProgramMetadataExtend, ProgramMetadataInsert, ProgramMetadataRemove, } from '../../../lib/programs/Program.js';
import { THIS } from '../../../lib/consts.js';
import { formatBigIntToHex, generateTokenIdArray, validateAndCreateJsonString, } from '../../../lib/utils.js';
import { ProgramField, ProgramUpdate, ProgramUpdateField, } from '../../../lib/programs/Program.js';
import { Address, AddressOrNamespace, } from '../../../lib/programs/Address-Namespace.js';
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
export function buildCreateInstruction({ programId, initializedSupply, totalSupply, programOwner, programNamespace, distributionInstruction, }) {
    try {
        // Initialize the CreateInstructionBuilder and set the basic parameters for the creation operation.
        const instructionBuilder = new CreateInstructionBuilder()
            .setProgramId(new AddressOrNamespace(new Address(programId)))
            .setProgramOwner(new Address(programOwner))
            .setProgramNamespace(new AddressOrNamespace(new Address(programNamespace)));
        if (!initializedSupply && !totalSupply) {
            instructionBuilder.setTotalSupply(formatBigIntToHex(BigInt(1)));
            instructionBuilder.setInitializedSupply(formatBigIntToHex(BigInt(1)));
        }
        // Optionally set the initialized supply if it's provided, converting the value to a hex string.
        if (initializedSupply !== undefined) {
            instructionBuilder.setInitializedSupply(formatBigIntToHex(BigInt(initializedSupply)));
        }
        // Optionally set the total supply if it's provided, also converting this value to a hex string.
        if (totalSupply !== undefined) {
            instructionBuilder.setTotalSupply(formatBigIntToHex(BigInt(totalSupply)));
        }
        // If a distribution instruction is provided, add it to the builder.
        if (distributionInstruction !== undefined) {
            instructionBuilder.addTokenDistribution(distributionInstruction);
        }
        // Finalize the creation of the instruction and return it.
        return instructionBuilder.build();
    }
    catch (e) {
        // In case of any errors during the build process, rethrow the caught exception.
        throw e;
    }
}
/**
 * Constructs an update instruction for modifying a token or program's properties. This function
 * simplifies the creation of an update instruction by utilizing an `UpdateInstructionBuilder` to
 * incorporate the specified updates into a single instruction.
 *
 * @param {Object} params - The parameters required to build the update instruction.
 * @param {TokenOrProgramUpdate} params.update - The update to be applied, encapsulating changes to be made.
 * @returns {Instruction} An update instruction configured with the provided updates.
 */
export function buildUpdateInstruction({ update, }) {
    // Instantiate an UpdateInstructionBuilder, add the provided update, and build the instruction.
    return new UpdateInstructionBuilder()
        .addUpdate(update) // Add the specified update to the builder.
        .build(); // Construct and return the final update instruction.
}
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
export function buildTransferInstruction({ from, to, tokenAddress, amount, tokenIds, extendTokenIds, }) {
    try {
        // Convert string addresses to Address or AddressOrNamespace objects as required by the builder.
        const toAddressOrNamespace = new AddressOrNamespace(new Address(to));
        const fromAddressOrNamespace = new AddressOrNamespace(new Address(from));
        const tokenAddressOrNamespace = new Address(tokenAddress);
        // Initialize a TransferInstructionBuilder and set the from, to, and token addresses.
        const instructionBuilder = new TransferInstructionBuilder()
            .setTransferFrom(fromAddressOrNamespace)
            .setTransferTo(toAddressOrNamespace)
            .setTokenAddress(tokenAddressOrNamespace);
        // If token IDs are specified (for NFTs or specific fungible token units), add them to the instruction.
        if (tokenIds) {
            instructionBuilder.addTokenIds(tokenIds);
        }
        if (extendTokenIds) {
            instructionBuilder.extendTokenIds(extendTokenIds);
        }
        // If an amount is specified (for fungible tokens), set the amount in the instruction.
        if (amount !== undefined) {
            instructionBuilder.setAmount(formatBigIntToHex(amount));
        }
        // Build and return the finalized transfer instruction.
        return instructionBuilder.build();
    }
    catch (e) {
        // In case of any errors during the build process, rethrow the caught exception.
        throw e;
    }
}
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
export function buildBurnInstruction({ from, caller, programId, tokenAddress, amount, tokenIds, }) {
    try {
        const instructionBuilder = new BurnInstructionBuilder()
            .setProgramId(new AddressOrNamespace(new Address(programId)))
            .setCaller(new Address(caller))
            .setTokenAddress(new Address(tokenAddress))
            .setBurnFromAddress(new AddressOrNamespace(new Address(from)));
        if (amount) {
            instructionBuilder.setAmount(formatBigIntToHex(BigInt(amount)));
        }
        else if (tokenIds) {
            instructionBuilder.extendTokenIds(tokenIds);
        }
        else {
            throw new Error('Invalid burn builder arguments. Missing amount or tokenIds');
        }
        return instructionBuilder.build();
    }
    catch (e) {
        throw e;
    }
}
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
export function buildTokenDistribution({ programId, initializedSupply, to, tokenUpdates, nonFungible, }) {
    const tokenDistributionBuilder = new TokenDistributionBuilder()
        .setProgramId(new AddressOrNamespace(new Address(programId)))
        .setReceiver(new AddressOrNamespace(new Address(to)));
    if (!nonFungible) {
        // For fungible tokens, set the amount directly using the initializedSupply, formatted as a hex string.
        tokenDistributionBuilder.setAmount(formatBigIntToHex(BigInt(initializedSupply)));
    }
    else {
        // For non-fungible tokens, generate token IDs based on the initializedSupply count, formatting each as a hex string.
        const tokenIds = generateTokenIdArray(initializedSupply);
        tokenDistributionBuilder.extendTokenIds(tokenIds);
    }
    if (tokenUpdates) {
        // If token updates are provided, add them to the distribution instruction.
        tokenDistributionBuilder.extendUpdateFields(tokenUpdates);
    }
    // Build and return the finalized token distribution object.
    return tokenDistributionBuilder.build();
}
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
export function buildMintInstructions({ from, programId, paymentTokenAddress, inputValue, returnedTokenIds, returnedValue, }) {
    try {
        const transferToProgram = buildTransferInstruction({
            from: from,
            to: 'this', // Represents the program's address.
            tokenAddress: paymentTokenAddress,
            amount: inputValue,
        });
        // Setup arguments for the transfer back to the caller, depending on whether it's an NFT or fungible tokens.
        const mintTransferArguments = {
            from: 'this', // Represents the program's address, indicating the source of the minted tokens.
            to: from, // The recipient of the minted tokens.
            tokenAddress: programId, // The minted token or NFT's program ID.
        };
        // Determine whether to set amount or token IDs based on what's returned from the minting process.
        if (returnedValue) {
            mintTransferArguments.amount = returnedValue;
        }
        else if (returnedTokenIds) {
            mintTransferArguments.tokenIds = returnedTokenIds;
        }
        else {
            // Error handling if neither amount nor token IDs are specified for the minted assets.
            throw new Error('Invalid mint builder arguments. Missing amount or tokenIds');
        }
        // Instruction to transfer the minted tokens or NFTs back to the caller.
        const transferToCaller = buildTransferInstruction(mintTransferArguments);
        // Return the sequence of instructions: payment transfer, then transfer of minted assets.
        return [transferToProgram, transferToCaller];
    }
    catch (e) {
        // Rethrow any caught exceptions for upstream error handling.
        throw e;
    }
}
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
export function buildTokenUpdateField({ field, value, action, }) {
    try {
        let tokenFieldAction;
        // Handle array values specifically for the 'approvals' field.
        if (value instanceof Array) {
            if (field === 'approvals') {
                switch (action) {
                    case 'extend':
                        tokenFieldAction = new ApprovalsExtend(value);
                        break;
                    case 'insert':
                        tokenFieldAction = new ApprovalsInsert(value[0][0], value[0][1]);
                        break;
                    case 'remove':
                        throw new Error(`Not yet implemented: ${action}`);
                    default:
                        throw new Error(`Invalid action for approvals: ${action}`);
                }
            }
            else {
                throw new Error(`Invalid field for array value: ${field}`);
            }
        }
        else {
            // Handle string values for 'metadata', 'data', and 'status' fields with specific actions.
            switch (field) {
                case 'metadata':
                    switch (action) {
                        case 'extend':
                            tokenFieldAction = new TokenMetadataExtend(JSON.parse(value));
                            break;
                        case 'insert':
                            const [key, insertValue] = JSON.parse(value).split(':');
                            tokenFieldAction = new TokenMetadataInsert(key, insertValue);
                            break;
                        case 'remove':
                            tokenFieldAction = new TokenMetadataRemove(value);
                            break;
                        default:
                            throw new Error(`Invalid action for metadata: ${action}`);
                    }
                    break;
                case 'data':
                    switch (action) {
                        case 'extend':
                            tokenFieldAction = new TokenDataExtend(JSON.parse(value));
                            break;
                        case 'insert':
                            const [key, insertValue] = JSON.parse(value).split(':');
                            tokenFieldAction = new TokenDataInsert(key, insertValue);
                            break;
                        case 'remove':
                            tokenFieldAction = new TokenDataRemove(value);
                            break;
                        default:
                            throw new Error(`Invalid action for data: ${action}`);
                    }
                    break;
                case 'status':
                    if (action !== 'insert') {
                        throw new Error(`Invalid action for status: ${action}`);
                    }
                    tokenFieldAction = new StatusValue(value);
                    break;
                default:
                    throw new Error(`Unsupported field: ${field}`);
            }
        }
        // Construct and return the TokenUpdateField object with the specified field and action.
        return new TokenUpdateField(new TokenField(field), new TokenFieldValue(field, tokenFieldAction));
    }
    catch (e) {
        // Rethrow any caught exceptions for upstream error handling.
        throw e;
    }
}
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
export function buildProgramUpdateField({ field, value, action, }) {
    try {
        let programFieldAction;
        // Determine the action object based on the field type and action.
        switch (field) {
            case 'metadata':
                switch (action) {
                    case 'extend':
                        programFieldAction = new ProgramMetadataExtend(JSON.parse(value));
                        break;
                    case 'insert':
                        const [key, insertValue] = JSON.parse(value).split(':');
                        programFieldAction = new ProgramMetadataInsert(key, insertValue);
                        break;
                    case 'remove':
                        programFieldAction = new ProgramMetadataRemove(value);
                        break;
                    default:
                        throw new Error(`Invalid metadata action: ${action}`);
                }
                break;
            case 'data':
                switch (action) {
                    case 'extend':
                        programFieldAction = new ProgramDataExtend(JSON.parse(value));
                        break;
                    case 'insert':
                        const [dataKey, dataValue] = JSON.parse(value).split(':');
                        programFieldAction = new ProgramDataInsert(dataKey, dataValue);
                        break;
                    case 'remove':
                        programFieldAction = new ProgramDataRemove(value);
                        break;
                    default:
                        throw new Error(`Invalid data action: ${action}`);
                }
                break;
            case 'linkedPrograms':
                switch (action) {
                    case 'extend':
                        const programs = JSON.parse(value).map((address) => new Address(address));
                        programFieldAction = new LinkedProgramsExtend(programs);
                        break;
                    case 'insert':
                        programFieldAction = new LinkedProgramsInsert(new Address(value));
                        break;
                    case 'remove':
                        programFieldAction = new LinkedProgramsRemove(new Address(value));
                        break;
                    default:
                        throw new Error(`Invalid linkedProgram action: ${action}`);
                }
                break;
            case 'status':
                if (action !== 'insert') {
                    throw new Error(`Invalid action for status: ${action}`);
                }
                programFieldAction = new StatusValue(value);
                break;
            default:
                throw new Error(`Invalid field: ${field}`);
        }
        // Construct and return the ProgramUpdateField object with the specified field and action.
        return new ProgramUpdateField(new ProgramField(field), new ProgramFieldValue(field, programFieldAction));
    }
    catch (e) {
        // Rethrow any caught exceptions for upstream error handling.
        throw e;
    }
}
/**
 * Updates the metadata for a given program on LASR.
 *
 * @param {Object} params - The parameters for the update.
 * @param {string} [params.programAddress=THIS] - The address of the program to update. Defaults to THIS if not provided.
 * @param {object} params.metadata - The metadata object to update the program with.
 * @returns {Instruction} - The instruction to be executed for the update.
 * @throws {Error} - Throws an error if the update process fails.
 */
export const updateProgramMetadata = ({ programAddress = THIS, metadata, }) => {
    try {
        const metadataStr = validateAndCreateJsonString(metadata);
        const updateProgram = buildProgramUpdateField({
            field: 'metadata',
            value: metadataStr,
            action: 'extend',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(new Address(programAddress)), [
                updateProgram,
            ])),
        });
    }
    catch (e) {
        throw e;
    }
};
/**
 * Updates the data for a given program on LASR.
 *
 * @param {Object} params - The parameters for the update.
 * @param {string} [params.programAddress=THIS] - The address of the program to update. Defaults to THIS if not provided.
 * @param {object} params.data - The data object to update the program with.
 * @returns {Instruction} - The instruction to be executed for the update.
 * @throws {Error} - Throws an error if the update process fails.
 */
export const updateProgramData = ({ programAddress = THIS, data, }) => {
    try {
        const dataStr = validateAndCreateJsonString(data);
        const updateUserObject = buildProgramUpdateField({
            field: 'data',
            value: dataStr,
            action: 'extend',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(new Address(programAddress)), [
                updateUserObject,
            ])),
        });
    }
    catch (e) {
        throw e;
    }
};
/**
 * Removes a specific key from the data of a given program on LASR.
 *
 * @param {Object} params - The parameters for the removal.
 * @param {string} params.programAddress - The address of the program to update.
 * @param {string} params.key - The key to be removed from the program's data.
 * @returns {Instruction} - The instruction to be executed for the removal.
 * @throws {Error} - Throws an error if the removal process fails.
 */
export const removeProgramDataKey = ({ programAddress = THIS, key, }) => {
    try {
        const removeDataKey = buildProgramUpdateField({
            field: 'data',
            value: key,
            action: 'remove',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(new Address(programAddress)), [
                removeDataKey,
            ])),
        });
    }
    catch (e) {
        throw e;
    }
};
/**
 * Adds a linked program to the specified program on LASR.
 *
 * @param {Object} params - The parameters for the addition.
 * @param {string} params.programAddress - The address of the program to update.
 * @param {string} params.program - The program to be linked.
 * @returns {Instruction} - The instruction to be executed for the addition.
 * @throws {Error} - Throws an error if the addition process fails.
 */
export const addLinkedProgram = ({ programAddress = THIS, program, }) => {
    try {
        const extendProgramLinkedPrograms = buildProgramUpdateField({
            field: 'linkedPrograms',
            value: program,
            action: 'insert',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(new Address(programAddress)), [
                extendProgramLinkedPrograms,
            ])),
        });
    }
    catch (e) {
        throw e;
    }
};
/**
 * Adds multiple linked programs to the specified program on LASR.
 *
 * @param {Object} params - The parameters for the addition.
 * @param {string} params.programAddress - The address of the program to update.
 * @param {string[]} params.programs - An array of programs to be linked.
 * @returns {Instruction} - The instruction to be executed for the addition.
 * @throws {Error} - Throws an error if the addition process fails.
 */
export const addLinkedPrograms = ({ programAddress = THIS, programs, }) => {
    try {
        const extendProgramLinkedPrograms = buildProgramUpdateField({
            field: 'linkedPrograms',
            value: programs.join(','),
            action: 'extend',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(new Address(programAddress)), [
                extendProgramLinkedPrograms,
            ])),
        });
    }
    catch (e) {
        throw e;
    }
};
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
export const updateTokenMetadata = ({ accountAddress, programAddress = THIS, metadata, }) => {
    try {
        const metadataStr = validateAndCreateJsonString(metadata);
        const updateToken = buildTokenUpdateField({
            field: 'metadata',
            value: metadataStr,
            action: 'extend',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('tokenUpdate', new TokenUpdate(new AddressOrNamespace(new Address(accountAddress)), new AddressOrNamespace(new Address(programAddress)), [updateToken])),
        });
    }
    catch (e) {
        throw e;
    }
};
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
export const updateTokenData = ({ accountAddress, programAddress = THIS, data, }) => {
    try {
        const dataStr = validateAndCreateJsonString(data);
        const updateUserObject = buildTokenUpdateField({
            field: 'data',
            value: dataStr,
            action: 'extend',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('tokenUpdate', new TokenUpdate(new AddressOrNamespace(new Address(accountAddress)), new AddressOrNamespace(new Address(programAddress)), [updateUserObject])),
        });
    }
    catch (e) {
        throw e;
    }
};
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
export const removeTokenDataKey = ({ accountAddress, programAddress = THIS, key, }) => {
    try {
        const updateUserObject = buildTokenUpdateField({
            field: 'data',
            value: key,
            action: 'remove',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('tokenUpdate', new TokenUpdate(new AddressOrNamespace(new Address(accountAddress)), new AddressOrNamespace(new Address(programAddress)), [updateUserObject])),
        });
    }
    catch (e) {
        throw e;
    }
};
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
export const addTokenApproval = ({ accountAddress, programAddress, approval, }) => {
    try {
        const extendTokenApprovals = buildTokenUpdateField({
            field: 'approvals',
            value: approval,
            action: 'insert',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('tokenUpdate', new TokenUpdate(new AddressOrNamespace(new Address(accountAddress)), new AddressOrNamespace(new Address(programAddress)), [extendTokenApprovals])),
        });
    }
    catch (e) {
        throw e;
    }
};
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
export const addTokenApprovals = ({ accountAddress, programAddress, approvals, }) => {
    try {
        const extendTokenApprovals = buildTokenUpdateField({
            field: 'approvals',
            value: approvals,
            action: 'extend',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('tokenUpdate', new TokenUpdate(new AddressOrNamespace(new Address(accountAddress)), new AddressOrNamespace(new Address(programAddress)), [extendTokenApprovals])),
        });
    }
    catch (e) {
        throw e;
    }
};
