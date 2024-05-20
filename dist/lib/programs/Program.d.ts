import { Address, AddressOrNamespace } from '../../lib/programs/Address-Namespace';
import { StatusValue } from '../../lib/programs/Token';
import { IComputeInputs } from '../../lib/interfaces';
/**
 * Represents a program with strategies for handling various operations such as `approve`, `create`, and `update`.
 * The program is initialized with a map of method strategies that bind specific methods to operation keys.
 * This structure allows for dynamic execution of methods based on the operation specified in the input.
 */
export declare class Program {
    /**
     * A dictionary mapping operation keys to their corresponding methods.
     * @type {{ [key: string]: Function }}
     */
    methodStrategies: {
        [key: string]: Function;
    };
    /**
     * Constructs a new instance of the Program class, initializing the `methodStrategies` with `create` and `update` operations.
     */
    constructor();
    registerContractMethod(operation: string, method: Function): void;
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
    approve(computeInputs: IComputeInputs): object;
    /**
     * Handles the `create` operation by processing the given computeInputs, validating and transforming them into a structured output.
     * This method performs a series of validations and transformations, constructs various instructions for token and program updates,
     * and ultimately returns a JSON representation of the operation results.
     *
     * @param {IComputeInputs} computeInputs - Inputs necessary for computing the create operation, including transaction details.
     * @returns {string} JSON string representing the outputs of the create operation.
     * @throws {Error} Throws an error if any validation fails or if an unexpected error occurs during the process.
     */
    create(computeInputs: IComputeInputs): object;
    /**
     * Executes the method corresponding to the operation specified in the input.
     * This method looks up the strategy for the operation in the `methodStrategies` map and executes it.
     *
     * @param {IComputeInputs} inputs - Inputs containing the operation to be executed along with any necessary data.
     * @returns {any} The result of executing the method associated with the specified operation.
     * @throws {Error} Throws an error if the operation is unknown or if the associated method throws an error.
     */
    executeMethod(inputs: IComputeInputs): any;
    /**
     * Starts the execution process by invoking `executeMethod` with the provided computeInputs.
     * This is a convenience method that serves as an entry point to execute a method based on the operation specified in the inputs.
     *
     * @param {IComputeInputs} computeInputs - Inputs necessary for executing a method, including the operation to be performed.
     * @returns {any} The result of executing the method associated with the specified operation.
     * @throws {Error} Throws an error if `executeMethod` throws an error.
     */
    start(computeInputs: IComputeInputs): any;
    /**
     * Handles the `update` operation by processing the given computeInputs, performing validations, and transforming them into structured output.
     * Similar to the `create` method, this method processes inputs related to program updates, constructs various update instructions,
     * and returns a JSON representation of the operation results.
     *
     * @param {IComputeInputs} computeInputs - Inputs necessary for computing the update operation, including transaction details.
     * @returns {string} JSON string representing the outputs of the update operation.
     * @throws {Error} Throws an error if any validation fails or if an unexpected error occurs during the process.
     */
    update(computeInputs: IComputeInputs): object;
    static run(): void;
}
/**
 * Represents a program update instruction in LASR. This class encapsulates
 * the details necessary for updating a program's properties or state, including the account associated with the
 * program and a collection of update fields specifying the changes to be made.
 */
export declare class ProgramUpdate {
    private account;
    private updates;
    /**
     * Constructs a new ProgramUpdate instance.
     *
     * @param {AddressOrNamespace} account - The account or namespace associated with the program to be updated.
     * @param {ProgramUpdateField[]} updates - An array of update fields, each detailing a specific change to the program's properties or state.
     */
    constructor(account: AddressOrNamespace, updates: ProgramUpdateField[]);
    /**
     * Converts the program update to a JSON object for serialization and storage. This method ensures that the
     * update instruction is formatted in a structure suitable for transmission or storage, detailing the account
     * associated with the program and the specific updates to be applied.
     *
     * @returns {object} The JSON representation of the program update instruction, including the account and the updates to be applied.
     */
    toJson(): object;
}
/**
 * Represents a specific field update within a program update instruction. This class is used to define
 * a single update action on a program's property, encapsulating both the field to be updated and the new
 * value or modification to apply.
 */
