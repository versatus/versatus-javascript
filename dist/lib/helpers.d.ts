import { InitTransaction, Inputs, Transaction } from './types';
export declare function bigIntToHexString(bigintValue: BigInt): string;
export declare function buildInitTransaction(inputs: string, from: string, nonce: string, op: string, programId: string, value?: number): InitTransaction;
export declare function buildInputs({ accountInfo, inputs, op, transaction, }: {
    accountInfo?: any;
    inputs: string;
    op: string;
    transaction: Transaction;
}): Inputs;
