import { TokenDistribution, } from '../../../lib/programs/Token.js';
import { BurnInstruction, CreateInstruction, Instruction, TransferInstruction, UpdateInstruction, } from '../../../lib/programs/Instruction.js';
import { Outputs } from '../../../lib/programs/Outputs.js';
import { AddressOrNamespace } from '../../../lib/programs/Address-Namespace.js';
// import { Address } from '../../../lib/types'
export class TokenUpdateBuilder {
    constructor() {
        this.account = null;
        this.token = null;
        this.updates = [];
    }
    addUpdateAccountAddress(account) {
        this.account = account;
        return this;
    }
    addTokenAddress(tokenAddress) {
        this.token = tokenAddress;
        return this;
    }
    addUpdateField(updateField) {
        this.updates.push(updateField);
        return this;
    }
    build() {
        return new Instruction('update', new UpdateInstruction(this.updates.map((update) => update)));
    }
}
export class TokenDistributionBuilder {
    constructor() {
        this.programId = null;
        this.to = null;
        this.amount = null;
        this.tokenIds = [];
        this.updateFields = [];
    }
    setProgramId(programId) {
        this.programId = programId;
        return this;
    }
    setReceiver(receiver) {
        this.to = receiver;
        return this;
    }
    setAmount(amount) {
        this.amount = amount;
        return this;
    }
    addTokenId(tokenId) {
        this.tokenIds.push(tokenId);
        return this;
    }
    addUpdateField(updateField) {
        this.updateFields.push(updateField);
        return this;
    }
    extendTokenIds(items) {
        this.tokenIds.push(...items);
        return this;
    }
    extendUpdateFields(items) {
        this.updateFields.push(...items);
        return this;
    }
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
export class CreateInstructionBuilder {
    constructor() {
        this.programNamespace = null;
        this.programId = null;
        this.programOwner = null;
        this.totalSupply = null;
        this.initializedSupply = null;
        this.distribution = [];
    }
    setProgramNamespace(programNamespace) {
        this.programNamespace = programNamespace;
        return this;
    }
    setProgramId(programId) {
        this.programId = programId;
        return this;
    }
    setProgramOwner(programOwner) {
        this.programOwner = programOwner;
        return this;
    }
    setTotalSupply(totalSupply) {
        this.totalSupply = totalSupply;
        return this;
    }
    setInitializedSupply(initializedSupply) {
        this.initializedSupply = initializedSupply;
        return this;
    }
    addTokenDistribution(tokenDistribution) {
        this.distribution.push(tokenDistribution);
        return this;
    }
    extendTokenDistribution(items) {
        this.distribution.push(...items);
        return this;
    }
    build() {
        return new Instruction('create', new CreateInstruction(this.programNamespace, this.programId, this.programOwner, this.totalSupply, this.initializedSupply, this.distribution));
    }
}
export class UpdateInstructionBuilder {
    constructor() {
        this.updates = [];
    }
    addUpdate(update) {
        this.updates.push(update);
        return this;
    }
    extendUpdates(items) {
        this.updates.push(...items);
        return this;
    }
    build() {
        return new Instruction('update', new UpdateInstruction(this.updates));
    }
}
export class TransferInstructionBuilder {
    constructor() {
        this.token = null;
        this.transferFrom = null;
        this.transferTo = null;
        this.amount = null;
        this.ids = [];
    }
    setTokenAddress(tokenAddress) {
        this.token = tokenAddress;
        return this;
    }
    setTransferFrom(transferFrom) {
        this.transferFrom = transferFrom;
        return this;
    }
    setTransferTo(transferTo) {
        this.transferTo = transferTo;
        return this;
    }
    setAmount(amount) {
        this.amount = amount;
        return this;
    }
    addTokenIds(tokenIds) {
        this.ids.push(...tokenIds);
        return this;
    }
    extendTokenIds(items) {
        this.ids.push(...items);
        return this;
    }
    build() {
        const token = this.token ?? null;
        return new Instruction('transfer', new TransferInstruction(token, this.transferFrom, this.transferTo, this.amount, this.ids));
    }
}
export class BurnInstructionBuilder {
    constructor() {
        this.caller = null;
        this.programId = null;
        this.token = null;
        this.burnFrom = null;
        this.amount = null;
        this.tokenIds = [];
    }
    setCaller(caller) {
        this.caller = caller;
        return this;
    }
    setProgramId(programId) {
        this.programId = programId;
        return this;
    }
    setTokenAddress(tokenAddress) {
        this.token = tokenAddress;
        return this;
    }
    setBurnFromAddress(burnFromAddress) {
        this.burnFrom = burnFromAddress;
        return this;
    }
    setAmount(amount) {
        this.amount = amount;
        return this;
    }
    addTokenId(tokenId) {
        this.tokenIds.push(tokenId);
        return this;
    }
    extendTokenIds(items) {
        this.tokenIds.push(...items);
        return this;
    }
    build() {
        return new Instruction('burn', new BurnInstruction(this.caller, this.programId, this.token, this.burnFrom, this.amount, this.tokenIds));
    }
}
export class LogInstructionBuilder {
}
export class OutputBuilder {
    constructor() {
        this.inputs = null;
        this.instructions = [];
    }
    setInputs(inputs) {
        this.inputs = inputs;
        return this;
    }
    addInstruction(instruction) {
        this.instructions.push(instruction);
        return this;
    }
    build() {
        return new Outputs(this.inputs, this.instructions);
    }
}
