/**
 * Provides builders for creating various instruction objects related to token operations,
 * including token update, token distribution, instruction creation, and more.
 * These builders follow the builder pattern, offering a fluent API for constructing complex objects step by step.
 */
import { TokenDistribution, } from '../../../lib/programs/Token.js';
import { BurnInstruction, CreateInstruction, Instruction, TransferInstruction, UpdateInstruction, } from '../../../lib/programs/Instruction.js';
import { AddressOrNamespace } from '../../../lib/programs/Address-Namespace.js';
/**
 * A builder class for constructing a `CreateInstruction` object. This class provides a fluent API to set various properties of
 * a create instruction, such as program namespace, program ID, program owner, total supply, and initialized supply. Additionally,
 * it allows for the aggregation of multiple token distributions into the instruction. This class is part of a system that abstracts
 * complex instruction creation into manageable steps, improving code readability and maintainability.
 */
export class CreateInstructionBuilder {
    constructor() {
        this.programNamespace = null;
        this.programId = null;
        this.programOwner = null;
        this.totalSupply = null;
        this.initializedSupply = null;
        this.distribution = [];
    }
    /**
     * Sets the program namespace for the instruction being built.
     * @param {AddressOrNamespace} programNamespace - The namespace of the program.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    setProgramNamespace(programNamespace) {
        this.programNamespace = programNamespace;
        return this;
    }
    /**
     * Sets the program ID for the instruction being built.
     * @param {AddressOrNamespace} programId - The ID of the program.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    setProgramId(programId) {
        this.programId = programId;
        return this;
    }
    /**
     * Sets the program owner for the instruction being built.
     * @param {Address} programOwner - The owner of the program.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    setProgramOwner(programOwner) {
        this.programOwner = programOwner;
        return this;
    }
    /**
     * Sets the total supply for the token or program being created.
     * @param {string} totalSupply - The total supply as a string.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    setTotalSupply(totalSupply) {
        this.totalSupply = totalSupply;
        return this;
    }
    /**
     * Sets the initialized supply for the token or program being created.
     * @param {string} initializedSupply - The initialized supply as a string.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    setInitializedSupply(initializedSupply) {
        this.initializedSupply = initializedSupply;
        return this;
    }
    /**
     * Adds a single token distribution to the list of distributions that will be part of the create instruction.
     * @param {TokenDistribution} tokenDistribution - A token distribution object.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    addTokenDistribution(tokenDistribution) {
        this.distribution.push(tokenDistribution);
        return this;
    }
    /**
     * Extends the list of token distributions with an array of token distribution objects.
     * @param {TokenDistribution[]} items - An array of token distribution objects.
     * @returns {CreateInstructionBuilder} - The instance of this builder for method chaining.
     */
    extendTokenDistribution(items) {
        this.distribution.push(...items);
        return this;
    }
    /**
     * Builds and returns a new `Instruction` object of type `create`, encapsulating all the set properties and the aggregated
     * token distributions.
     * @returns {Instruction} - The constructed `CreateInstruction` object, ready to be used in the application.
     */
    build() {
        return new Instruction('create', new CreateInstruction(this.programNamespace, this.programId, this.programOwner, this.totalSupply, this.initializedSupply, this.distribution));
    }
}
/**
 * A builder class for constructing an `UpdateInstruction` object. This class provides methods to add
 * updates to the instruction. It allows for chaining methods to configure an `UpdateInstruction` and
 * finally build it into an `Instruction` object.
 */
export class UpdateInstructionBuilder {
    constructor() {
        this.updates = [];
    }
    /**
     * Adds a single update to the instruction.
     * @param update - A `TokenOrProgramUpdate` object to add to the update list.
     * @returns The instance of this builder for chaining.
     */
    addUpdate(update) {
        this.updates.push(update);
        return this;
    }
    /**
     * Extends the updates list with an array of `TokenOrProgramUpdate` objects.
     * @param items - An array of `TokenOrProgramUpdate` objects to add to the update list.
     * @returns The instance of this builder for chaining.
     */
    extendUpdates(items) {
        this.updates.push(...items);
        return this;
    }
    /**
     * Builds the update instruction using the configured updates.
     * @returns An `Instruction` object configured as an update instruction with the specified updates.
     */
    build() {
        return new Instruction('update', new UpdateInstruction(this.updates));
    }
}
/**
 * A builder class for constructing a `TransferInstruction` object, facilitating the setting of various
 * properties relevant to a token transfer operation. This builder provides a fluent API for configuring
 * a transfer instruction step by step.
 */
