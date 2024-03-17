import { TokenDistribution, TokenOrProgramUpdate, TokenUpdateField } from '../../../lib/programs/Token';
import { ProgramFieldValues, TokenFieldValues } from '../../../lib/types';
import { ProgramUpdateField } from '../../../lib/programs/Program';
import { Address, Namespace } from '../../../lib/programs/Address-Namespace';
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
export declare function buildTokenDistributionInstruction({ programId, initializedSupply, to, tokenUpdates, nonFungible, }: {
    programId: string;
    initializedSupply: string;
    to: string;
    tokenUpdates?: TokenUpdateField[];
    nonFungible?: boolean;
}): TokenDistribution;
export declare function buildMintInstructions({ from, programId, paymentTokenAddress, inputValue, returnedTokenIds, returnedValue, }: {
    from: string;
    programId: string;
    paymentTokenAddress: string;
    inputValue: BigInt;
    returnedTokenIds?: string[];
    returnedValue?: BigInt;
}): import("..").Instruction[];
export declare function buildTransferInstruction({ from, to, tokenAddress, amount, tokenIds, }: {
    from: string;
    to: string;
    tokenAddress: string;
    amount?: BigInt;
    tokenIds?: string[];
}): import("..").Instruction;
export declare function buildTokenUpdateField({ field, value, action, }: {
    field: TokenFieldValues;
    value: string | Array<[Address, string]>;
    action: 'insert' | 'extend' | 'remove';
}): TokenUpdateField;
export declare function buildProgramUpdateField({ field, value, action, }: {
    field: ProgramFieldValues;
    value: string;
    action: 'insert' | 'extend' | 'remove';
}): ProgramUpdateField;
export declare function buildTokenMetadataUpdateInstruction({ accountAddress, tokenAddress, transactionInputs, }: {
    accountAddress: Address | Namespace | 'this';
    tokenAddress: Address | Namespace | 'this';
    transactionInputs: string;
}): import("..").Instruction;
export declare function buildProgramMetadataUpdateInstruction({ transactionInputs, }: {
    transactionInputs: string;
}): import("..").Instruction;
