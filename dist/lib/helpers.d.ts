import { InitTransaction, ComputeInputs } from './types';
export declare function bigIntToHexString(bigintValue: BigInt): string;
export declare function buildInitTransaction(transactionInputs: string, to: string, from: string, nonce: string, op: string, programId: string, value?: number): InitTransaction;
export declare function buildComputeInputs({ accountInfo, contractInputs, op, initTransaction, r, s, v, }: {
    accountInfo?: any;
    contractInputs: string;
    op: string;
    initTransaction: InitTransaction;
    r: string;
    s: string;
    v: number;
}): ComputeInputs;
