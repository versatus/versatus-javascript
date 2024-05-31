import { buildCreateInstruction, buildProgramUpdateField, buildTokenUpdateField, buildUpdateInstruction, } from '../../lib/programs/instruction-builders/builder-helpers.js';
import { THIS } from '../../lib/consts.js';
import { Outputs } from '../../lib/programs/Outputs.js';
import { checkIfValuesAreUndefined, formatAmountToHex, onlyOwner, validate, validateAndCreateJsonString, } from '../../lib/utils.js';
import { Address, AddressOrNamespace } from '../../lib/programs/Address-Namespace.js';
import { TokenOrProgramUpdate, TokenUpdate, } from '../../lib/programs/Token.js';
import { TokenUpdateBuilder } from '../../lib/programs/instruction-builders/builders.js';
/**
 * Represents a program with strategies for handling various operations such as `approve`, `create`, and `update`.
 * The program is initialized with a map of method strategies that bind specific methods to operation keys.
 * This structure allows for dynamic execution of methods based on the operation specified in the input.
 */
export class Program {
    /**
     * Constructs a new instance of the Program class, initializing the `methodStrategies` with `create` and `update` operations.
     */
    constructor() {
        this.methodStrategies = {
            approve: this.approve.bind(this),
            create: this.create.bind(this),
            update: this.update.bind(this),
        };
    }
    registerContractMethod(operation, method) {
        this.methodStrategies[operation] = method.bind(this);
    }
    /**
     * Approves a transaction by updating the `approvals` field with the inputs provided in the transaction.
     * This method constructs a token update to extend the `approvals` field, indicating a successful approval process.
     * The approval process involves building a series of updates and instructions that modify the token's state to reflect the new approval.
     *
     * The process includes constructing the `TokenUpdate` object with the caller's address, the program's address, and the approval update.
     * It then wraps this update in a `TokenOrProgramUpdate` object, specifying it as a `tokenUpdate`.
     * A `TokenUpdateBuilder` is used to construct the final update instruction, which is then converted to JSON format
     * and returned as the output of the method.
     *
     * @param {IComputeInputs} computeInputs - Contains the transaction details including transaction inputs and the program ID.
     * @returns {string} JSON string representing the outputs of the approve operation.
     * @throws {Error} Throws an error if any part of the approval process fails, including if there are issues constructing the updates.
     */
    approve(computeInputs) {
        try {
            const { transaction } = computeInputs;
            const { transactionInputs, programId } = transaction;
            const programAddress = new AddressOrNamespace(new Address(programId));
            const caller = new Address(transaction.from);
            const update = buildTokenUpdateField({
                field: 'approvals',
                value: JSON.parse(transactionInputs),
                action: 'extend',
            });
            const tokenUpdate = new TokenUpdate(new AddressOrNamespace(caller), programAddress, [update]);
            const tokenOrProgramUpdate = new TokenOrProgramUpdate('tokenUpdate', tokenUpdate);
            const updateInstruction = new TokenUpdateBuilder()
                .addTokenAddress(programAddress)
                .addUpdateField(tokenOrProgramUpdate)
                .build();
            return new Outputs(computeInputs, [updateInstruction]).toJson();
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * Handles the `create` operation by processing the given computeInputs, validating and transforming them into a structured output.
     * This method performs a series of validations and transformations, constructs various instructions for token and program updates,
     * and ultimately returns a JSON representation of the operation results.
     *
     * @param {IComputeInputs} computeInputs - Inputs necessary for computing the create operation, including transaction details.
     * @returns {string} JSON string representing the outputs of the create operation.
     * @throws {Error} Throws an error if any validation fails or if an unexpected error occurs during the process.
     */
    create(computeInputs) {
        try {
            const { transaction } = computeInputs;
            const { transactionInputs, from } = transaction;
            const txInputs = validate(JSON.parse(transactionInputs), 'unable to parse transactionInputs');
            const { symbol, name, totalSupply, initializedSupply: txInitializedSupply, } = txInputs;
            checkIfValuesAreUndefined({
                symbol,
                name,
                totalSupply,
                initializedSupply: txInitializedSupply,
            });
            // metadata
            const metadataStr = validateAndCreateJsonString({
                symbol,
                name,
                totalSupply: formatAmountToHex(totalSupply),
            });
            const createAndDistributeInstruction = buildCreateInstruction({
                from,
                initializedSupply: formatAmountToHex(txInitializedSupply),
                totalSupply,
                programId: THIS,
                programOwner: from,
                programNamespace: THIS,
            });
            const addProgramMetadata = buildProgramUpdateField({
                field: 'metadata',
                value: metadataStr,
                action: 'extend',
            });
            const programUpdateInstruction = buildUpdateInstruction({
                update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), [addProgramMetadata])),
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
     * Executes the method corresponding to the operation specified in the input.
     * This method looks up the strategy for the operation in the `methodStrategies` map and executes it.
     *
     * @param {IComputeInputs} inputs - Inputs containing the operation to be executed along with any necessary data.
     * @returns {any} The result of executing the method associated with the specified operation.
     * @throws {Error} Throws an error if the operation is unknown or if the associated method throws an error.
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
     * Starts the execution process by invoking `executeMethod` with the provided computeInputs.
     * This is a convenience method that serves as an entry point to execute a method based on the operation specified in the inputs.
     *
     * @param {IComputeInputs} computeInputs - Inputs necessary for executing a method, including the operation to be performed.
     * @returns {any} The result of executing the method associated with the specified operation.
     * @throws {Error} Throws an error if `executeMethod` throws an error.
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
     * Handles the `update` operation by processing the given computeInputs, performing validations, and transforming them into structured output.
     * Similar to the `create` method, this method processes inputs related to program updates, constructs various update instructions,
     * and returns a JSON representation of the operation results.
     *
     * @param {IComputeInputs} computeInputs - Inputs necessary for computing the update operation, including transaction details.
     * @returns {string} JSON string representing the outputs of the update operation.
     * @throws {Error} Throws an error if any validation fails or if an unexpected error occurs during the process.
     */
    update(computeInputs) {
        try {
            onlyOwner(computeInputs);
            const { transaction } = computeInputs;
            const { transactionInputs } = transaction;
            const txInputs = JSON.parse(transactionInputs);
            const { data, metadata, linkedPrograms } = txInputs;
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
            if (linkedPrograms) {
                validate(Array.isArray(linkedPrograms), 'linkedPrograms must be an array');
                const linkedProgramsUpdate = buildProgramUpdateField({
                    field: 'linkedPrograms',
                    value: JSON.stringify(linkedPrograms),
                    action: 'extend',
                });
                programUpdates.push(linkedProgramsUpdate);
            }
            const programUpdateInstruction = buildUpdateInstruction({
                update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)),
            });
            return new Outputs(computeInputs, [programUpdateInstruction]).toJson();
        }
        catch (e) {
            throw e;
        }
    }
    static run() {
        process.stdin.setEncoding('utf8');
        let data = '';
        process.stdin.on('readable', () => {
            let chunk;
            while ((chunk = process.stdin.read()) !== null) {
                data += chunk;
            }
        });
        process.stdin.on('end', () => {
            try {
                const parsedData = JSON.parse(data);
                const contract = new this();
                const result = contract.start(parsedData);
                process.stdout.write(JSON.stringify(result));
            }
            catch (err) {
                console.error('Failed to parse JSON input:', err);
            }
        });
    }
}
/**
 * Represents a program update instruction in LASR. This class encapsulates
 * the details necessary for updating a program's properties or state, including the account associated with the
 * program and a collection of update fields specifying the changes to be made.
 */
export class ProgramUpdate {
    /**
     * Constructs a new ProgramUpdate instance.
     *
     * @param {AddressOrNamespace} account - The account or namespace associated with the program to be updated.
     * @param {ProgramUpdateField[]} updates - An array of update fields, each detailing a specific change to the program's properties or state.
     */
    constructor(account, updates) {
        this.account = account;
        this.updates = updates;
    }
    /**
     * Converts the program update to a JSON object for serialization and storage. This method ensures that the
     * update instruction is formatted in a structure suitable for transmission or storage, detailing the account
     * associated with the program and the specific updates to be applied.
     *
     * @returns {object} The JSON representation of the program update instruction, including the account and the updates to be applied.
     */
    toJson() {
        return {
            account: this.account.toJson(), // Serialize the account associated with the update.
            updates: this.updates.map((update) => update.toJson()), // Map each update field to its JSON representation.
        };
    }
}
/**
 * Represents a specific field update within a program update instruction. This class is used to define
 * a single update action on a program's property, encapsulating both the field to be updated and the new
 * value or modification to apply.
 */
export class ProgramUpdateField {
    /**
     * Constructs a new ProgramUpdateField instance.
     *
     * @param {ProgramField} field - The specific field of the program to be updated.
     * @param {ProgramFieldValue} value - The new value or modification to be applied to the field.
     */
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }
    /**
     * Converts the program update field to a JSON object for serialization and storage. This method ensures
     * that the update field is formatted in a structure suitable for transmission or storage, clearly conveying
     * the specific field being updated and the nature of the update.
     *
     * @returns {object} The JSON representation of the program update field, including the field identifier and the update value.
     */
    toJson() {
        return {
            field: this.field.toJson(), // Serialize the field identifier to its JSON representation.
            value: this.value.toJson(), // Serialize the update value to its JSON representation.
        };
    }
}
/**
 * Represents a field within a program that can be updated. This class encapsulates the identifier
 * of the field to be updated, providing a straightforward way to specify which part of a program
 * is being targeted for modification.
 */
