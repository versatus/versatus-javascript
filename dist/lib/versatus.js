import { Wallet, keccak256, toUtf8Bytes } from 'ethers';
import * as secp256k1 from '@noble/secp256k1';
import { RPC_URL } from './consts.js';
import { bigIntToHexString, formatVerse } from './utils.js';
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
export async function broadcast(callTx, privateKey) {
    try {
        const wallet = new Wallet(privateKey);
        let account = null;
        const broadcastType = callTx.op === 'send' ? 'send' : 'call';
        console.log('callTx: ', callTx);
        try {
            const accountResult = await getAccount(wallet.address);
            if (accountResult && 'nonce' in accountResult) {
                account = accountResult;
            }
            else {
                throw new Error('Failed to retrieve account information');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            else {
                console.error('An unexpected error occurred:', error);
            }
            throw error;
        }
        const newNonce = getNewNonce(account.nonce);
        callTx.nonce = newNonce;
        callTx.transactionType = {
            [broadcastType]: newNonce,
        };
        const orderedTx = reorderTransactionKeys(callTx);
        console.log({ orderedTx });
        const orderedTxString = JSON.stringify(orderedTx);
        const bytes = toUtf8Bytes(orderedTxString);
        console.log('orderdTxString: ', orderedTxString);
        const keccak256Hash = keccak256(bytes);
        const signature = await secp256k1.signAsync(keccak256Hash.replace('0x', ''), privateKey);
        const r = bigIntToHexString(signature.r);
        const s = bigIntToHexString(signature.s);
        const recover = signature.recovery;
        // if (!recover) {
        //   throw new Error('Invalid signature')
        // }
        const transactionWithSignature = {
            ...orderedTx,
            r,
            s,
            v: recover,
        };
        console.log({ transactionWithSignature });
        return await callLasrRpc(`lasr_${broadcastType}`, [transactionWithSignature], RPC_URL);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            throw error;
        }
        else {
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred.');
        }
    }
}
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
export async function callLasrRpc(method, params, rpc) {
    try {
        const callHeaders = new Headers();
        callHeaders.append('Content-Type', 'application/json');
        const body = JSON.stringify({
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: 1,
        });
        const requestOptions = {
            method: 'POST',
            headers: callHeaders,
            cache: 'no-store',
            body,
        };
        console.log({ params });
        const response = await fetch(RPC_URL, requestOptions).then((response) => response.json());
        if (response.error) {
            throw new Error(response.error.message);
        }
        return response.result;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            throw error;
        }
        else {
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred.');
        }
    }
}
/**
 * Asynchronously retrieves account information for a given address from a blockchain network via an RPC call.
 *
 * @param {string} address - The blockchain address of the account to retrieve.
 * @returns {Promise<Account | Error>} An object containing account information or an error if the retrieval fails.
 * @throws {Error} Throws an error if the account information cannot be retrieved.
 */
export async function getAccount(address) {
    try {
        let account = new Error('An unexpected error occurred');
        const params = [address];
        const result = await callLasrRpc('lasr_getAccount', params, RPC_URL);
        if (result instanceof Error) {
            console.error(result.message);
            account = {
                nonce: formatVerse('0'),
                accountType: 'user',
                programAccountData: {},
                programs: {},
                ownerAddress: address,
                programAccountLinkedPrograms: [],
                programAccountMetadata: {},
                programNamespace: undefined,
            };
        }
        else {
            account = JSON.parse(result);
        }
        return account;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            throw error;
        }
        else {
            console.error('An unexpected error occurred:', error);
        }
        throw new Error('An unexpected error occurred');
    }
}
/**
 * Reorders the keys of an initial transaction object according to a predefined order.
 * This function is useful for ensuring that transaction objects have a consistent format, especially before signing.
 *
 * @param {InitTransaction} initTransaction - The initial transaction object to reorder.
 * @returns {InitTransaction} A new transaction object with keys ordered as specified.
 * @throws {Error} Throws an error if reordering fails.
 */
export function reorderTransactionKeys(initTransaction) {
    try {
        const newObj = {
            transactionType: {},
            from: '',
            to: '',
            programId: '',
            op: '',
            transactionInputs: '',
            value: '',
            nonce: '',
        };
        const orderedKeys = new Set([
            'transactionType',
            'from',
            'to',
            'programId',
            'op',
            'transactionInputs',
            'value',
            'nonce',
        ]);
        orderedKeys.forEach((key) => {
            if (key in initTransaction) {
                newObj[key] = initTransaction[key];
            }
        });
        Object.keys(initTransaction).forEach((key) => {
            if (!orderedKeys.has(key)) {
                newObj[key] = initTransaction[key];
            }
        });
        return newObj;
    }
    catch (error) {
        console.error('An error occurred while reordering transaction keys:', error);
        throw error;
    }
}
/**
 * Calculates and formats a new nonce based on the given nonce string.
 * If the provided nonce is undefined, it returns the formatted version of 0.
 * This function is typically used to increment the nonce for a new transaction.
 *
 * @param {string | undefined} nonce - The current nonce of an account or transaction, or undefined if not available.
 * @returns {string | Error} The new nonce, incremented and formatted as a hexadecimal string, or an error if the operation fails.
 * @throws {Error} Throws an error if nonce calculation or formatting fails.
 */
export function getNewNonce(nonce) {
    if (!nonce) {
        return formatVerse('0').toString();
    }
    const parsedNonce = BigInt(nonce);
    return formatVerse((parsedNonce + BigInt(1)).toString());
}
