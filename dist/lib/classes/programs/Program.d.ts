import { ComputeInputs } from '../../../lib/types';
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
