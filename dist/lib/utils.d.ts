import { TNetwork } from '../lib/types';
import { IArbitraryData, IComputeInputs, IMetadata, IProgram } from '../lib/interfaces';
/**
 * Converts a numeric input (either a number or a string representation of a number) into a BigInt.
 * This function is particularly useful for handling large numbers that need to be represented accurately
 * in environments such as blockchain transactions, where precision down to the smallest unit (e.g., wei in Ethereum)
 * is crucial. The input can include a decimal fraction, but it should not exceed 18 decimal places to avoid
 * precision loss. The function pads the fraction part to 18 decimal places if it is shorter, ensuring the
 * representation is accurate for blockchain-related calculations.
 *
 * @param input - The numeric value to convert. Can be a number or a string that potentially includes
 *                a decimal point. If the input is a string and includes a fraction part, the fraction
 *                part should not exceed 18 decimal places.
 * @returns A BigInt representation of the input value, with the fractional part considered up to 18 decimal places.
 *          The fractional part is rounded down to the nearest whole number if necessary. In case of an error
 *          (e.g., the fractional part exceeds 18 decimal places), the function logs the error and returns BigInt(0).
 *
 * @example
 * // Convert a number without a fractional part
 * parseAmountToBigInt(123)
 * // returns BigInt('123000000000000000000')
 *
 * @example
 * // Convert a number with a fractional part
 * parseAmountToBigInt('123.456')
 * // returns BigInt('123456000000000000000')
 *
 * @throws {Error} If the fractional part of the input exceeds 18 decimal places, indicating
 *                 that the input value cannot be accurately represented within the expected precision.
 */
export declare function parseAmountToBigInt(input: number | string): bigint;
/**
 * Converts a numerical amount into a hexadecimal string, typically for blockchain-related transactions
 * where the amount needs to be expressed in smallest units (e.g., wei) in hexadecimal format.
 * If the input is already a hexadecimal string starting with '0x', it returns the input with its
 * length adjusted to 64 characters (excluding the '0x' prefix) by padding with zeros if necessary.
 * Otherwise, it converts the input number (or numeric string) into a hexadecimal string representing
 * the value in smallest units (e.g., wei for Ethereum) by multiplying the input by 10^18, rounding it,
 * and then converting to hexadecimal format.
 *
 * This function is useful for preparing numeric values for smart contract interactions that require
 * inputs in hexadecimal format.
 *
 * @param input - The numeric value to convert into hexadecimal format. Can be a number or a string.
 *                If a string is provided and it already starts with '0x', it is considered to be
 *                in hexadecimal format and is processed accordingly.
 * @returns A hexadecimal string representation of the input number, prefixed with '0x' and padded
 *          to ensure a length of 64 characters. In case of an error during conversion, returns a
 *          hexadecimal string representing zero ('0x' followed by 64 zeros) and logs the error.
 *
 * @example
 * // Convert a number to hexadecimal format
 * formatAmountToHex(1)
 * // returns '0x' followed by 63 zeros and then 'de0b6b3a7640000'
 *
 * @example
 * // Process an already hexadecimal input
 * formatAmountToHex('0x1')
 * // returns '0x' followed by 63 zeros and then '1'
 *
 * @throws If any error occurs during the conversion, an error message is logged to the console,
 *         and a default hexadecimal value representing zero is returned.
 */
