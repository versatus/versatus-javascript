"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC20Contract = void 0;
var Contract_1 = require("./Contract");
var ERC20Contract = /** @class */ (function (_super) {
    __extends(ERC20Contract, _super);
    function ERC20Contract(name, symbol, decimals, totalSupply) {
        var _this = _super.call(this) || this;
        _this.CONTRACT_NAME = name;
        _this.CONTRACT_SYMBOL = symbol;
        _this.CONTRACT_DECIMALS = decimals;
        _this.CONTRACT_TOTAL_SUPPLY = totalSupply;
        // @ts-ignore
        _this.balances = {
            '0x1': totalSupply,
            '0x2': 0,
            '0x3': 0,
            '0x4': 0,
            '0x5': 0,
            '0x6': 0,
            '0x7': 0,
            '0x8': 0,
            '0x9': 0,
            '0xa': 0,
        };
        // @ts-ignore
        _this.allowances = {
            '0x1': {
                '0x2': 2000,
                '0x3': 0,
                '0x4': 0,
                '0x5': 0,
                '0x6': 0,
                '0x7': 0,
                '0x8': 0,
                '0x9': 0,
                '0xa': 0,
            },
        };
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
    ERC20Contract.prototype.symbol = function (_test, _test2) {
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
        var _a;
        var _b = contractInput.functionInputs.erc20, owner = _b.owner, spender = _b.spender;
        // @ts-ignore
        return { allowance: (_a = this.allowances[owner][spender]) !== null && _a !== void 0 ? _a : 0, success: true };
    };
    ERC20Contract.prototype.approve = function (accountInfo, contractInput) {
        var _a = contractInput.functionInputs.erc20, owner = _a.owner, spender = _a.spender, amount = _a.amount;
        // @ts-ignore
        if (this.balances[owner] < amount)
            return { success: false };
        // @ts-ignore
        this.allowances[owner] = this.allowances[owner] || {};
        // @ts-ignore
        this.allowances[owner][spender] = amount;
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
        // @ts-ignore
        this.balances[accountAddress] = accountBalanceBigInt.toString();
        // @ts-ignore
        this.balances[address] = (
        // @ts-ignore
        BigInt((_a = this.balances[address]) !== null && _a !== void 0 ? _a : '0') + valueBigInt).toString();
        return { success: true };
    };
    return ERC20Contract;
}(Contract_1.Contract));
exports.ERC20Contract = ERC20Contract;
