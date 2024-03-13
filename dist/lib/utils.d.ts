import { NETWORK } from '../lib/types';
/**
 * Formats a given number string into a hexadecimal string representation, ensuring it starts with '0x' and is 64 characters long.
 *
 * @param {string} numberString - The number string to format.
 * @returns {string} The formatted hexadecimal string with '0x' prefix and a total length of 66 characters, or an empty string if formatting fails.
 */
export declare function formatVerse(numberString: string): string;
export declare function parseVerse(numberString: string): BigInt;
export declare function bigIntToHexString(bigintValue: BigInt): string;
export declare function getUndefinedProperties(obj: Record<string, any>): string[];
export declare const getRPCForNetwork: (network: NETWORK) => "http://lasr-sharks.versatus.io:9292" | "http://lasr-sharks.versatus.io:9293";
export declare const getIPFSForNetwork: (network: NETWORK) => string;