export class TransferInstructionBuilder {
    constructor() {
        this.token = null;
        this.transferFrom = null;
        this.transferTo = null;
        this.amount = null;
        this.ids = [];
    }
    /**
     * Sets the token address for the transfer.
     * @param {Address} tokenAddress - The address of the token to be transferred.
     * @returns {TransferInstructionBuilder} - The instance of this builder for chaining.
     */
    setTokenAddress(tokenAddress) {
        this.token = tokenAddress;
        return this;
    }
    /**
     * Sets the address from which the token will be transferred.
     * @param {AddressOrNamespace} transferFrom - The address or namespace from which the transfer originates.
     * @returns {TransferInstructionBuilder} - The instance of this builder for chaining.
     */
    setTransferFrom(transferFrom) {
        this.transferFrom = transferFrom;
        return this;
    }
    /**
     * Sets the destination address for the transferred token.
     * @param {AddressOrNamespace} transferTo - The address or namespace to which the token will be transferred.
     * @returns {TransferInstructionBuilder} - The instance of this builder for chaining.
     */
    setTransferTo(transferTo) {
        this.transferTo = transferTo;
        return this;
    }
    /**
     * Sets the amount of the token to be transferred.
     * @param {string | null} amount - The amount of the token to transfer, represented as a string.
     * @returns {TransferInstructionBuilder} - The instance of this builder for chaining.
     */
    setAmount(amount) {
        this.amount = amount;
        return this;
    }
    /**
     * Adds a list of token IDs to be transferred.
     * @param {string[]} tokenIds - An array of token IDs to be transferred.
     * @returns {TransferInstructionBuilder} - The instance of this builder for chaining.
     */
    addTokenIds(tokenIds) {
        this.ids.push(...tokenIds);
        return this;
    }
    /**
     * Extends the existing list of token IDs with additional IDs.
     * @param {string[]} items - An array of additional token IDs to be transferred.
     * @returns {TransferInstructionBuilder} - The instance of this builder for chaining.
     */
    extendTokenIds(items) {
        this.ids.push(...items);
        return this;
    }
    /**
     * Builds the `TransferInstruction` object using the properties set on the builder.
     * @returns {Instruction} - An `Instruction` object configured for a transfer operation, encapsulating
     * the transfer instruction details.
     */
    build() {
        const token = this.token ?? null;
        return new Instruction('transfer', new TransferInstruction(token, this.transferFrom, this.transferTo, this.amount, this.ids));
    }
}
/**
 * A builder class for constructing a `BurnInstruction` object, facilitating the configuration of properties
 * related to the burning of tokens. This builder offers a fluent API, allowing properties to be set in a
 * chained manner for ease of use and readability.
 */
export class BurnInstructionBuilder {
    constructor() {
        this.caller = null;
        this.programId = null;
        this.token = null;
        this.burnFrom = null;
        this.amount = null;
        this.tokenIds = [];
    }
    /**
     * Sets the caller's address, who initiates the burn operation.
     * @param {Address} caller - The address of the caller initiating the burn operation.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    setCaller(caller) {
        this.caller = caller;
        return this;
    }
    /**
     * Sets the program ID associated with the burn operation.
     * @param {AddressOrNamespace} programId - The program ID.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    setProgramId(programId) {
        this.programId = programId;
        return this;
    }
    /**
     * Sets the token address of the tokens to be burned.
     * @param {Address} tokenAddress - The address of the token.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    setTokenAddress(tokenAddress) {
        this.token = tokenAddress;
        return this;
    }
    /**
     * Sets the address from which the tokens will be burned.
     * @param {AddressOrNamespace} burnFromAddress - The address from which tokens are to be burned.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    setBurnFromAddress(burnFromAddress) {
        this.burnFrom = burnFromAddress;
        return this;
    }
    /**
     * Sets the amount of tokens to be burned.
     * @param {string} amount - The amount of tokens to burn.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    setAmount(amount) {
        this.amount = amount;
        return this;
    }
    /**
     * Adds a single token ID to the list of tokens to be burned.
     * @param {string} tokenId - A token ID to be burned.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    addTokenId(tokenId) {
        this.tokenIds.push(tokenId);
        return this;
    }
    /**
     * Extends the list of token IDs to be burned with additional token IDs.
     * @param {string[]} items - An array of token IDs to be added.
     * @returns {BurnInstructionBuilder} - The instance of this builder for chaining.
     */
    extendTokenIds(items) {
        this.tokenIds.push(...items);
        return this;
    }
    /**
     * Builds the burn instruction using the properties set on the builder.
     * @returns {Instruction} - An `Instruction` object configured for a burn operation, encapsulating
     * the details necessary to execute the burn.
     */
    build() {
        return new Instruction('burn', new BurnInstruction(this.caller, this.programId, this.token, this.burnFrom, this.amount, this.tokenIds));
    }
}
/**
 * Builds token update instructions by aggregating individual updates and generating a final instruction object.
 */