export class ProgramField {
    /**
     * Constructs a new ProgramField instance.
     *
     * @param {string} value - The identifier of the program field to be updated.
     */
    constructor(value) {
        this.value = value;
    }
    /**
     * Converts the program field to its string representation for serialization and storage.
     * This method allows the field identifier to be easily included in JSON objects or other
     * serialization formats.
     *
     * @returns {string} The string representation of the program field.
     */
    toJson() {
        return this.value;
    }
}
/**
 * Represents an insert operation for linked programs within LASR.
 * This class encapsulates the action of adding a new link to another program, identified by its address.
 */
export class LinkedProgramsInsert {
    /**
     * Constructs a new LinkedProgramsInsert instance.
     *
     * @param {Address} key - The address of the program to be linked.
     */
    constructor(key) {
        this.key = key;
    }
    /**
     * Converts the linked programs insert operation to a JSON object for serialization and storage.
     * This method formats the operation in a structure suitable for transmission or storage,
     * clearly indicating the insert action and the address of the program being linked.
     *
     * @returns {object} The JSON representation of the insert operation, including the address of the linked program.
     */
    toJson() {
        return { insert: this.key.toJson() };
    }
}
/**
 * Represents an extension operation for linked programs, specifying multiple programs to be linked.
 * This class encapsulates the addresses of the programs to be added, facilitating bulk updates to the
 * set of programs linked to another entity.
 */
