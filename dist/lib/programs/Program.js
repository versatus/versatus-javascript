import { buildCreateInstruction, buildProgramUpdateField, buildTokenDistributionInstruction, buildTokenUpdateField, buildUpdateInstruction, } from '../../lib/programs/instruction-builders/builder-helpers.js';
import { THIS } from '../../lib/consts.js';
import { Outputs } from '../../lib/programs/Outputs.js';
import { checkIfValuesAreUndefined, formatAmountToHex, validate, validateAndCreateJsonString, } from '../../lib/utils.js';
import { AddressOrNamespace } from '../../lib/programs/Address-Namespace.js';
import { TokenOrProgramUpdate } from '../../lib/programs/Token.js';
/**
 * Class representing a Program with methods to manage and execute program strategies.
 */
export class Program {
    /**
     * Constructs a new Program instance.
     */
    constructor() {
        this.methodStrategies = {
            create: this.create.bind(this),
            update: this.update.bind(this),
        };
    }
    create(computeInputs) {
        try {
            const { transaction } = computeInputs;
            const { transactionInputs, from, to } = transaction;
            const txInputs = validate(JSON.parse(transactionInputs), 'unable to parse transactionInputs');
            const { symbol, name, totalSupply, initializedSupply: txInitializedSupply, imgUrl, recipientAddress, paymentProgramAddress, conversionRate, } = txInputs;
            checkIfValuesAreUndefined({
                symbol,
                name,
                totalSupply,
                initializedSupply: txInitializedSupply,
                imgUrl,
                paymentProgramAddress,
                conversionRate,
            });
            // metadata
            const metadataStr = validateAndCreateJsonString({
                symbol,
                name,
                totalSupply: formatAmountToHex(totalSupply),
            });
            // data
            const dataStr = validateAndCreateJsonString({
                type: 'fungible',
                imgUrl,
                paymentProgramAddress,
                conversionRate,
            });
            const addTokenMetadata = buildTokenUpdateField({
                field: 'metadata',
                value: metadataStr,
                action: 'extend',
            });
            const addTokenData = buildTokenUpdateField({
                field: 'data',
                value: dataStr,
                action: 'extend',
            });
            const addProgramData = buildProgramUpdateField({
                field: 'data',
                value: dataStr,
                action: 'extend',
            });
            const distributionInstruction = buildTokenDistributionInstruction({
                programId: THIS,
                initializedSupply: formatAmountToHex(txInitializedSupply),
                to: recipientAddress ?? to,
                tokenUpdates: [addTokenMetadata, addTokenData],
            });
            const createAndDistributeInstruction = buildCreateInstruction({
                from,
                initializedSupply: formatAmountToHex(txInitializedSupply),
                totalSupply,
                programId: THIS,
                programOwner: from,
                programNamespace: THIS,
                distributionInstruction,
            });
            const addProgramMetadata = buildProgramUpdateField({
                field: 'metadata',
                value: metadataStr,
                action: 'extend',
            });
            const programUpdateInstruction = buildUpdateInstruction({
                update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), [
                    addProgramMetadata,
                    addProgramData,
                ])),
            });
            return new Outputs(computeInputs, [
                createAndDistributeInstruction,
                programUpdateInstruction,
            ]).toJson();
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * Executes a program method strategy based on the given input.
     * @throws Will throw an error if the method name specified in `input` is not found in `methodStrategies`.
     * @returns The result of the strategy execution.
     * @param inputs
     */
    executeMethod(inputs) {
        const { op } = inputs;
        const strategy = this.methodStrategies[op];
        if (strategy) {
            return strategy(inputs);
        }
        throw new Error(`Unknown method: ${op}`);
    }
    /**
     * Initiates the execution of a program method based on the provided input.
     * @returns The result of executing the program method.
     * @param computeInputs
     */
    start(computeInputs) {
        try {
            return this.executeMethod(computeInputs);
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * Updates the program with the provided inputs.
     * @returns The result of updating the program.
     * @param computeInputs
     */
    update(computeInputs) {
        try {
            const { transaction } = computeInputs;
            const { transactionInputs } = transaction;
            const txInputs = JSON.parse(transactionInputs);
            const { data, metadata } = txInputs;
            const programUpdates = [];
            if (metadata) {
                const fieldUpdate = buildProgramUpdateField({
                    field: 'metadata',
                    value: JSON.stringify(metadata),
                    action: 'extend',
                });
                programUpdates.push(fieldUpdate);
            }
            if (data) {
                const fieldUpdate = buildProgramUpdateField({
                    field: 'data',
                    value: JSON.stringify(data),
                    action: 'extend',
                });
                programUpdates.push(fieldUpdate);
            }
            const programMetadataUpdateInstruction = buildUpdateInstruction({
                update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)),
            });
            return new Outputs(computeInputs, [
                programMetadataUpdateInstruction,
            ]).toJson();
        }
        catch (e) {
            throw e;
        }
    }
}
export class ProgramUpdate {
    constructor(account, updates) {
        this.account = account;
        this.updates = updates;
    }
    toJson() {
        return {
            account: this.account.toJson(),
            updates: this.updates.map((update) => update.toJson()),
        };
    }
}
export class ProgramUpdateField {
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }
    toJson() {
        return {
            field: this.field.toJson(),
            value: this.value.toJson(),
        };
    }
}
export class ProgramField {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return this.value;
    }
}
export class LinkedProgramsInsert {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { insert: this.key.toJson() };
    }
}
export class LinkedProgramsExtend {
    constructor(items) {
        this.items = items;
    }
    toJson() {
        return { extend: this.items.map((item) => item.toJson()) };
    }
}
export class LinkedProgramsRemove {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { remove: this.key.toJson() };
    }
}
export class LinkedProgramsValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { linkedPrograms: { linkedProgramValue: this.value.toJson() } };
    }
}
export class ProgramMetadataInsert {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    toJson() {
        return { insert: [this.key, this.value] };
    }
}
export class ProgramMetadataExtend {
    constructor(map) {
        this.map = map;
    }
    toJson() {
        return { extend: this.map };
    }
}
export class ProgramMetadataRemove {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { remove: this.key };
    }
}
export class ProgramMetadataValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { metadata: this.value.toJson() };
    }
}
export class ProgramDataInsert {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    toJson() {
        return { insert: [this.key, this.value] };
    }
}
export class ProgramDataExtend {
    constructor(map) {
        this.map = map;
    }
    toJson() {
        return { extend: this.map };
    }
}
export class ProgramDataRemove {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { remove: this.key };
    }
}
export class ProgramDataValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { data: this.value.toJson() };
    }
}
export class ProgramAccountDataExtend {
    constructor(map) {
        this.map = map;
    }
    toJson() {
        return { extend: this.map };
    }
}
export class ProgramFieldValue {
    constructor(kind, value) {
        this.kind = kind;
        this.value = value;
    }
    toJson() {
        return { [this.kind]: this.value.toJson() };
    }
}
