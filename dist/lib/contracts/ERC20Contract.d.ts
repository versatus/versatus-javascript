import { Contract } from './Contract';
export declare class ERC20Contract extends Contract {
    CONTRACT_NAME: string;
    CONTRACT_SYMBOL: string;
    CONTRACT_DECIMALS: number;
    CONTRACT_TOTAL_SUPPLY: number;
    constructor(name: string, symbol: string, decimals: number, totalSupply: number);
    name(): {
        name: string;
        success: boolean;
    };
    symbol(_test: any, _test2: any): {
        symbol: string;
        success: boolean;
    };
    decimals(): {
        decimals: number;
        success: boolean;
    };
    totalSupply(): {
        totalSupply: number;
        success: boolean;
    };
    balanceOf(accountInfo: any, contractInput: any): {
        balance: any;
        success: boolean;
    };
    allowance(accountInfo: any, contractInput: any): {
        allowance: any;
        success: boolean;
    };
    approve(accountInfo: any, contractInput: any): {
        success: boolean;
    };
    transfer(accountInfo: any, contractInput: any): {
        success: boolean;
    };
}
