var Contract = /** @class */ (function () {
    function Contract() {
        this.methodStrategies = {};
    }
    Contract.prototype.start = function (input) {
        return this.executeMethod(input);
    };
    Contract.prototype.executeMethod = function (input) {
        var accountInfo = input.accountInfo, fn = input.function, inputs = input.inputs;
        var strategy = this.methodStrategies[fn];
        if (strategy) {
            return strategy(accountInfo, inputs);
        }
        throw new Error("Unknown method: ".concat(fn));
    };
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
