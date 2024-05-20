import { TNetwork } from './types';
import { IAccount, IInitTransaction, ITransaction } from '../lib/interfaces';
/**
 * Asynchronously sends a blockchain transaction using the specified call transaction data and a private key.
 * The function initializes a wallet with the provided private key, retrieves the account information,
 * updates the transaction nonce, signs the transaction, and finally sends it to a blockchain network
 * via an RPC call.
 *
 * @param {IInitTransaction} callTx - The initial transaction data, including details such as the transaction type and nonce.
 * @param {string} privateKey - The private key used to sign the transaction and derive the wallet address.
 * @param {string} network - The network to make the call on (stable | test)
 * @returns {Promise<string | Error>} The result of the blockchain call, which could be a transaction hash or an error.
 * @throws {Error} Throws an error if account retrieval, transaction signing, or the RPC call fails.
 */
export declare function broadcast(callTx: IInitTransaction, privateKey: string, network?: TNetwork): Promise<string>;
/**
 * Makes an asynchronous call to a specified RPC method with the given parameters and RPC URL.
 * This generic function is designed to handle various LASR RPC calls by specifying the method name,
 * parameters, and the target RPC URL.
 *
 * @param {string} method - The RPC method name to be called.
 * @param {string[] | Record<string, unknown> | ITransaction[]} params - The parameters to be passed to the RPC method.
 * @param {string} rpcUrl - The URL of the RPC endpoint to which the call is made.
 * @returns {Promise<string | Error>} The result of the RPC call, typically a response object or an error.
 * @throws {Error} Throws an error if the RPC call fails or if the server returns an error response.
 */
export declare function callLasrRpc(method: string, params: string[] | Record<string, unknown> | ITransaction[], rpcUrl: string): Promise<string>;
/**
 * Asynchronously retrieves account information for a given address from a blockchain network via an RPC call.
 *
 * @param {string} address - The blockchain address of the account to retrieve.
 * @param {string} network - Which network to get an account from (stable | test)
 * @returns {Promise<IAccount | Error>} An object containing account information or an error if the retrieval fails.
 * @throws {Error} Throws an error if the account information cannot be retrieved.
 */
export declare function getAccount(address: string, network?: TNetwork): Promise<IAccount>;
/**
 * Reorders the keys of an initial transaction object according to a predefined order.
 * This function is useful for ensuring that transaction objects have a consistent format, especially before signing.
 *
 * @param {IInitTransaction} initTransaction - The initial transaction object to reorder.
 * @returns {IInitTransaction} A new transaction object with keys ordered as specified.
 * @throws {Error} Throws an error if reordering fails.
 */
export declare function reorderTransactionKeys(initTransaction: IInitTransaction): IInitTransaction;
/**
 * Calculates and formats a new nonce based on the given nonce string.
 * If the provided nonce is undefined, it returns the formatted version of 0.
 * This function is typically used to increment the nonce for a new transaction.
 *
 * @param {string | undefined} nonce - The current nonce of an account or transaction, or undefined if not available.
 * @returns {string | Error} The new nonce, incremented and formatted as a hexadecimal string, or an error if the operation fails.
 * @throws {Error} Throws an error if nonce calculation or formatting fails.
 */
export declare function getNewNonce(nonce: string | undefined): string;
