/**
 * Represents the input data structure for a contract.
 * @typedef {Object} ContractInput
 * @property {number} version - The version number of the contract.
 * @property {AccountInfo} accountInfo - Information related to the account associated with the contract.
 * @property {string} function - The specific function to be executed in the contract.
 * @property {Inputs} inputs - A record of inputs required for the contract function execution.
 */
export interface ContractInput {
    version: number;
    accountInfo: AccountInfo;
    programFunction: string;
    programInputs: Inputs;
}
/**
 * Contains detailed information about the account associated with a contract.
 * @typedef {Object} AccountInfo
 * @property {string} programNamespace - The namespace of the program associated with this account.
 * @property {LinkedPrograms} linkedPrograms - A collection of programs linked to this account, indexed by a key.
 * @property {string} data - Additional data related to the account, potentially in a serialized format.
 */
export interface AccountInfo {
    programNamespace: string;
    linkedPrograms: LinkedPrograms;
    data: string;
}
/**
 * Represents a collection of linked programs associated with an account.
 * @typedef {Object} LinkedPrograms
 * @property {LinkedProgram} key - An index signature, where each key is a string that maps to a `LinkedProgram`.
 */
export interface LinkedPrograms {
    [key: string]: LinkedProgram;
}
/**
 * Defines a linked program in a generic format.
 * @typedef {Record<string, any>} LinkedProgram - A generic object representing a linked program, with string keys and values of any type.
 */
export type LinkedProgram = Record<string, any>;
/**
 * Represents a generic record of inputs, where keys are strings and values can be of any type.
 * @typedef {Record<string, any>} Inputs
 */
export type Inputs = Record<string, any>;
