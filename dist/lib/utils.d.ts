import { NETWORK } from '../lib/types';
export declare function parseAmountToBigInt(input: number | string): BigInt;
export declare function formatAmountToHex(input: number | string): string;
export declare function formatHexToAmount(hexString: string, units?: number): string;
/**
 * Converts a BigInt value to a hexadecimal string representation.
 *
 * This function takes a BigInt number as input and converts it into a
 * hexadecimal string. The resulting string is padded to ensure a length
 * of 64 characters, prefixed with `0x` to denote hexadecimal format.
 * This can be particularly useful for representing large integers in a
 * compact, readable format commonly used in various programming and
 * cryptographic contexts.
 *
 * @param {BigInt} bigintValue - The BigInt value to be converted to a
 * hexadecimal string.
 * @returns {string} The hexadecimal string representation of the input
 * BigInt, prefixed with `0x` and padded to 64 characters.
 */
export declare function formatBigIntToHex(bigintValue: BigInt): string;
export declare function getUndefinedProperties(obj: Record<string, any>): string[];
export declare const getRPCForNetwork: (network: NETWORK) => string;
export declare const getIPFSForNetwork: (network: NETWORK) => string;