export declare class ProgramUpdateField {
    private field;
    private value;
    /**
     * Constructs a new ProgramUpdateField instance.
     *
     * @param {ProgramField} field - The specific field of the program to be updated.
     * @param {ProgramFieldValue} value - The new value or modification to be applied to the field.
     */
    constructor(field: ProgramField, value: ProgramFieldValue);
    /**
     * Converts the program update field to a JSON object for serialization and storage. This method ensures
     * that the update field is formatted in a structure suitable for transmission or storage, clearly conveying
     * the specific field being updated and the nature of the update.
     *
     * @returns {object} The JSON representation of the program update field, including the field identifier and the update value.
     */
    toJson(): object;
}
/**
 * Represents a field within a program that can be updated. This class encapsulates the identifier
 * of the field to be updated, providing a straightforward way to specify which part of a program
 * is being targeted for modification.
 */
export declare class ProgramField {
    private value;
    /**
     * Constructs a new ProgramField instance.
     *
     * @param {string} value - The identifier of the program field to be updated.
     */
    constructor(value: string);
    /**
     * Converts the program field to its string representation for serialization and storage.
     * This method allows the field identifier to be easily included in JSON objects or other
     * serialization formats.
     *
     * @returns {string} The string representation of the program field.
     */
    toJson(): string;
}
/**
 * Represents an insert operation for linked programs within LASR.
 * This class encapsulates the action of adding a new link to another program, identified by its address.
 */
export declare class LinkedProgramsInsert {
    private key;
    /**
     * Constructs a new LinkedProgramsInsert instance.
     *
     * @param {Address} key - The address of the program to be linked.
     */
    constructor(key: Address);
    /**
     * Converts the linked programs insert operation to a JSON object for serialization and storage.
     * This method formats the operation in a structure suitable for transmission or storage,
     * clearly indicating the insert action and the address of the program being linked.
     *
     * @returns {object} The JSON representation of the insert operation, including the address of the linked program.
     */
    toJson(): object;
}
/**
 * Represents an extension operation for linked programs, specifying multiple programs to be linked.
 * This class encapsulates the addresses of the programs to be added, facilitating bulk updates to the
 * set of programs linked to another entity.
 */
export declare class LinkedProgramsExtend {
    private items;
    /**
     * Constructs a new LinkedProgramsExtend instance.
     *
     * @param {Address[]} items - An array of addresses of the programs to be linked.
     */
    constructor(items: Address[]);
    /**
     * Converts the linked programs extension to a JSON object for serialization and storage. This method
     * ensures that the operation is formatted in a structure suitable for transmission or storage, clearly
     * conveying the programs to be added.
     *
     * @returns {object} The JSON representation of the linked programs extension, including the addresses of the programs.
     */
    toJson(): object;
}
/**
 * Represents a removal operation for linked programs within LASR,
 * specifying a single program to be unlinked. This class encapsulates the address of the program to be removed,
 * facilitating updates to the set of programs linked to another entity, such as a token or an account, by
 * indicating which program should be detached.
 */
export declare class LinkedProgramsRemove {
    private key;
    /**
     * Constructs a new LinkedProgramsRemove instance.
     *
     * @param {Address} key - The address of the program to be unlinked.
     */
    constructor(key: Address);
    /**
     * Converts the linked program removal to a JSON object for serialization and storage. This method ensures
     * that the operation is formatted in a structure suitable for transmission or storage, clearly conveying the
     * program to be removed.
     *
     * @returns {object} The JSON representation of the linked program removal, including the program address to be removed.
     */
    toJson(): object;
}
/**
 * Represents a value class for handling linked programs operations in LASR, encapsulating different operations
 * such as insert, extend, or remove. This class provides a unified interface for working with linked programs,
 * allowing for clear and structured representation of operations that modify the linkage of programs within LASR.
 */
