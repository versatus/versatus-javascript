import { ContractInput } from '../../types';
/**
 * Class representing a Contract with methods to manage and execute contract strategies.
 */
export declare class Contract {
    /**
     * A dictionary mapping method names to their corresponding strategy functions.
     * @type {{ [key: string]: Function }}
     */
    methodStrategies: {
        [key: string]: Function;
    };
    /**
     * Constructs a new Contract instance.
     */
    constructor();
    /**
     * Initiates the execution of a contract method based on the provided input.
     * @param {ContractInput} input - The input data required to execute a contract method.
     * @returns The result of executing the contract method.
     */
    start(input: ContractInput): any;
    /**
     * Executes a contract method strategy based on the given input.
     * @param {ContractInput} input - The input data for the contract method, including account information and method-specific inputs.
     * @throws Will throw an error if the method name specified in `input` is not found in `methodStrategies`.
     * @returns The result of the strategy execution.
     */
    executeMethod(input: ContractInput): any;
    /**
     * Adds a new strategy function to `methodStrategies` or extends an existing one.
     * @param {string} methodName - The name of the method for which the strategy is defined.
     * @param {Function} newStrategyFn - The new strategy function to be added or used for extending.
     * @param {boolean} [extend=false] - Indicates whether the new strategy should extend an existing strategy (if any).
     * @description If `extend` is true and a strategy exists for `methodName`, the existing strategy is called first,
     *              and its result is passed to `newStrategyFn` along with the original parameters.
     */
    addOrExtendMethodStrategy(methodName: string, newStrategyFn: Function, extend?: boolean): void;
}