export class LinkedProgramsExtend {
    /**
     * Constructs a new LinkedProgramsExtend instance.
     *
     * @param {Address[]} items - An array of addresses of the programs to be linked.
     */
    constructor(items) {
        this.items = items;
    }
    /**
     * Converts the linked programs extension to a JSON object for serialization and storage. This method
     * ensures that the operation is formatted in a structure suitable for transmission or storage, clearly
     * conveying the programs to be added.
     *
     * @returns {object} The JSON representation of the linked programs extension, including the addresses of the programs.
     */
    toJson() {
        return { extend: this.items.map((item) => item.toJson()) };
    }
}
/**
 * Represents a removal operation for linked programs within LASR,
 * specifying a single program to be unlinked. This class encapsulates the address of the program to be removed,
 * facilitating updates to the set of programs linked to another entity, such as a token or an account, by
 * indicating which program should be detached.
 */
export class LinkedProgramsRemove {
    /**
     * Constructs a new LinkedProgramsRemove instance.
     *
     * @param {Address} key - The address of the program to be unlinked.
     */
    constructor(key) {
        this.key = key;
    }
    /**
     * Converts the linked program removal to a JSON object for serialization and storage. This method ensures
     * that the operation is formatted in a structure suitable for transmission or storage, clearly conveying the
     * program to be removed.
     *
     * @returns {object} The JSON representation of the linked program removal, including the program address to be removed.
     */
    toJson() {
        return { remove: this.key.toJson() };
    }
}
/**
 * Represents a value class for handling linked programs operations in LASR, encapsulating different operations
 * such as insert, extend, or remove. This class provides a unified interface for working with linked programs,
 * allowing for clear and structured representation of operations that modify the linkage of programs within LASR.
 */
