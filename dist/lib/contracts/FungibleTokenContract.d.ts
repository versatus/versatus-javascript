import { Contract } from './Contract';
import { AccountInfo, Inputs } from '../types';
/**
 * Class representing a fungible token contract, extending the base `Contract` class.
 * It encapsulates the core functionality and properties of a fungible token.
 */
export declare class FungibleTokenContract extends Contract {
    /**
     * The name of the contract.
     * @type {string}
     */
    CONTRACT_NAME: string;
    /**
     * The symbol of the contract.
     * @type {string}
     */
    CONTRACT_SYMBOL: string;
    /**
     * The number of decimals for the token.
     * @type {number}
     */
    CONTRACT_DECIMALS: number;
    /**
     * The total supply of the token.
     * @type {number}
     */
    CONTRACT_TOTAL_SUPPLY: number;
    /**
     * Constructs a new instance of the FungibleTokenContract class.
     * @param {string} name - The name of the token.
     * @param {string} symbol - The symbol of the token.
     * @param {number} decimals - The number of decimals for the token.
     * @param {number} totalSupply - The total supply of the token.
     */
    constructor(name: string, symbol: string, decimals: number, totalSupply: number);
    /**
     * Retrieves the contract name.
     * @returns An object containing the contract name and a success flag.
     */
    name(): {
        name: string;
        success: boolean;
    };
    /**
     * Retrieves the contract symbol.
     * @returns An object containing the contract symbol and a success flag.
     */
    symbol(): {
        symbol: string;
        success: boolean;
    };
    /**
     * Retrieves the number of decimals for the token.
     * @returns An object containing the number of decimals and a success flag.
     */
    decimals(): {
        decimals: number;
        success: boolean;
    };
    /**
     * Retrieves the total supply of the token.
     * @returns An object containing the total supply and a success flag.
     */
    totalSupply(): {
        totalSupply: number;
        success: boolean;
    };
    /**
     * Retrieves the balance of a given account.
     * @param {AccountInfo} _ - Account information (unused in this context).
     * @param {Inputs} input - The input parameters, including balance and owner ID.
     * @returns An object containing the balance and a success flag.
     */
    balanceOf(_: AccountInfo, input: Inputs): {
        address: any;
        balance: any;
        success: boolean;
    };
    /**
     * Retrieves the allowance for a given spender.
     * @param {AccountInfo} _ - Account information (unused in this context).
     * @param {Inputs} input - The input parameters, including allowances and spender.
     * @returns An object containing the allowance and a success flag.
     */
    allowance(_: AccountInfo, input: Inputs): {
        error: string;
        success: boolean;
        address?: undefined;
        allowance?: undefined;
    } | {
        address: any;
        allowance: any;
        success: boolean;
        error?: undefined;
    };
    /**
     * Approves a spender to withdraw from an account up to a certain amount.
     * @param {AccountInfo} _ - Account information (unused in this context).
     * @param {Inputs} input - The input parameters, including spender, amount, and approvals.
     * @returns An object containing the updated approvals and a success flag.
     */
    approve(_: AccountInfo, input: Inputs): {
        error: string;
        success: boolean;
        approvals?: undefined;
    } | {
        approvals: any;
        success: boolean;
        error?: undefined;
    };
    /**
     * Transfers a specified amount of tokens to a specified recipient.
     * @param {AccountInfo} _ - Account information (unused in this context).
     * @param {Inputs} input - The input parameters, including amount, owner address, balance, recipient address, and recipient balance.
     * @returns An object containing the updated balances and a success flag.
     */
    transfer(_: AccountInfo, input: Inputs): {
        error: string;
        success: boolean;
        balances?: undefined;
    } | {
        balances: {
            [x: number]: any;
        };
        success: boolean;
        error?: undefined;
    };
}
