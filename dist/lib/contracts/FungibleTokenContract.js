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
/**
 * Class representing a fungible token contract, extending the base `Contract` class.
 * It encapsulates the core functionality and properties of a fungible token.
 */
var FungibleTokenContract = /** @class */ (function (_super) {
    __extends(FungibleTokenContract, _super);
    /**
     * Constructs a new instance of the FungibleTokenContract class.
     * @param {string} name - The name of the token.
     * @param {string} symbol - The symbol of the token.
     * @param {number} decimals - The number of decimals for the token.
     * @param {number} totalSupply - The total supply of the token.
     */
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
    /**
     * Retrieves the contract name.
     * @returns An object containing the contract name and a success flag.
     */
    FungibleTokenContract.prototype.name = function () {
        return { name: this.CONTRACT_NAME, success: true };
    };
    /**
     * Retrieves the contract symbol.
     * @returns An object containing the contract symbol and a success flag.
     */
    FungibleTokenContract.prototype.symbol = function () {
        return { symbol: this.CONTRACT_SYMBOL, success: true };
    };
    /**
     * Retrieves the number of decimals for the token.
     * @returns An object containing the number of decimals and a success flag.
     */
    FungibleTokenContract.prototype.decimals = function () {
        return { decimals: this.CONTRACT_DECIMALS, success: true };
    };
    /**
     * Retrieves the total supply of the token.
     * @returns An object containing the total supply and a success flag.
     */
    FungibleTokenContract.prototype.totalSupply = function () {
        return { totalSupply: this.CONTRACT_TOTAL_SUPPLY, success: true };
    };
    /**
     * Retrieves the balance of a given account.
     * @param {AccountInfo} _ - Account information (unused in this context).
     * @param {Inputs} input - The input parameters, including balance and owner ID.
     * @returns An object containing the balance and a success flag.
     */
    FungibleTokenContract.prototype.balanceOf = function (_, input) {
        var balance = input.balance, ownerId = input.ownerId;
        return { address: ownerId, balance: balance !== null && balance !== void 0 ? balance : 0, success: true };
    };
    /**
     * Retrieves the allowance for a given spender.
     * @param {AccountInfo} _ - Account information (unused in this context).
     * @param {Inputs} input - The input parameters, including allowances and spender.
     * @returns An object containing the allowance and a success flag.
     */
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
    /**
     * Approves a spender to withdraw from an account up to a certain amount.
     * @param {AccountInfo} _ - Account information (unused in this context).
     * @param {Inputs} input - The input parameters, including spender, amount, and approvals.
     * @returns An object containing the updated approvals and a success flag.
     */
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
        approvals[spender] = String(BigInt(currentApproval) + BigInt(amount));
        return { approvals: approvals, success: true };
    };
    /**
     * Transfers a specified amount of tokens to a specified recipient.
     * @param {AccountInfo} _ - Account information (unused in this context).
     * @param {Inputs} input - The input parameters, including amount, owner address, balance, recipient address, and recipient balance.
     * @returns An object containing the updated balances and a success flag.
     */
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
        if (BigInt(balance) < BigInt(amount))
            return { error: 'insufficient funds', success: false };
        var balances = (_a = {},
            _a[ownerAddress] = balance,
            _a[recipientAddress] = recipientBalance,
            _a);
        balances[ownerAddress] = BigInt(BigInt(balance) - BigInt(amount)).toString();
        balances[recipientAddress] = BigInt(BigInt((_b = balances[recipientAddress]) !== null && _b !== void 0 ? _b : '0') + BigInt(amount)).toString();
        return { balances: balances, success: true };
    };
    return FungibleTokenContract;
}(Contract));
export { FungibleTokenContract };