export class LinkedProgramsValue {
    /**
     * Constructs a new LinkedProgramsValue instance.
     *
     * @param {LinkedProgramsInsert | LinkedProgramsExtend | LinkedProgramsRemove} value - The specific operation to be applied to linked programs.
     */
    constructor(value) {
        this.value = value;
    }
    /**
     * Converts the linked programs value to a JSON object for serialization and storage. This method formats
     * the encapsulated operation in a structure suitable for transmission or storage, ensuring the operation
     * is represented in a comprehensible and accessible manner.
     *
     * @returns {object} The JSON representation of the linked programs operation, including the specific action
     *                   and its details.
     */
    toJson() {
        return { linkedPrograms: { linkedProgramValue: this.value.toJson() } };
    }
}
/**
 * Represents an operation to insert a new key-value pair into the metadata of a program on the LASR platform.
 * This class encapsulates both the key and value of the metadata to be inserted, facilitating updates to the
 * program's metadata with new information.
 */
export class ProgramMetadataInsert {
    /**
     * Constructs a new ProgramMetadataInsert instance.
     *
     * @param {string} key - The key of the metadata entry to be inserted.
     * @param {string} value - The value associated with the key in the metadata entry.
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    /**
     * Converts the metadata insertion operation to a JSON object for serialization and storage. This method
     * ensures that the operation is formatted in a structure suitable for transmission or storage, clearly
     * conveying the key-value pair to be inserted into the program's metadata.
     *
     * @returns {object} The JSON representation of the metadata insertion operation, including the key and value.
     */
    toJson() {
        return { insert: [this.key, this.value] };
    }
}
/**
 * Represents an operation to extend a program's metadata with multiple entries on the LASR platform.
 * This class allows for the bulk addition of metadata entries, specified as a map of key-value pairs.
 */
export class ProgramMetadataExtend {
    /**
     * Constructs a new ProgramMetadataExtend instance.
     *
     * @param {Record<string, string>} map - A map of key-value pairs to be added to the program's metadata.
     */
    constructor(map) {
        this.map = map;
    }
    /**
     * Converts the program metadata extension operation to a JSON object for serialization and storage.
     * This method formats the bulk addition of metadata entries in a structure suitable for transmission
     * or storage, detailing each key-value pair to be added.
     *
     * @returns {object} The JSON representation of the metadata extension operation, including the map of key-value pairs.
     */
    toJson() {
        return { extend: this.map };
    }
}
/**
 * Represents an operation to remove a specific metadata entry from a program on the LASR platform. This class
 * encapsulates the key of the metadata entry to be removed, allowing for precise modification of a program's metadata.
 */
export class ProgramMetadataRemove {
    /**
     * Constructs a new ProgramMetadataRemove instance.
     *
     * @param {string} key - The key of the metadata entry to be removed from the program's metadata.
     */
    constructor(key) {
        this.key = key;
    }
    /**
     * Converts the program metadata removal operation to a JSON object for serialization and storage.
     * This method ensures that the operation is formatted in a structure suitable for transmission or
     * storage, clearly conveying the key of the metadata entry to be removed.
     *
     * @returns {object} The JSON representation of the metadata removal operation, including the key of the entry to be removed.
     */
    toJson() {
        return { remove: this.key };
    }
}
/**
 * Encapsulates a value modification operation within program metadata on the LASR platform. This class serves as a
 * wrapper for various types of metadata update actions, such as inserting a new key-value pair, extending the metadata
 * with multiple entries, or removing an existing entry.
 */
