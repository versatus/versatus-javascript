import { LASR_RPC_URL_STABLE, LASR_RPC_URL_UNSTABLE, VIPFS_URL, VIPFS_URL_UNSTABLE, } from '../lib/consts.js';
export function parseAmountToBigInt(input) {
    try {
        // Convert numeric input to a string if necessary
        const decimalString = typeof input === 'number' ? input.toString() : input;
        const parts = decimalString.split('.');
        let whole = parts[0];
        let fraction = parts[1] || '';
        // Ensure the fraction part is not longer than 18 characters
        if (fraction.length > 18) {
            throw new Error('Fractional part exceeds 18 decimal places');
        }
        // Pad the fraction part to 18 characters to represent the value accurately
        fraction = fraction.padEnd(18, '0');
        // Combine the whole number and fraction parts and convert to BigInt
        const combined = whole + fraction;
        return BigInt(combined);
    }
    catch (error) {
        console.error('Error parsing amount to BigInt:', error);
        return BigInt(0); // Return a default value in case of error
    }
}
export function formatAmountToHex(input) {
    try {
        let hexString;
        // Check if input is already in hexadecimal format (string type check is implicit)
        if (typeof input === 'string' && input.startsWith('0x')) {
            hexString = input.substring(2);
        }
        else {
            // Convert input to a float, regardless of initial type (number or string)
            const decimalNumber = typeof input === 'number' ? input : parseFloat(input);
            const verseBigInt = BigInt(Math.round(decimalNumber * 1e18));
            hexString = verseBigInt.toString(16);
        }
        // Pad the hex string to ensure it's 64 characters long
        hexString = hexString.padStart(64, '0');
        // Prefix with '0x' to indicate hexadecimal format
        return '0x' + hexString;
    }
    catch (error) {
        console.error('Error formatting amount to hex:', error);
        return '0x' + '0'.repeat(64); // Return a default value in case of error
    }
}
export function formatHexToAmount(hexString, units = 18) {
    try {
        if (!hexString.startsWith('0x')) {
            throw new Error('Input must start with 0x');
        }
        // Remove '0x' prefix and convert hex to BigInt
        const valueBigInt = BigInt(hexString);
        // Calculate the divisor based on the units (e.g., 1e18 for 'verse')
        const divisor = BigInt(10) ** BigInt(units);
        // Calculate the whole part and the fractional part
        const wholePart = valueBigInt / divisor;
        const fractionalPart = valueBigInt % divisor;
        // Format the fractional part with leading zeros and remove trailing zeros
        let fractionalString = fractionalPart.toString().padStart(units, '0');
        fractionalString = fractionalString.replace(/0+$/, '');
        // Ensure there's at least one digit in the fractional part
        if (fractionalString === '')
            fractionalString = '0';
        // Combine the whole part and fractional part
        return `${wholePart.toString()}.${fractionalString}`;
    }
    catch (error) {
        console.error('Error formatting hex to amount:', error);
        return ''; // Return an empty string or appropriate error value in case of error
    }
}
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
export function formatBigIntToHex(bigintValue) {
    let hexString = bigintValue.toString(16);
    hexString = hexString.padStart(64, '0');
    return '0x' + hexString;
}
export function getUndefinedProperties(obj) {
    return Object.entries(obj)
        .filter(([, value]) => value === undefined)
        .map(([key]) => key);
}
export const getRPCForNetwork = (network) => {
    const rpcUrl = process.env.LASR_RPC_URL
        ? process.env.LASR_RPC_URL
        : network === 'stable'
            ? LASR_RPC_URL_STABLE
            : LASR_RPC_URL_UNSTABLE;
    console.log('USING RPC URL: ', rpcUrl);
    return rpcUrl;
};
export const getIPFSForNetwork = (network) => {
    const ipfsUrl = process?.env.VIPFS_ADDRESS
        ? process?.env.VIPFS_ADDRESS
        : network === 'stable'
            ? `${VIPFS_URL}`
            : `${VIPFS_URL_UNSTABLE}`;
    console.log('USING IPFS URL: ', ipfsUrl);
    return ipfsUrl;
};