export declare function formatAmountToHex(input: number | string): string;
/**
 * Converts a hexadecimal string representing an amount in smallest units (e.g., wei) to a
 * string in a more readable format (e.g., 'ether'), by dividing it by 10 raised to the power of
 * the specified unit count.
 *
 * This function is useful when dealing with blockchain-related numerical data that often comes
 * in hexadecimal format and needs to be converted into a human-readable decimal format, considering
 * the divisibility of the cryptocurrency (e.g., converting wei to ether in Ethereum).
 *
 * @param hexString - The hexadecimal string to convert. It must start with '0x'.
 * @param units - The number of units to divide the hexadecimal value by, represented as a power of 10.
 *                Defaults to 18, which is commonly used for Ethereum to represent ether from wei.
 * @returns A string representation of the decimal value with the whole part and fractional part
 *          separated by a dot. In case of an error (e.g., input not starting with '0x'), an empty
 *          string is returned and an error is logged to the console.
 *
 * @example
 * // Convert 1 ether (in wei) to a human-readable format
 * formatHexToAmount('0xde0b6b3a7640000')
 * // returns '1.0'
 *
 * @throws {Error} If the input string does not start with '0x', indicating an invalid hexadecimal input.
 */
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
export declare function formatBigIntToHex(bigintValue: bigint): string;
/**
 * Converts a BigInt, hexadecimal string, or decimal string representing an amount
 * in the smallest units (e.g., wei) into a decimal string representation, considering
 * 18 decimal places. This function is useful for displaying blockchain-related numerical
 * values in a human-readable format.
 *
 * @param input - The input value, which can be a BigInt, a hexadecimal string starting
 *                with '0x', or a decimal string representing the amount in smallest units.
 * @returns A string representation of the decimal value, considering 18 decimal places,
 *          in a more human-readable format.
 */
export declare function formatVerse(input: bigint | string): string;
/**
 * Identifies and returns the keys of all properties in a given object that have `undefined` values.
 * This function is useful for debugging or validating objects, especially before sending them to APIs
 * or storing them, where `undefined` values might not be allowed or could lead to unexpected behavior.
 *
 * Note: This function only checks for properties with a value of `undefined` and does not consider
 * properties that are not defined in the object at all.
 *
 * @param obj - The object to be inspected, represented as a record with string keys and any type of values.
 * @returns An array of strings, where each string is the key of a property in the input object whose value
 *          is `undefined`. If no such properties are found, an empty array is returned.
 *
 * @example
 * // Example object with some undefined properties
 * const exampleObject = { name: 'John Doe', age: undefined, occupation: 'Engineer', salary: undefined };
 * getUndefinedProperties(exampleObject)
 * // returns ['age', 'salary']
 */
export declare function getUndefinedProperties(obj: Record<string, any>): string[];
/**
 * Checks if any of the values in the provided `neededValues` object are `undefined`.
 * Throws an Error with a message listing all keys that have `undefined` values if any are found.
 * This function relies on `getUndefinedProperties`, a utility function that must be defined elsewhere in the codebase,
 * to identify keys with `undefined` values.
 *
 * @param {Record<string, any>} neededValues - An object with key-value pairs to be checked for `undefined` values.
 * @throws {Error} If any value in `neededValues` is `undefined`, throws an Error listing those keys.
 */
export declare function checkIfValuesAreUndefined(neededValues: Record<string, any>): void;
/**
 * Validates the given `criteria`. If the `criteria` is falsy, throws an Error with the provided `errorString`.
 * This function is versatile and can be used to validate any condition that results in a boolean value,
 * making it suitable for various validation scenarios.
 *
 * @param {any | boolean | undefined} criteria - The condition or value to be validated. Can be any value that
 * is expected to represent a truthy or falsy condition.
 * @param {string} errorString - The error message to be thrown if the validation fails.
 * @returns {any | Error} Returns the `criteria` if it is truthy, otherwise throws an Error with `errorString`.
 * @throws {Error} Throws an Error with `errorString` if `criteria` is falsy.
 */
export declare const validate: (criteria: any | boolean | undefined, errorString: string) => any | Error;
/**
 * Validates that none of the values in `neededValues` are `undefined` and then creates a JSON string from it.
 * This function combines validation (using `checkIfValuesAreUndefined`) and serialization into a single operation.
 * If any value in `neededValues` is `undefined`, an error will be thrown before attempting to create a JSON string.
 *
 * @param {Record<string, any>} neededValues - An object containing key-value pairs to be validated and serialized.
 * @returns {string} A JSON string representation of `neededValues` if all values are defined.
 * @throws {Error} If any value in `neededValues` is `undefined`, or if any other error occurs during the process.
 */
