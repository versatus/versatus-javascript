import { ComputeInputs } from '../../types';
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
     * @returns The result of executing the contract method.
     * @param inputs
     */
    start(inputs: ComputeInputs): any;
    /**
     * Executes a contract method strategy based on the given input.
     * @throws Will throw an error if the method name specified in `input` is not found in `methodStrategies`.
     * @returns The result of the strategy execution.
     * @param inputs
     */
    executeMethod(inputs: ComputeInputs): any;
}
