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
import { Contract } from './Contract.js';
var FungibleTokenContract = /** @class */ (function (_super) {
    __extends(FungibleTokenContract, _super);
    function FungibleTokenContract(name, symbol, decimals, totalSupply) {
        var _this = _super.call(this) || this;
        _this.CONTRACT_NAME = name;
        _this.CONTRACT_SYMBOL = symbol;
        _this.CONTRACT_DECIMALS = decimals;
        _this.CONTRACT_TOTAL_SUPPLY = totalSupply;
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
    FungibleTokenContract.prototype.name = function () {
        return { name: this.CONTRACT_NAME, success: true };
    };
    FungibleTokenContract.prototype.symbol = function () {
        return { symbol: this.CONTRACT_SYMBOL, success: true };
    };
    FungibleTokenContract.prototype.decimals = function () {
        return { decimals: this.CONTRACT_DECIMALS, success: true };
    };
    FungibleTokenContract.prototype.totalSupply = function () {
        return { totalSupply: this.CONTRACT_TOTAL_SUPPLY, success: true };
    };
    FungibleTokenContract.prototype.balanceOf = function (_, input) {
        var balance = input.balance, ownerId = input.ownerId;
        return { address: ownerId, balance: balance !== null && balance !== void 0 ? balance : 0, success: true };
    };
    FungibleTokenContract.prototype.allowance = function (_, input) {
        var _a;
        var allowances = input.allowances, spender = input.spender;
        if (!allowances)
            return { error: 'allowances not found', success: false };
        if (!spender)
            return { error: 'spender not found', success: false };
        return {
            address: spender,
            allowance: (_a = allowances[spender]) !== null && _a !== void 0 ? _a : 0,
            success: true,
        };
    };
    FungibleTokenContract.prototype.approve = function (_, input) {
        var _a;
        var spender = input.spender, amount = input.amount, approvals = input.approvals;
        if (!approvals)
            return { error: 'approvals not found', success: false };
        if (!spender)
            return { error: 'spender not found', success: false };
        if (!amount)
            return { error: 'amount not found', success: false };
        var currentApproval = (_a = approvals[spender]) !== null && _a !== void 0 ? _a : 0;
        approvals[spender] = 10 + 10;
        return { approvals: approvals, success: true };
    };
    FungibleTokenContract.prototype.transfer = function (_, input) {
        var _a;
        var _b;
        var amount = input.amount, ownerAddress = input.ownerAddress, balance = input.balance, recipientAddress = input.recipientAddress, recipientBalance = input.recipientBalance;
        if (!balance)
            return { error: 'balance not found', success: false };
        if (!recipientBalance)
            return { error: 'recipient balance not found', success: false };
        if (!amount)
            return { error: 'amount not found', success: false };
        if (!ownerAddress)
            return { error: 'owner address not found', success: false };
        if (!recipientAddress)
            return { error: 'recipient address not found', success: false };
        var accountBalanceBigInt = BigInt(balance);
        var valueBigInt = BigInt(amount);
        if (accountBalanceBigInt < valueBigInt)
            return { error: 'insufficient funds', success: false };
        var balances = (_a = {},
            _a[ownerAddress] = balance,
            _a[recipientAddress] = recipientBalance,
            _a);
        accountBalanceBigInt -= valueBigInt;
        balances[ownerAddress] = accountBalanceBigInt.toString();
        balances[recipientAddress] = (BigInt((_b = balances[recipientAddress]) !== null && _b !== void 0 ? _b : '0') + valueBigInt).toString();
        return { balances: balances, success: true };
    };
    return FungibleTokenContract;
}(Contract));
export { FungibleTokenContract };
