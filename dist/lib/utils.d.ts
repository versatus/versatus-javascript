import { NETWORK } from '../lib/types';
/**
 * Formats a given number string into a hexadecimal string representation. If the input is already in hexadecimal format,
 * it ensures the result is properly padded and starts with '0x'. For decimal inputs, it scales the number by 1e18,
 * rounds it, and converts it to a hexadecimal string, ensuring the result is 64 characters long.
 *
 * This function supports inputs in both decimal and hexadecimal formats, addressing the versatility needed for
 * different numeric representations. It's particularly useful in contexts like blockchain and cryptography where
 * hexadecimal representation with specific formatting is often required.
 *
 * @param {string} numberString - The number string to format, which can be in decimal or hexadecimal format.
 * @returns {string} The formatted hexadecimal string with '0x' prefix and a total length of 66 characters, including the prefix.
 * Returns an empty string if formatting fails or the input is invalid.
 */
export declare function formatVerse(numberString: string): string;
/**
 * Parses a given number string, scaling it and converting it to a BigInt represented in hexadecimal format.
 * The function can handle inputs in both decimal format and hexadecimal format (prefixed with '0x'). For hexadecimal inputs,
 * it directly converts them to BigInt without scaling. For decimal inputs, it scales the number by a factor of 1e18,
 * addressing the precision and range necessary for handling large numbers and floating-point numbers in applications
 * such as blockchain and cryptography.
 *
 * The hexadecimal representation is padded to ensure it is 64 characters long, making it suitable for specific
 * standards requiring fixed-length hexadecimal strings. This functionality makes the function versatile for various
 * numeric formats and applications, providing consistent handling and formatting of large and potentially complex numbers.
 *
 * @param {string} numberString - The number string to parse and format. This string can represent a number in decimal format
 *                                or a hexadecimal string starting with '0x'.
 * @returns {BigInt} The parsed number as a BigInt in hexadecimal format, ensuring a consistent length of 64 characters for
 *                   the hexadecimal portion. Returns BigInt(0) if the input is invalid, ensuring robust error handling.
 */
export declare function parseVerse(numberString: string): BigInt;
export declare function bigIntToHexString(bigintValue: BigInt): string;
export declare function getUndefinedProperties(obj: Record<string, any>): string[];
export declare const getRPCForNetwork: (network: NETWORK) => string;
export declare const getIPFSForNetwork: (network: NETWORK) => string;
