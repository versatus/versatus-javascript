/**
 * Provides builders for creating various instruction objects related to token operations,
 * including token update, token distribution, instruction creation, and more.
 * These builders follow the builder pattern, offering a fluent API for constructing complex objects step by step.
 */
import { TokenDistribution, TokenOrProgramUpdate, TokenUpdateField } from '../../../lib/programs/Token';
import { Instruction } from '../../../lib/programs/Instruction';
import { AddressOrNamespace, Address } from '../../../lib/programs/Address-Namespace';
/**
 * A builder class for constructing a `CreateInstruction` object. This class provides a fluent API to set various properties of
 * a create instruction, such as program namespace, program ID, program owner, total supply, and initialized supply. Additionally,
 * it allows for the aggregation of multiple token distributions into the instruction. This class is part of a system that abstracts
 * complex instruction creation into manageable steps, improving code readability and maintainability.
 */
export declare class CreateInstructionBuilder {
    private programNamespace;
    private programId;
    private programOwner;
    private totalSupply;
    private initializedSupply;
    private distribution;
    /**
     * Sets the program namespace for the instruction being built.
     * @param {AddressOrNamespace} programNamespace - The namespace of the program.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    setProgramNamespace(programNamespace: AddressOrNamespace): CreateInstructionBuilder;
    /**
     * Sets the program ID for the instruction being built.
     * @param {AddressOrNamespace} programId - The ID of the program.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    setProgramId(programId: AddressOrNamespace): CreateInstructionBuilder;
    /**
     * Sets the program owner for the instruction being built.
     * @param {Address} programOwner - The owner of the program.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    setProgramOwner(programOwner: Address): CreateInstructionBuilder;
    /**
     * Sets the total supply for the token or program being created.
     * @param {string} totalSupply - The total supply as a string.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    setTotalSupply(totalSupply: string): CreateInstructionBuilder;
    /**
     * Sets the initialized supply for the token or program being created.
     * @param {string} initializedSupply - The initialized supply as a string.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    setInitializedSupply(initializedSupply: string): CreateInstructionBuilder;
    /**
     * Adds a single token distribution to the list of distributions that will be part of the create instruction.
     * @param {TokenDistribution} tokenDistribution - A token distribution object.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    addTokenDistribution(tokenDistribution: TokenDistribution): CreateInstructionBuilder;
    /**
     * Extends the list of token distributions with an array of token distribution objects.
     * @param {TokenDistribution[]} items - An array of token distribution objects.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    extendTokenDistribution(items: TokenDistribution[]): CreateInstructionBuilder;
    /**
     * Builds and returns a new `Instruction` object of type `create`, encapsulating all the set properties and the aggregated
     * token distributions.
     * @returns {Instruction} - The constructed `CreateInstruction` object, ready to be used in the application.
     */
    build(): Instruction;
}
/**
 * A builder class for constructing an `UpdateInstruction` object. This class provides methods to add
 * updates to the instruction. It allows for chaining methods to configure an `UpdateInstruction` and
 * finally build it into an `Instruction` object.
 */
export declare class UpdateInstructionBuilder {
    private updates;
    /**
     * Adds a single update to the instruction.
     * @param update - A `TokenOrProgramUpdate` object to add to the update list.
     * @returns The instance of this builder for chaining.
     */
    addUpdate(update: TokenOrProgramUpdate): UpdateInstructionBuilder;
    /**
     * Extends the updates list with an array of `TokenOrProgramUpdate` objects.
     * @param items - An array of `TokenOrProgramUpdate` objects to add to the update list.
     * @returns The instance of this builder for chaining.
     */
    extendUpdates(items: TokenOrProgramUpdate[]): UpdateInstructionBuilder;
    /**
     * Builds the update instruction using the configured updates.
     * @returns An `Instruction` object configured as an update instruction with the specified updates.
     */
    build(): Instruction;
}
/**
 * A builder class for constructing a `TransferInstruction` object, facilitating the setting of various
 * properties relevant to a token transfer operation. This builder provides a fluent API for configuring
 * a transfer instruction step by step.
 */
export declare class TransferInstructionBuilder {
    private token;
    private transferFrom;
    private transferTo;
    private amount;
    private ids;
    /**
     * Sets the token address for the transfer.
     * @param {Address} tokenAddress - The address of the token to be transferred.
     * @returns {TransferInstructionBuilder} - The instance of this builder for chaining.
     */
    setTokenAddress(tokenAddress: Address): TransferInstructionBuilder;
    /**
     * Sets the address from which the token will be transferred.
     * @param {AddressOrNamespace} transferFrom - The address or namespace from which the transfer originates.
     * @returns {TransferInstructionBuilder} - The instance of this builder for chaining.
     */
    setTransferFrom(transferFrom: AddressOrNamespace): TransferInstructionBuilder;
    /**
     * Sets the destination address for the transferred token.
     * @param {AddressOrNamespace} transferTo - The address or namespace to which the token will be transferred.
     * @returns {TransferInstructionBuilder} - The instance of this builder for chaining.
     */
    setTransferTo(transferTo: AddressOrNamespace): TransferInstructionBuilder;
    /**
     * Sets the amount of the token to be transferred.
     * @param {string | null} amount - The amount of the token to transfer, represented as a string.
     * @returns {TransferInstructionBuilder} - The instance of this builder for chaining.
     */
    setAmount(amount: string | null): TransferInstructionBuilder;
    /**
     * Adds a list of token IDs to be transferred.
     * @param {string[]} tokenIds - An array of token IDs to be transferred.
     * @returns {TransferInstructionBuilder} - The instance of this builder for chaining.
     */
    addTokenIds(tokenIds: string[]): TransferInstructionBuilder;
    /**
     * Extends the existing list of token IDs with additional IDs.
     * @param {string[]} items - An array of additional token IDs to be transferred.
     * @returns {TransferInstructionBuilder} - The instance of this builder for chaining.
     */
    extendTokenIds(items: string[]): TransferInstructionBuilder;
    /**
     * Builds the `TransferInstruction` object using the properties set on the builder.
     * @returns {Instruction} - An `Instruction` object configured for a transfer operation, encapsulating
     * the transfer instruction details.
     */
    build(): Instruction;
}
/**
 * A builder class for constructing a `BurnInstruction` object, facilitating the configuration of properties
 * related to the burning of tokens. This builder offers a fluent API, allowing properties to be set in a
 * chained manner for ease of use and readability.
 */
