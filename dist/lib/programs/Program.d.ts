import { ComputeInputs } from '../../lib/types';
import { Address, AddressOrNamespace } from '../../lib/programs/Address-Namespace';
import { StatusValue } from '../../lib/programs/Token';
/**
 * Represents a program with strategies for handling various operations such as `create` and `update`.
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
    /**
     * Handles the `create` operation by processing the given computeInputs, validating and transforming them into a structured output.
     * This method performs a series of validations and transformations, constructs various instructions for token and program updates,
     * and ultimately returns a JSON representation of the operation results.
     *
     * @param {ComputeInputs} computeInputs - Inputs necessary for computing the create operation, including transaction details.
     * @returns {string} JSON string representing the outputs of the create operation.
     * @throws {Error} Throws an error if any validation fails or if an unexpected error occurs during the process.
     */
    create(computeInputs: ComputeInputs): object;
    /**
     * Executes the method corresponding to the operation specified in the input.
     * This method looks up the strategy for the operation in the `methodStrategies` map and executes it.
     *
     * @param {ComputeInputs} inputs - Inputs containing the operation to be executed along with any necessary data.
     * @returns {any} The result of executing the method associated with the specified operation.
     * @throws {Error} Throws an error if the operation is unknown or if the associated method throws an error.
     */
    executeMethod(inputs: ComputeInputs): any;
    /**
     * Starts the execution process by invoking `executeMethod` with the provided computeInputs.
     * This is a convenience method that serves as an entry point to execute a method based on the operation specified in the inputs.
     *
     * @param {ComputeInputs} computeInputs - Inputs necessary for executing a method, including the operation to be performed.
     * @returns {any} The result of executing the method associated with the specified operation.
     * @throws {Error} Throws an error if `executeMethod` throws an error.
     */
    start(computeInputs: ComputeInputs): any;
    /**
     * Handles the `update` operation by processing the given computeInputs, performing validations, and transforming them into structured output.
     * Similar to the `create` method, this method processes inputs related to program updates, constructs various update instructions,
     * and returns a JSON representation of the operation results.
     *
     * @param {ComputeInputs} computeInputs - Inputs necessary for computing the update operation, including transaction details.
     * @returns {string} JSON string representing the outputs of the update operation.
     * @throws {Error} Throws an error if any validation fails or if an unexpected error occurs during the process.
     */
    update(computeInputs: ComputeInputs): object;
}
export declare class ProgramUpdate {
    private account;
    private updates;
    constructor(account: AddressOrNamespace, updates: ProgramUpdateField[]);
    toJson(): object;
}
export declare class ProgramUpdateField {
    private field;
    private value;
    constructor(field: ProgramField, value: ProgramFieldValue);
    toJson(): object;
}
export declare class ProgramField {
    private value;
    constructor(value: string);
    toJson(): string;
}
export declare class LinkedProgramsInsert {
    private key;
    constructor(key: Address);
    toJson(): object;
}
export declare class LinkedProgramsExtend {
    private items;
    constructor(items: Address[]);
    toJson(): object;
}
export declare class LinkedProgramsRemove {
    private key;
    constructor(key: Address);
    toJson(): object;
}
export declare class LinkedProgramsValue {
    private value;
    constructor(value: LinkedProgramsInsert | LinkedProgramsExtend | LinkedProgramsRemove);
    toJson(): object;
}
export declare class ProgramMetadataInsert {
    private key;
    private value;
    constructor(key: string, value: string);
    toJson(): object;
}
export declare class ProgramMetadataExtend {
    private map;
    constructor(map: Record<string, string>);
    toJson(): object;
}
export declare class ProgramMetadataRemove {
    private key;
    constructor(key: string);
    toJson(): object;
}
export declare class ProgramMetadataValue {
    private value;
    constructor(value: ProgramMetadataInsert | ProgramMetadataExtend | ProgramMetadataRemove);
    toJson(): object;
}
export declare class ProgramDataInsert {
    private key;
    private value;
    constructor(key: string, value: string);
    toJson(): object;
}
export declare class ProgramDataExtend {
    private map;
    constructor(map: Record<string, string>);
    toJson(): object;
}
export declare class ProgramDataRemove {
    private key;
    constructor(key: string);
    toJson(): object;
}
export declare class ProgramDataValue {
    private value;
    constructor(value: ProgramDataInsert | ProgramDataExtend | ProgramDataRemove);
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
    constructor(kind: string, value: ProgramDataValue | ProgramDataInsert | ProgramDataExtend | ProgramDataRemove | ProgramMetadataValue | ProgramMetadataInsert | ProgramMetadataExtend | ProgramMetadataRemove | StatusValue);
    toJson(): object;
}
