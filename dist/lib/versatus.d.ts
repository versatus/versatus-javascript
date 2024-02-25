import { Account, InitTransaction, Transaction } from './types';
/**
 * Parses the input for a contract from the standard input stream.
 * @returns {any} The parsed input object from the standard input.
 * @description
 * This function reads from the standard input, collecting data in chunks, and then parses the accumulated data as JSON.
 * It assumes the data is in a format that can be directly parsed into a JSON object.
 * Note: This function uses Javy.IO for I/O operations, which is assumed to be a part of the environment.
 */
export declare function parseContractInput(): any;
/**
 * Sends the provided output to the standard output stream.
 * @param {any} output - The output data to be sent.
 * @description
 * This function encodes the given output as a JSON string and writes it to the standard output.
 * It uses the TextEncoder to encode the string and Javy.IO for the I/O operation.
 * Note: This function assumes that Javy.IO is available in the environment for I/O operations.
 */
export declare function sendOutput(output: any): void;
export declare function sendCallTransaction(callTx: InitTransaction, privateKey: string): Promise<string | Error>;
export declare function callLasrRpc(method: string, params: string | string[] | Record<string, unknown> | Transaction[], rpc: string): Promise<string | Error>;
export declare function getAccount(address: string): Promise<Account | Error>;
export declare function formatVerse(numberString: string): string;
export declare function reorderTransactionKeys(initTransaction: InitTransaction): InitTransaction;
export declare function getNewNonce(nonce: string | undefined): string | Error;