export declare class LinkedProgramsValue {
    private value;
    /**
     * Constructs a new LinkedProgramsValue instance.
     *
     * @param {LinkedProgramsInsert | LinkedProgramsExtend | LinkedProgramsRemove} value - The specific operation to be applied to linked programs.
     */
    constructor(value: LinkedProgramsInsert | LinkedProgramsExtend | LinkedProgramsRemove);
    /**
     * Converts the linked programs value to a JSON object for serialization and storage. This method formats
     * the encapsulated operation in a structure suitable for transmission or storage, ensuring the operation
     * is represented in a comprehensible and accessible manner.
     *
     * @returns {object} The JSON representation of the linked programs operation, including the specific action
     *                   and its details.
     */
    toJson(): object;
}
/**
 * Represents an operation to insert a new key-value pair into the metadata of a program on the LASR platform.
 * This class encapsulates both the key and value of the metadata to be inserted, facilitating updates to the
 * program's metadata with new information.
 */
export declare class ProgramMetadataInsert {
    private key;
    private value;
    /**
     * Constructs a new ProgramMetadataInsert instance.
     *
     * @param {string} key - The key of the metadata entry to be inserted.
     * @param {string} value - The value associated with the key in the metadata entry.
     */
    constructor(key: string, value: string);
    /**
     * Converts the metadata insertion operation to a JSON object for serialization and storage. This method
     * ensures that the operation is formatted in a structure suitable for transmission or storage, clearly
     * conveying the key-value pair to be inserted into the program's metadata.
     *
     * @returns {object} The JSON representation of the metadata insertion operation, including the key and value.
     */
    toJson(): object;
}
/**
 * Represents an operation to extend a program's metadata with multiple entries on the LASR platform.
 * This class allows for the bulk addition of metadata entries, specified as a map of key-value pairs.
 */
export declare class ProgramMetadataExtend {
    private map;
    /**
     * Constructs a new ProgramMetadataExtend instance.
     *
     * @param {Record<string, string>} map - A map of key-value pairs to be added to the program's metadata.
     */
    constructor(map: Record<string, string>);
    /**
     * Converts the program metadata extension operation to a JSON object for serialization and storage.
     * This method formats the bulk addition of metadata entries in a structure suitable for transmission
     * or storage, detailing each key-value pair to be added.
     *
     * @returns {object} The JSON representation of the metadata extension operation, including the map of key-value pairs.
     */
    toJson(): object;
}
/**
 * Represents an operation to remove a specific metadata entry from a program on the LASR platform. This class
 * encapsulates the key of the metadata entry to be removed, allowing for precise modification of a program's metadata.
 */
export declare class ProgramMetadataRemove {
    private key;
    /**
     * Constructs a new ProgramMetadataRemove instance.
     *
     * @param {string} key - The key of the metadata entry to be removed from the program's metadata.
     */
    constructor(key: string);
    /**
     * Converts the program metadata removal operation to a JSON object for serialization and storage.
     * This method ensures that the operation is formatted in a structure suitable for transmission or
     * storage, clearly conveying the key of the metadata entry to be removed.
     *
     * @returns {object} The JSON representation of the metadata removal operation, including the key of the entry to be removed.
     */
    toJson(): object;
}
/**
 * Encapsulates a value modification operation within program metadata on the LASR platform. This class serves as a
 * wrapper for various types of metadata update actions, such as inserting a new key-value pair, extending the metadata
 * with multiple entries, or removing an existing entry.
 */
export declare class ProgramMetadataValue {
    private value;
    /**
     * Constructs a new ProgramMetadataValue instance, which can hold any one of the specific metadata
     * update operations: insert, extend, or remove.
     *
     * @param {ProgramMetadataInsert | ProgramMetadataExtend | ProgramMetadataRemove} value - The specific metadata update operation to be encapsulated.
     */
    constructor(value: ProgramMetadataInsert | ProgramMetadataExtend | ProgramMetadataRemove);
    /**
     * Converts the encapsulated program metadata update operation to a JSON object for serialization and storage.
     * This method formats the update action in a structure suitable for transmission or storage, detailing the
     * nature of the update to the program's metadata.
     *
     * @returns {object} The JSON representation of the program metadata update operation, encapsulating the specific action and its details.
     */
    toJson(): object;
}
/**
 * Represents an operation to insert a single data entry into a program on the LASR platform. This class
 * encapsulates a key-value pair, enabling the specification of new data to be added to a program's existing data set.
 */
