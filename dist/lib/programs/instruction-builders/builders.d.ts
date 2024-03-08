import { TokenDistribution, TokenOrProgramUpdate, TokenUpdateField } from '../../../lib/programs/Token';
import { Instruction } from '../../../lib/programs/Instruction';
import { Outputs } from '../../../lib/programs/Outputs';
import { AddressOrNamespace, Address } from '../../../lib/programs/Address-Namespace';
export declare class TokenUpdateBuilder {
    private account;
    private token;
    private updates;
    constructor();
    addUpdateAccountAddress(account: AddressOrNamespace): TokenUpdateBuilder;
    addTokenAddress(tokenAddress: AddressOrNamespace): TokenUpdateBuilder;
    addUpdateField(updateField: TokenOrProgramUpdate): TokenUpdateBuilder;
    build(): Instruction;
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
    build(): Instruction;
}
export declare class UpdateInstructionBuilder {
    private updates;
    addUpdate(update: TokenOrProgramUpdate): UpdateInstructionBuilder;
    extendUpdates(items: TokenOrProgramUpdate[]): UpdateInstructionBuilder;
    build(): Instruction;
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
    addTokenIds(tokenIds: string[]): TransferInstructionBuilder;
    extendTokenIds(items: string[]): TransferInstructionBuilder;
    build(): Instruction;
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
    setAmount(amount: string): BurnInstructionBuilder;
    addTokenId(tokenId: string): BurnInstructionBuilder;
    extendTokenIds(items: string[]): BurnInstructionBuilder;
    build(): Instruction;
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
