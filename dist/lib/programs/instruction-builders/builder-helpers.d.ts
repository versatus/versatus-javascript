import { TokenDistribution, TokenOrProgramUpdate, TokenUpdateField } from '../../../lib/programs/Token';
import { ProgramFieldValues, TokenFieldValues } from '../../../lib/types';
import { ProgramUpdateField } from '../../../lib/programs/Program';
export declare function buildBurnInstruction({ from, caller, programId, tokenAddress, amount, }: {
    from: string;
    caller: string;
    programId: string;
    tokenAddress: string;
    amount: string;
}): import("..").Instruction;
export declare function buildCreateInstruction({ programId, initializedSupply, totalSupply, programOwner, programNamespace, distributionInstruction, }: {
    programId: string;
    from: string;
    initializedSupply?: string;
    totalSupply?: string;
    programOwner: string;
    programNamespace: string;
    distributionInstruction?: TokenDistribution;
}): import("..").Instruction;
export declare function buildUpdateInstruction({ update, }: {
    update: TokenOrProgramUpdate;
}): import("..").Instruction;
export declare function buildTokenDistributionInstruction({ programId, initializedSupply, to, tokenUpdates, }: {
    programId: string;
    initializedSupply: string;
    to: string;
    tokenUpdates?: TokenUpdateField[];
}): TokenDistribution;
export declare function buildMintInstructions({ from, programId, paymentTokenAddress, inputValue, returnedValue, }: {
    from: string;
    programId: string;
    paymentTokenAddress: string;
    inputValue: BigInt;
    returnedValue: BigInt;
}): import("..").Instruction[];
export declare function buildTransferInstruction({ from, to, tokenAddress, amount, tokenIds, }: {
    from: string;
    to: string;
    tokenAddress: string;
    amount: BigInt;
    tokenIds?: string[];
}): import("..").Instruction;
export declare function buildTokenUpdateField({ field, value, action, }: {
    field: TokenFieldValues;
    value: string;
    action: 'insert' | 'extend' | 'remove';
}): TokenUpdateField | Error;
export declare function buildProgramUpdateField({ field, value, action, }: {
    field: ProgramFieldValues;
    value: string;
    action: 'insert' | 'extend' | 'remove';
}): ProgramUpdateField | Error;
export declare function buildTokenMetadataUpdateInstruction({ transactionInputs, }: {
    transactionInputs: string;
}): TokenUpdateField[];
export declare function buildProgramMetadataUpdateInstruction({ transactionInputs, }: {
    transactionInputs: string;
}): import("..").Instruction;
