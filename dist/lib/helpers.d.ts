import { InitTransaction, Inputs } from './types';
export declare function bigIntToHexString(bigintValue: BigInt): string;
export declare function buildInitTransaction(inputs: string, to: string, from: string, nonce: string, op: string, programId: string, value?: number): InitTransaction;
export declare function buildContractInput({ accountInfo, inputs, op, initTransaction, r, s, v, }: {
    accountInfo?: any;
    inputs: string;
    op: string;
    initTransaction: InitTransaction;
    r: string;
    s: string;
    v: number;
}): Inputs;