export declare const validateAndCreateJsonString: (neededValues: Record<string, any>) => string;
/**
 * Retrieves the RPC (Remote Procedure Call) URL for interacting with a blockchain network,
 * based on the specified network type. This function supports dynamic selection between
 * stable and unstable networks, with an optional override via an environment variable.
 *
 * The RPC URL is crucial for applications that need to communicate with blockchain networks,
 * allowing them to send and receive data, execute smart contracts, and perform other network
 * interactions. This function provides a flexible way to select the appropriate RPC URL based
 * on the application's needs or the environment configuration.
 *
 * @param network - An enum value (`NETWORK`) indicating the desired blockchain network type.
 *                  The function adjusts the RPC URL based on this value, choosing between stable
 *                  and unstable network URLs, or an override URL from the environment variables.
 * @returns The selected RPC URL as a string. If the `LASR_RPC_URL` environment variable is set,
 *          its value is used as the RPC URL regardless of the `network` parameter. Otherwise,
 *          the function selects the RPC URL based on the `network` parameter: `LASR_RPC_URL_STABLE`
 *          for the 'stable' network and `LASR_RPC_URL_UNSTABLE` for other cases.
 *
 * @example
 * // Assuming the environment variable is not set, and using enum for network types
 * getRPCForNetwork('stable')
 * // logs 'USING RPC URL: ' followed by the stable RPC URL and returns the stable RPC URL.
 *
 * @note This function logs the selected RPC URL to the console for debugging or informational purposes.
 */
export declare const getRPCForNetwork: (network: TNetwork) => string;
/**
 * Retrieves the IPFS URL configuration based on the specified network environment. This function determines
 * the appropriate IPFS URL to use by first checking for an environment variable override. If the override is
 * not present, it selects the URL based on whether the network environment is marked as 'stable' or not.
 *
 * This is particularly useful for applications that interact with IPFS and need to switch between different
 * IPFS nodes or gateways depending on the environment (e.g., development, testing, production) to ensure
 * compatibility and stability.
 *
 * @param network - The network type, typically a custom type or enum `NETWORK`, indicating the current
 *                  operating environment of the application (e.g., 'stable', 'unstable').
 * @returns The selected IPFS URL as a string. The function logs the chosen URL for debugging purposes.
 *
 * @example
 * // Assuming VIPFS_URL = 'https://ipfs.stable.example.com' and VIPFS_URL_UNSTABLE = 'https://ipfs.unstable.example.com'
 * getIPFSForNetwork('stable')
 * // Logs 'USING IPFS URL: https://ipfs.stable.example.com' and returns 'https://ipfs.stable.example.com'
 *
 * @example
 * // When an environment variable VIPFS_ADDRESS is set to 'https://custom.ipfs.example.com'
 * getIPFSForNetwork('unstable')
 * // Logs 'USING IPFS URL: https://custom.ipfs.example.com' and returns 'https://custom.ipfs.example.com'
 */
export declare const getIPFSForNetwork: (network: TNetwork) => string;
export declare const onlyOwner: (computeInputs: IComputeInputs) => boolean;
export declare const parseProgramAccountMetadata: (computeInputs: IComputeInputs) => IMetadata;
export declare const parseProgramAccountData: (computeInputs: IComputeInputs) => IArbitraryData;
export declare const parseProgramTokenInfo: (computeInputs: IComputeInputs) => IProgram;
export declare const parseAvailableTokenIds: (computeInputs: IComputeInputs) => string[];
export declare const parseTxInputs: (computeInputs: IComputeInputs) => Record<string, any>;
export declare const parseMetadata: (computeInputs: IComputeInputs) => {
    name: string;
    symbol: string;
    initializedSupply: string;
    totalSupply: string;
};
export declare const getCurrentSupply: (computeInputs: IComputeInputs) => number;
export declare const getCurrentImgUrls: (computeInputs: IComputeInputs) => string[];
export declare const generateTokenIdArray: (initializedSupply: number | string) => string[];
export declare const parseTokenData: (computeInputs: IComputeInputs) => Record<string, any>;
