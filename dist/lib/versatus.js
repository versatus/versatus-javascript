import { keccak256, toUtf8Bytes } from 'ethers/lib.esm';
import { ethers } from 'ethers';
import * as secp256k1 from '@noble/secp256k1';
import { RPC_URL } from './consts.js';
/**
 * Parses the input for a contract from the standard input stream.
 * @returns {any} The parsed input object from the standard input.
 * @description
 * This function reads from the standard input, collecting data in chunks, and then parses the accumulated data as JSON.
 * It assumes the data is in a format that can be directly parsed into a JSON object.
 * Note: This function uses Javy.IO for I/O operations, which is assumed to be a part of the environment.
 */
export function parseContractInput() {
    const chunkSize = 1024;
    const inputChunks = [];
    let totalBytes = 0;
    const stdInBuffer = new Uint8Array(chunkSize);
    const fdIn = 0;
    //@ts-ignore
    const bytesRead = Javy.IO.readSync(fdIn, stdInBuffer);
    totalBytes += bytesRead;
    inputChunks.push(stdInBuffer.subarray(0, bytesRead));
    const { finalBuffer } = inputChunks.reduce((context, chunk) => {
        context.finalBuffer.set(chunk, context.bufferOffset);
        context.bufferOffset += chunk.length;
        return context;
    }, { bufferOffset: 0, finalBuffer: new Uint8Array(totalBytes) });
    return JSON.parse(new TextDecoder().decode(finalBuffer));
}
/**
 * Sends the provided output to the standard output stream.
 * @param {any} output - The output data to be sent.
 * @description
 * This function encodes the given output as a JSON string and writes it to the standard output.
 * It uses the TextEncoder to encode the string and Javy.IO for the I/O operation.
 * Note: This function assumes that Javy.IO is available in the environment for I/O operations.
 */
export function sendOutput(output) {
    const encodedOutput = new TextEncoder().encode(JSON.stringify(output));
    const stdOutBuffer = new Uint8Array(encodedOutput);
    const fd = 1;
    //@ts-ignore
    Javy.IO.writeSync(fd, stdOutBuffer);
}
export async function sendCallTransaction(callTx, privateKey) {
    try {
        const wallet = new ethers.Wallet(privateKey);
        let account = null; // Initialize account as null or as an Account type
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
        const newNonce = account.nonce;
        callTx.nonce = newNonce;
        callTx.transactionType.call = newNonce;
        const orderedTx = reorderTransactionKeys(callTx);
        const orderedTxString = JSON.stringify(orderedTx);
        const bytes = toUtf8Bytes(orderedTxString);
        const keccak256Hash = keccak256(bytes);
        const signature = await secp256k1.signAsync(keccak256Hash.replace('0x', ''), privateKey);
        const r = formatVerse(signature.r.toString());
        const s = formatVerse(signature.s.toString());
        const recover = signature.recovery;
        if (!recover) {
            throw new Error('Invalid signature');
        }
        const transactionWithSignature = {
            ...orderedTx,
            r,
            s,
            v: recover,
        };
        return await callLasrRpc('lasr_call', [transactionWithSignature], RPC_URL);
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
export function formatVerse(numberString) {
    try {
        const numberBigInt = BigInt(numberString);
        let hexString = numberBigInt.toString(16);
        hexString = hexString.padStart(64, '0');
        const hexStringWithPrefix = '0x' + hexString;
        if (hexStringWithPrefix.length !== 66) {
            return '';
        }
        return hexStringWithPrefix;
    }
    catch (error) {
        return '';
    }
}
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
        // First, assign the properties in the specified order
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
export function getNewNonce(nonce) {
    try {
        if (!nonce) {
            return formatVerse('0').toString();
        }
        const parsedNonce = BigInt(nonce);
        return formatVerse((parsedNonce + BigInt(1)).toString());
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            throw error;
        }
        else {
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred');
        }
    }
}