export declare class BurnInstructionBuilder {
    private caller;
    private programId;
    private token;
    private burnFrom;
    private amount;
    private tokenIds;
    /**
     * Sets the caller's address, who initiates the burn operation.
     * @param {Address} caller - The address of the caller initiating the burn operation.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    setCaller(caller: Address): BurnInstructionBuilder;
    /**
     * Sets the program ID associated with the burn operation.
     * @param {AddressOrNamespace} programId - The program ID.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    setProgramId(programId: AddressOrNamespace): BurnInstructionBuilder;
    /**
     * Sets the token address of the tokens to be burned.
     * @param {Address} tokenAddress - The address of the token.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    setTokenAddress(tokenAddress: Address): BurnInstructionBuilder;
    /**
     * Sets the address from which the tokens will be burned.
     * @param {AddressOrNamespace} burnFromAddress - The address from which tokens are to be burned.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    setBurnFromAddress(burnFromAddress: AddressOrNamespace): BurnInstructionBuilder;
    /**
     * Sets the amount of tokens to be burned.
     * @param {string} amount - The amount of tokens to burn.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    setAmount(amount: string): BurnInstructionBuilder;
    /**
     * Adds a single token ID to the list of tokens to be burned.
     * @param {string} tokenId - A token ID to be burned.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    addTokenId(tokenId: string): BurnInstructionBuilder;
    /**
     * Extends the list of token IDs to be burned with additional token IDs.
     * @param {string[]} items - An array of token IDs to be added.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    extendTokenIds(items: string[]): BurnInstructionBuilder;
    /**
     * Builds the burn instruction using the properties set on the builder.
     * @returns {Instruction} - An `Instruction` object configured for a burn operation, encapsulating
     * the details necessary to execute the burn.
     */
    build(): Instruction;
}
/**
 * Builds token update instructions by aggregating individual updates and generating a final instruction object.
 */
export declare class TokenUpdateBuilder {
    private account;
    private token;
    private updates;
    constructor();
    /**
     * Adds an account address to the update instruction.
     * @param {AddressOrNamespace} account - The account address to be updated.
     * @returns {TokenUpdateBuilder} - The instance of this builder for chaining.
     */
    addUpdateAccountAddress(account: AddressOrNamespace): TokenUpdateBuilder;
    /**
     * Adds a token address to the update instruction.
     * @param {AddressOrNamespace} tokenAddress - The address of the token to be updated.
     * @returns {TokenUpdateBuilder} - The instance of this builder for chaining.
     */
    addTokenAddress(tokenAddress: AddressOrNamespace): TokenUpdateBuilder;
    /**
     * Adds an update field to the token update instruction.
     * @param {TokenOrProgramUpdate} updateField - The update field to be added.
     * @returns {TokenUpdateBuilder} - The instance of this builder for chaining.
     */
    addUpdateField(updateField: TokenOrProgramUpdate): TokenUpdateBuilder;
    /**
     * Builds the token update instruction.
     * @returns {Instruction} - The constructed token update instruction.
     */
    build(): Instruction;
}
/**
 * Builds token distribution instructions, including details about program ID, receiver, amount, and token IDs.
 */
export declare class TokenDistributionBuilder {
    private programId;
    private to;
    private amount;
    private tokenIds;
    private updateFields;
    constructor();
    /**
     * Sets the program ID for the token distribution.
     * @param {AddressOrNamespace} programId - The program ID.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    setProgramId(programId: AddressOrNamespace): TokenDistributionBuilder;
    /**
     * Sets the receiver address for the token distribution.
     * @param {AddressOrNamespace} receiver - The receiver's address.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    setReceiver(receiver: AddressOrNamespace): TokenDistributionBuilder;
    /**
     * Sets the amount for the token distribution.
     * @param {string} amount - The amount to be distributed.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    setAmount(amount: string): TokenDistributionBuilder;
    /**
     * Adds a single token ID to the distribution.
     * @param {string} tokenId - The token ID to add.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    addTokenId(tokenId: string): TokenDistributionBuilder;
    /**
     * Extends the list of token IDs with multiple IDs.
     * @param {string[]} items - The list of token IDs to add.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    extendTokenIds(items: string[]): TokenDistributionBuilder;
    /**
     * Adds an update field to the distribution.
     * @param {TokenUpdateField} updateField - The update field to add.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    addUpdateField(updateField: TokenUpdateField): TokenDistributionBuilder;
    /**
     * Extends the list of update fields with multiple fields.
     * @param {TokenUpdateField[]} items - The list of update fields to add.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    extendUpdateFields(items: TokenUpdateField[]): TokenDistributionBuilder;
    /**
     * Builds the token distribution object.
     * @returns {TokenDistribution} - The constructed token distribution object.
     */
    build(): TokenDistribution;
}