export class ProgramMetadataValue {
    /**
     * Constructs a new ProgramMetadataValue instance, which can hold any one of the specific metadata
     * update operations: insert, extend, or remove.
     *
     * @param {ProgramMetadataInsert | ProgramMetadataExtend | ProgramMetadataRemove} value - The specific metadata update operation to be encapsulated.
     */
    constructor(value) {
        this.value = value;
    }
    /**
     * Converts the encapsulated program metadata update operation to a JSON object for serialization and storage.
     * This method formats the update action in a structure suitable for transmission or storage, detailing the
     * nature of the update to the program's metadata.
     *
     * @returns {object} The JSON representation of the program metadata update operation, encapsulating the specific action and its details.
     */
    toJson() {
        return { metadata: this.value.toJson() };
    }
}
/**
 * Represents an operation to insert a single data entry into a program on the LASR platform. This class
 * encapsulates a key-value pair, enabling the specification of new data to be added to a program's existing data set.
 */
export class ProgramDataInsert {
    /**
     * Constructs a new ProgramDataInsert instance.
     *
     * @param {string} key - The key for the data entry to be inserted.
     * @param {string} value - The value associated with the key to be inserted.
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    /**
     * Converts the program data insert operation to a JSON object for serialization and storage.
     * This method ensures that the operation is formatted in a structure suitable for transmission or
     * storage, clearly conveying the key-value pair to be inserted into the program's data set.
     *
     * @returns {object} The JSON representation of the data insert operation, including the key-value pair.
     */
    toJson() {
        return { insert: [this.key, this.value] };
    }
}
/**
 * Represents an operation to extend a program's data with multiple entries on the LASR platform.
 * This class allows for the bulk addition of data entries, specified as a map of key-value pairs,
 * facilitating comprehensive updates to a program's data set.
 */
export class ProgramDataExtend {
    /**
     * Constructs a new ProgramDataExtend instance.
     *
     * @param {Record<string, string>} map - A map of key-value pairs to be added to the program's data set.
     */
    constructor(map) {
        this.map = map;
    }
    /**
     * Converts the program data extension operation to a JSON object for serialization and storage.
     * This method formats the bulk addition of data entries in a structure suitable for transmission
     * or storage, detailing each key-value pair to be added.
     *
     * @returns {object} The JSON representation of the data extension operation, including the map of key-value pairs.
     */
    toJson() {
        return { extend: this.map };
    }
}
/**
 * Represents an operation to remove a specific data entry from a program on the LASR platform. This class encapsulates the key of the data entry to be removed, allowing for precise modifications of a program's data set.
 */
export class ProgramDataRemove {
    /**
     * Constructs a new ProgramDataRemove instance.
     *
     * @param {string} key - The key of the data entry to be removed from the program's data set.
     */
    constructor(key) {
        this.key = key;
    }
    /**
     * Converts the program data removal operation to a JSON object for serialization and storage. This method ensures that the operation is formatted in a structure suitable for transmission or storage, clearly conveying the key of the data entry to be removed.
     *
     * @returns {object} The JSON representation of the data removal operation, including the key of the entry to be removed.
     */
    toJson() {
        return { remove: this.key };
    }
}
/**
 * Represents a container for a program data update operation on the LASR platform, encapsulating a specific
 * action (insert, extend, or remove) to be performed on the program's data. This class serves as a wrapper
 * around the various types of data operations, enabling them to be treated uniformly when constructing updates.
 */
export class ProgramDataValue {
    /**
     * Constructs a new ProgramDataValue instance, holding an operation that modifies program data.
     *
     * @param {ProgramDataInsert | ProgramDataExtend | ProgramDataRemove} value - The specific data operation to be performed, which can be an insertion, extension, or removal of data.
     */
    constructor(value) {
        this.value = value;
    }
    /**
     * Converts the program data value and its encapsulated operation to a JSON object for serialization and storage.
     * This method ensures that the operation is formatted in a structure suitable for transmission or storage,
     * clearly conveying the intended modification to the program's data.
     *
     * @returns {object} The JSON representation of the program data value, including the specific operation to be performed.
     */
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
