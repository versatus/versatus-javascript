import { TokenDistribution, TokenUpdateField } from './classes/Token';
import { TokenFieldValues } from './types';
export declare function bigIntToHexString(bigintValue: BigInt): string;
export declare function buildBurnInstruction({ from, caller, programId, tokenAddress, amount, }: {
    from: string;
    caller: string;
    programId: string;
    tokenAddress: string;
    amount: string;
}): import("./classes").Instruction;
export declare function buildCreateInstruction({ programId, initializedSupply, totalSupply, programOwner, programNamespace, distributionInstruction, }: {
    programId: string;
    from: string;
    initializedSupply: string;
    totalSupply: string;
    programOwner: string;
    programNamespace: string;
    distributionInstruction?: TokenDistribution;
}): import("./classes").Instruction;
export declare function buildTokenDistributionInstruction({ programId, initializedSupply, caller, tokenUpdates, }: {
    programId: string;
    initializedSupply: string;
    caller: string;
    tokenUpdates: TokenUpdateField[];
}): TokenDistribution;
export declare function buildMintInstructions({ from, programId, paymentTokenAddress, paymentValue, returnedValue, }: {
    from: string;
    programId: string;
    paymentTokenAddress: string;
    paymentValue: BigInt;
    returnedValue: BigInt;
}): import("./classes").Instruction[];
export declare function buildTransferInstruction({ from, to, tokenAddress, amount, }: {
    from: string;
    to: string;
    tokenAddress: string;
    amount: BigInt;
}): import("./classes").Instruction;
export declare function buildTokenUpdateField({ field, value, action, }: {
    field: TokenFieldValues;
    value: string;
    action: 'extend' | 'insert' | 'remove';
}): TokenUpdateField | Error;
