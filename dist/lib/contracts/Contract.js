/**
 * Class representing a Contract with methods to manage and execute contract strategies.
 */
var Contract = /** @class */ (function () {
    /**
     * Constructs a new Contract instance.
     */
    function Contract() {
        this.methodStrategies = {};
    }
    /**
     * Initiates the execution of a contract method based on the provided input.
     * @param {ContractInput} input - The input data required to execute a contract method.
     * @returns The result of executing the contract method.
     */
    Contract.prototype.start = function (input) {
        return this.executeMethod(input);
    };
    /**
     * Executes a contract method strategy based on the given input.
     * @param {ContractInput} input - The input data for the contract method, including account information and method-specific inputs.
     * @throws Will throw an error if the method name specified in `input` is not found in `methodStrategies`.
     * @returns The result of the strategy execution.
     */
    Contract.prototype.executeMethod = function (input) {
        var accountInfo = input.accountInfo, programFunction = input.programFunction, programInputs = input.programInputs;
        var strategy = this.methodStrategies[programFunction];
        if (strategy) {
            return strategy(accountInfo, programInputs);
        }
        throw new Error("Unknown method: ".concat(programFunction));
    };
    /**
     * Adds a new strategy function to `methodStrategies` or extends an existing one.
     * @param {string} methodName - The name of the method for which the strategy is defined.
     * @param {Function} newStrategyFn - The new strategy function to be added or used for extending.
     * @param {boolean} [extend=false] - Indicates whether the new strategy should extend an existing strategy (if any).
     * @description If `extend` is true and a strategy exists for `methodName`, the existing strategy is called first,
     *              and its result is passed to `newStrategyFn` along with the original parameters.
     */
    Contract.prototype.addOrExtendMethodStrategy = function (methodName, newStrategyFn, extend) {
        if (extend === void 0) { extend = false; }
        if (extend && this.methodStrategies[methodName]) {
            var originalStrategy_1 = this.methodStrategies[methodName];
            this.methodStrategies[methodName] = function (accountInfo, contractInput) {
                var originalResult = originalStrategy_1(accountInfo, contractInput);
                return newStrategyFn(accountInfo, contractInput, originalResult);
            };
        }
        else {
            this.methodStrategies[methodName] = newStrategyFn;
        }
    };
    return Contract;
}());
export { Contract };