export declare class ProgramDataInsert {
    private key;
    private value;
    /**
     * Constructs a new ProgramDataInsert instance.
     *
     * @param {string} key - The key for the data entry to be inserted.
     * @param {string} value - The value associated with the key to be inserted.
     */
    constructor(key: string, value: string);
    /**
     * Converts the program data insert operation to a JSON object for serialization and storage.
     * This method ensures that the operation is formatted in a structure suitable for transmission or
     * storage, clearly conveying the key-value pair to be inserted into the program's data set.
     *
     * @returns {object} The JSON representation of the data insert operation, including the key-value pair.
     */
    toJson(): object;
}
/**
 * Represents an operation to extend a program's data with multiple entries on the LASR platform.
 * This class allows for the bulk addition of data entries, specified as a map of key-value pairs,
 * facilitating comprehensive updates to a program's data set.
 */
export declare class ProgramDataExtend {
    private map;
    /**
     * Constructs a new ProgramDataExtend instance.
     *
     * @param {Record<string, string>} map - A map of key-value pairs to be added to the program's data set.
     */
    constructor(map: Record<string, string>);
    /**
     * Converts the program data extension operation to a JSON object for serialization and storage.
     * This method formats the bulk addition of data entries in a structure suitable for transmission
     * or storage, detailing each key-value pair to be added.
     *
     * @returns {object} The JSON representation of the data extension operation, including the map of key-value pairs.
     */
    toJson(): object;
}
/**
 * Represents an operation to remove a specific data entry from a program on the LASR platform. This class encapsulates the key of the data entry to be removed, allowing for precise modifications of a program's data set.
 */
export declare class ProgramDataRemove {
    private key;
    /**
     * Constructs a new ProgramDataRemove instance.
     *
     * @param {string} key - The key of the data entry to be removed from the program's data set.
     */
    constructor(key: string);
    /**
     * Converts the program data removal operation to a JSON object for serialization and storage. This method ensures that the operation is formatted in a structure suitable for transmission or storage, clearly conveying the key of the data entry to be removed.
     *
     * @returns {object} The JSON representation of the data removal operation, including the key of the entry to be removed.
     */
    toJson(): object;
}
/**
 * Represents a container for a program data update operation on the LASR platform, encapsulating a specific
 * action (insert, extend, or remove) to be performed on the program's data. This class serves as a wrapper
 * around the various types of data operations, enabling them to be treated uniformly when constructing updates.
 */
export declare class ProgramDataValue {
    private value;
    /**
     * Constructs a new ProgramDataValue instance, holding an operation that modifies program data.
     *
     * @param {ProgramDataInsert | ProgramDataExtend | ProgramDataRemove} value - The specific data operation to be performed, which can be an insertion, extension, or removal of data.
     */
    constructor(value: ProgramDataInsert | ProgramDataExtend | ProgramDataRemove);
    /**
     * Converts the program data value and its encapsulated operation to a JSON object for serialization and storage.
     * This method ensures that the operation is formatted in a structure suitable for transmission or storage,
     * clearly conveying the intended modification to the program's data.
     *
     * @returns {object} The JSON representation of the program data value, including the specific operation to be performed.
     */
    toJson(): object;
}
export declare class ProgramAccountDataExtend {
    private map;
    constructor(map: Record<string, string>);
    toJson(): object;
}
export declare class ProgramFieldValue {
    private kind;
    private value;
    constructor(kind: string, value: ProgramDataValue | ProgramDataInsert | ProgramDataExtend | ProgramDataRemove | ProgramMetadataValue | ProgramMetadataInsert | ProgramMetadataExtend | ProgramMetadataRemove | LinkedProgramsValue | LinkedProgramsInsert | LinkedProgramsExtend | LinkedProgramsRemove | StatusValue);
    toJson(): object;
}
