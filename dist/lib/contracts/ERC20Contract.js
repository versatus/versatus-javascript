var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Contract } from './Contract.js.js';
var ERC20Contract = /** @class */ (function (_super) {
    __extends(ERC20Contract, _super);
    function ERC20Contract(name, symbol, decimals, totalSupply) {
        var _this = _super.call(this) || this;
        _this.CONTRACT_NAME = name;
        _this.CONTRACT_SYMBOL = symbol;
        _this.CONTRACT_DECIMALS = decimals;
        _this.CONTRACT_TOTAL_SUPPLY = totalSupply;
        // Initialize method strategies
        _this.methodStrategies = {
            name: _this.name.bind(_this),
            symbol: _this.symbol.bind(_this),
            decimals: _this.decimals.bind(_this),
            totalSupply: _this.totalSupply.bind(_this),
            balanceOf: _this.balanceOf.bind(_this),
            allowance: _this.allowance.bind(_this),
            approve: _this.approve.bind(_this),
            transfer: _this.transfer.bind(_this),
        };
        return _this;
    }
    // Method implementations
    ERC20Contract.prototype.name = function () {
        return { name: this.CONTRACT_NAME, success: true };
    };
    ERC20Contract.prototype.symbol = function () {
        return { symbol: this.CONTRACT_SYMBOL, success: true };
    };
    ERC20Contract.prototype.decimals = function () {
        return { decimals: this.CONTRACT_DECIMALS, success: true };
    };
    ERC20Contract.prototype.totalSupply = function () {
        return { totalSupply: this.CONTRACT_TOTAL_SUPPLY, success: true };
    };
    ERC20Contract.prototype.balanceOf = function (accountInfo, contractInput) {
        var value = contractInput.functionInputs.erc20.balanceOf.value;
        return { balance: value !== null && value !== void 0 ? value : 0, success: true };
    };
    ERC20Contract.prototype.allowance = function (accountInfo, contractInput) {
        var _a, _b;
        var _c = contractInput.functionInputs.erc20, owner = _c.owner, spender = _c.spender;
        return { allowance: (_b = (_a = contractInput.allowances[owner]) === null || _a === void 0 ? void 0 : _a[spender]) !== null && _b !== void 0 ? _b : 0, success: true };
    };
    ERC20Contract.prototype.approve = function (accountInfo, contractInput) {
        var _a = contractInput.functionInputs.erc20, owner = _a.owner, spender = _a.spender, amount = _a.amount;
        if (this.balanceOf(accountInfo, { functionInputs: { erc20: { balanceOf: { value: owner } } } }).balance < amount)
            return { success: false };
        contractInput.allowances[owner] = contractInput.allowances[owner] || {};
        contractInput.allowances[owner][spender] = amount;
        return { success: true };
    };
    ERC20Contract.prototype.transfer = function (accountInfo, contractInput) {
        var _a;
        var accountAddress = accountInfo.accountAddress, accountBalance = accountInfo.accountBalance;
        var _b = contractInput.functionInputs.erc20.transfer, value = _b.value, address = _b.address;
        var accountBalanceBigInt = BigInt(accountBalance);
        var valueBigInt = BigInt(value);
        if (accountBalanceBigInt < valueBigInt)
            return { success: false };
        accountBalanceBigInt -= valueBigInt;
        contractInput.balances[accountAddress] = accountBalanceBigInt.toString();
        contractInput.balances[address] = (BigInt((_a = contractInput.balances[address]) !== null && _a !== void 0 ? _a : '0') + valueBigInt).toString();
        return { success: true };
    };
    return ERC20Contract;
}(Contract));
export { ERC20Contract };
