import { AddressOrNamespace } from './utils.js';
export class Instruction {
    constructor(kind, value) {
        this.kind = kind;
        this.value = value;
    }
    toJson() {
        return { [this.kind]: this.value.toJson() };
    }
}
export class CreateInstruction {
    constructor(programNamespace, programId, programOwner, totalSupply, initializedSupply, distribution) {
        this.programNamespace = programNamespace;
        this.programId = programId;
        this.programOwner = programOwner;
        this.totalSupply = totalSupply;
        this.initializedSupply = initializedSupply;
        this.distribution = distribution;
    }
    toJson() {
        const programNamespace = this.programNamespace instanceof AddressOrNamespace
            ? this.programNamespace.toJson()
            : this.programNamespace ?? null;
        const programId = this.programId instanceof AddressOrNamespace
            ? this.programId.toJson()
            : this.programId ?? null;
        return {
            programNamespace,
            programId,
            programOwner: this.programOwner?.toJson(),
            totalSupply: this.totalSupply?.toString(),
            initializedSupply: this.initializedSupply?.toString(),
            distribution: this.distribution.map((dist) => dist.toJson()),
        };
    }
}
export class UpdateInstruction {
    constructor(updates) {
        this.updates = updates;
    }
    toJson() {
        return {
            updates: this.updates.map((update) => update),
        };
    }
}
export class TransferInstruction {
    constructor(token, transferFrom, transferTo, amount, ids) {
        this.token = token;
        this.transferFrom = transferFrom;
        this.transferTo = transferTo;
        this.amount = amount;
        this.ids = ids;
    }
    toJson() {
        return {
            token: this.token?.toJson(),
            from: this.transferFrom?.toJson(),
            to: this.transferTo?.toJson(),
            amount: this.amount,
            ids: this.ids.map((id) => id),
        };
    }
}
export class BurnInstruction {
    constructor(caller, programId, token, burnFrom, amount, tokenIds) {
        this.caller = caller;
        this.programId = programId;
        this.token = token;
        this.burnFrom = burnFrom;
        this.amount = amount;
        this.tokenIds = tokenIds;
    }
    toJson() {
        return {
            caller: this.caller?.toJson(),
            programId: this.programId?.toJson(),
            token: this.token?.toJson(),
            from: this.burnFrom?.toJson(),
            amount: this.amount === null ? null : this.amount,
            ids: this.tokenIds.map((id) => id),
        };
    }
}
export class LogInstruction {
    toJson() {
        return {};
    }
}
