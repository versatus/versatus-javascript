import { ComputeInputs } from '../../lib/types';
import { Address, AddressOrNamespace } from '../../lib/programs/Address-Namespace';
import { StatusValue } from '../../lib/programs/Token';
/**
 * Class representing a Program with methods to manage and execute program strategies.
 */
export declare class Program {
    /**
     * A dictionary mapping method names to their corresponding strategy functions.
     * @type {{ [key: string]: Function }}
     */
    methodStrategies: {
        [key: string]: Function;
    };
    /**
     * Constructs a new Program instance.
     */
    constructor();
    create(computeInputs: ComputeInputs): object;
    /**
     * Executes a program method strategy based on the given input.
     * @throws Will throw an error if the method name specified in `input` is not found in `methodStrategies`.
     * @returns The result of the strategy execution.
     * @param inputs
     */
    executeMethod(inputs: ComputeInputs): any;
    /**
     * Initiates the execution of a program method based on the provided input.
     * @returns The result of executing the program method.
     * @param computeInputs
     */
    start(computeInputs: ComputeInputs): any;
    /**
     * Updates the program with the provided inputs.
     * @returns The result of updating the program.
     * @param computeInputs
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
