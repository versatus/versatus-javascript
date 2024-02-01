/**
 * Class representing a Contract with methods to manage and execute contract strategies.
 */
export class Contract {
    /**
     * Constructs a new Contract instance.
     */
    constructor() {
        this.methodStrategies = {};
    }
    /**
     * Initiates the execution of a contract method based on the provided input.
     * @returns The result of executing the contract method.
     * @param inputs
     */
    start(inputs) {
        return this.executeMethod(inputs);
    }
    /**
     * Executes a contract method strategy based on the given input.
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
}
