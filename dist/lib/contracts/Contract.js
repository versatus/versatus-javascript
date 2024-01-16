var Contract = /** @class */ (function () {
    function Contract() {
        this.methodStrategies = {};
    }
    Contract.prototype.start = function (input) {
        var accountInfo = input.accountInfo, contractInput = input.contractInput;
        return this.executeMethod(accountInfo, contractInput);
    };
    Contract.prototype.executeMethod = function (accountInfo, contractInput) {
        var contractFn = contractInput.contractFn;
        var strategy = this.methodStrategies[contractFn];
        if (strategy) {
            return strategy(accountInfo, contractInput);
        }
        throw new Error("Unknown method: ".concat(contractFn));
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