export class TokenUpdateBuilder {
    constructor() {
        this.account = null;
        this.token = null;
        this.updates = [];
    }
    /**
     * Adds an account address to the update instruction.
     * @param {AddressOrNamespace} account - The account address to be updated.
     * @returns {TokenUpdateBuilder} - The instance of this builder for chaining.
     */
    addUpdateAccountAddress(account) {
        this.account = account;
        return this;
    }
    /**
     * Adds a token address to the update instruction.
     * @param {AddressOrNamespace} tokenAddress - The address of the token to be updated.
     * @returns {TokenUpdateBuilder} - The instance of this builder for chaining.
     */
    addTokenAddress(tokenAddress) {
        this.token = tokenAddress;
        return this;
    }
    /**
     * Adds an update field to the token update instruction.
     * @param {TokenOrProgramUpdate} updateField - The update field to be added.
     * @returns {TokenUpdateBuilder} - The instance of this builder for chaining.
     */
    addUpdateField(updateField) {
        this.updates.push(updateField);
        return this;
    }
    /**
     * Builds the token update instruction.
     * @returns {Instruction} - The constructed token update instruction.
     */
    build() {
        return new Instruction('update', new UpdateInstruction(this.updates.map((update) => update)));
    }
}
/**
 * Builds token distribution instructions, including details about program ID, receiver, amount, and token IDs.
 */
export class TokenDistributionBuilder {
    constructor() {
        this.programId = null;
        this.to = null;
        this.amount = null;
        this.tokenIds = [];
        this.updateFields = [];
    }
    /**
     * Sets the program ID for the token distribution.
     * @param {AddressOrNamespace} programId - The program ID.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    setProgramId(programId) {
        this.programId = programId;
        return this;
    }
    /**
     * Sets the receiver address for the token distribution.
     * @param {AddressOrNamespace} receiver - The receiver's address.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    setReceiver(receiver) {
        this.to = receiver;
        return this;
    }
    /**
     * Sets the amount for the token distribution.
     * @param {string} amount - The amount to be distributed.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    setAmount(amount) {
        this.amount = amount;
        return this;
    }
    /**
     * Adds a single token ID to the distribution.
     * @param {string} tokenId - The token ID to add.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    addTokenId(tokenId) {
        this.tokenIds.push(tokenId);
        return this;
    }
    /**
     * Extends the list of token IDs with multiple IDs.
     * @param {string[]} items - The list of token IDs to add.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    extendTokenIds(items) {
        this.tokenIds.push(...items);
        return this;
    }
    /**
     * Adds an update field to the distribution.
     * @param {TokenUpdateField} updateField - The update field to add.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    addUpdateField(updateField) {
        this.updateFields.push(updateField);
        return this;
    }
    /**
     * Extends the list of update fields with multiple fields.
     * @param {TokenUpdateField[]} items - The list of update fields to add.
     * @returns {TokenDistributionBuilder} - The instance of this builder for chaining.
     */
    extendUpdateFields(items) {
        this.updateFields.push(...items);
        return this;
    }
    /**
     * Builds the token distribution object.
     * @returns {TokenDistribution} - The constructed token distribution object.
     */
    build() {
        const programId = this.programId instanceof AddressOrNamespace
            ? this.programId.toJson()
            : this.programId ?? null;
        const to = this.to instanceof AddressOrNamespace
            ? this.to.toJson()
            : this.to ?? null;
        return new TokenDistribution(programId, to, this.amount, this.tokenIds.map((tokenId) => tokenId), this.updateFields.map((updateField) => updateField.toJson()));
    }
}
