export function bigIntToHexString(bigintValue: BigInt): string {
  // Convert the BigInt to a hexadecimal string
  let hexString = bigintValue.toString(16)

  // Ensure the string is 64 characters long, padding with leading zeros if necessary
  hexString = hexString.padStart(64, '0')

  // Return the properly formatted hexadecimal string with '0x' prefix
  return '0x' + hexString
}
