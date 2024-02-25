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
/**
 * Asynchronously sends a blockchain transaction using the specified call transaction data and a private key.
 * The function initializes a wallet with the provided private key, retrieves the account information,
 * updates the transaction nonce, signs the transaction, and finally sends it to a blockchain network
 * via an RPC call.
 *
 * @param {InitTransaction} callTx - The initial transaction data, including details such as the transaction type and nonce.
 * @param {string} privateKey - The private key used to sign the transaction and derive the wallet address.
 * @returns {Promise<string | Error>} The result of the blockchain call, which could be a transaction hash or an error.
 * @throws {Error} Throws an error if account retrieval, transaction signing, or the RPC call fails.
 */
export declare function broadcast(callTx: InitTransaction, privateKey: string): Promise<string | Error>;
/**
 * Makes an asynchronous call to a specified RPC method with the given parameters and RPC URL.
 * This generic function is designed to handle various LASR RPC calls by specifying the method name,
 * parameters, and the target RPC URL.
 *
 * @param {string} method - The RPC method name to be called.
 * @param {string[] | Record<string, unknown> | Transaction[]} params - The parameters to be passed to the RPC method.
 * @param {string} rpc - The URL of the RPC endpoint to which the call is made.
 * @returns {Promise<string | Error>} The result of the RPC call, typically a response object or an error.
 * @throws {Error} Throws an error if the RPC call fails or if the server returns an error response.
 */
export declare function callLasrRpc(method: string, params: string[] | Record<string, unknown> | Transaction[], rpc: string): Promise<string | Error>;
/**
 * Asynchronously retrieves account information for a given address from a blockchain network via an RPC call.
 *
 * @param {string} address - The blockchain address of the account to retrieve.
 * @returns {Promise<Account | Error>} An object containing account information or an error if the retrieval fails.
 * @throws {Error} Throws an error if the account information cannot be retrieved.
 */
export declare function getAccount(address: string): Promise<Account | Error>;
/**
 * Formats a given number string into a hexadecimal string representation, ensuring it starts with '0x' and is 64 characters long.
 *
 * @param {string} numberString - The number string to format.
 * @returns {string} The formatted hexadecimal string with '0x' prefix and a total length of 66 characters, or an empty string if formatting fails.
 */
export declare function formatVerse(numberString: string): string;
/**
 * Reorders the keys of an initial transaction object according to a predefined order.
 * This function is useful for ensuring that transaction objects have a consistent format, especially before signing.
 *
 * @param {InitTransaction} initTransaction - The initial transaction object to reorder.
 * @returns {InitTransaction} A new transaction object with keys ordered as specified.
 * @throws {Error} Throws an error if reordering fails.
 */
export declare function reorderTransactionKeys(initTransaction: InitTransaction): InitTransaction;
/**
 * Calculates and formats a new nonce based on the given nonce string.
 * If the provided nonce is undefined, it returns the formatted version of 0.
 * This function is typically used to increment the nonce for a new transaction.
 *
 * @param {string | undefined} nonce - The current nonce of an account or transaction, or undefined if not available.
 * @returns {string | Error} The new nonce, incremented and formatted as a hexadecimal string, or an error if the operation fails.
 * @throws {Error} Throws an error if nonce calculation or formatting fails.
 */
export declare function getNewNonce(nonce: string | undefined): string | Error;
