import { AddressOrNamespace, TokenOrProgramUpdate } from './utils';
import { TokenDistribution, TokenUpdate, TokenUpdateField } from './Token';
import { U256 } from './U256';
import Address from './Address';
import { BurnInstruction, CreateInstruction, Instruction, TransferInstruction, UpdateInstruction } from './Instruction';
import { Outputs } from './Outputs';
export declare class TokenUpdateBuilder {
    private account;
    private token;
    private updates;
    constructor();
    addUpdateAccountAddress(account: AddressOrNamespace): TokenUpdateBuilder;
    addTokenAddress(tokenAddress: AddressOrNamespace): TokenUpdateBuilder;
    addUpdateField(updateField: TokenUpdateField): TokenUpdateBuilder;
    build(): TokenUpdate;
}
export declare class TokenDistributionBuilder {
    private programId;
    private to;
    private amount;
    private tokenIds;
    private updateFields;
    constructor();
    setProgramId(programId: AddressOrNamespace): TokenDistributionBuilder;
    setReceiver(receiver: AddressOrNamespace): TokenDistributionBuilder;
    setAmount(amount: string): TokenDistributionBuilder;
    addTokenId(tokenId: string): TokenDistributionBuilder;
    addUpdateField(updateField: TokenUpdateField): TokenDistributionBuilder;
    extendTokenIds(items: string[]): TokenDistributionBuilder;
    extendUpdateFields(items: TokenUpdateField[]): TokenDistributionBuilder;
    build(): TokenDistribution;
}
export declare class CreateInstructionBuilder {
    private programNamespace;
    private programId;
    private programOwner;
    private totalSupply;
    private initializedSupply;
    private distribution;
    setProgramNamespace(programNamespace: AddressOrNamespace): CreateInstructionBuilder;
    setProgramId(programId: AddressOrNamespace): CreateInstructionBuilder;
    setProgramOwner(programOwner: Address): CreateInstructionBuilder;
    setTotalSupply(totalSupply: string): CreateInstructionBuilder;
    setInitializedSupply(initializedSupply: string): CreateInstructionBuilder;
    addTokenDistribution(tokenDistribution: TokenDistribution): CreateInstructionBuilder;
    extendTokenDistribution(items: TokenDistribution[]): CreateInstructionBuilder;
    build(): CreateInstruction;
}
export declare class UpdateInstructionBuilder {
    private updates;
    addUpdate(update: TokenOrProgramUpdate): UpdateInstructionBuilder;
    extendUpdates(items: TokenOrProgramUpdate[]): UpdateInstructionBuilder;
    build(): UpdateInstruction;
}
export declare class TransferInstructionBuilder {
    private token;
    private transferFrom;
    private transferTo;
    private amount;
    private ids;
    setTokenAddress(tokenAddress: Address): TransferInstructionBuilder;
    setTransferFrom(transferFrom: AddressOrNamespace): TransferInstructionBuilder;
    setTransferTo(transferTo: AddressOrNamespace): TransferInstructionBuilder;
    setAmount(amount: string | null): TransferInstructionBuilder;
    addTokenId(tokenId: string): TransferInstructionBuilder;
    extendTokenIds(items: string[]): TransferInstructionBuilder;
    build(): TransferInstruction;
}
export declare class BurnInstructionBuilder {
    private caller;
    private programId;
    private token;
    private burnFrom;
    private amount;
    private tokenIds;
    setCaller(caller: Address): BurnInstructionBuilder;
    setProgramId(programId: AddressOrNamespace): BurnInstructionBuilder;
    setTokenAddress(tokenAddress: Address): BurnInstructionBuilder;
    setBurnFromAddress(burnFromAddress: AddressOrNamespace): BurnInstructionBuilder;
    setAmount(amount: U256): BurnInstructionBuilder;
    addTokenId(tokenId: U256): BurnInstructionBuilder;
    extendTokenIds(items: U256[]): BurnInstructionBuilder;
    build(): BurnInstruction;
}
export declare class LogInstructionBuilder {
}
export declare class OutputBuilder {
    private inputs;
    private instructions;
    setInputs(inputs: any): OutputBuilder;
    addInstruction(instruction: Instruction): OutputBuilder;
    build(): Outputs;
}
