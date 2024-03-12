/**
 * Formats a given number string into a hexadecimal string representation, ensuring it starts with '0x' and is 64 characters long.
 *
 * @param {string} numberString - The number string to format.
 * @returns {string} The formatted hexadecimal string with '0x' prefix and a total length of 66 characters, or an empty string if formatting fails.
 */
export function formatVerse(numberString) {
    try {
        const scaledNumberBigInt = BigInt(numberString) * BigInt('1000000000000000000');
        let hexString = scaledNumberBigInt.toString(16);
        hexString = hexString.padStart(64, '0');
        return '0x' + hexString;
    }
    catch (error) {
        return '';
    }
}
export function parseVerse(numberString) {
    try {
        const scaledNumberBigInt = BigInt(numberString) * BigInt('1000000000000000000');
        let hexString = scaledNumberBigInt.toString(16);
        hexString = hexString.padStart(64, '0');
        return BigInt('0x' + hexString);
    }
    catch (error) {
        return BigInt(0);
    }
}
export function bigIntToHexString(bigintValue) {
    let hexString = bigintValue.toString(16);
    hexString = hexString.padStart(64, '0');
    return '0x' + hexString;
}
export function getUndefinedProperties(obj) {
    return Object.entries(obj)
        .filter(([, value]) => value === undefined)
        .map(([key]) => key);
}
