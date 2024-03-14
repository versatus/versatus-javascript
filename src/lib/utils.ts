import { NETWORK } from '@/lib/types'
import {
  LASR_RPC_URL_STABLE,
  LASR_RPC_URL_UNSTABLE,
  VIPFS_ADDRESS,
  VIPFS_ADDRESS_TEST,
} from '@/lib/consts'

/**
 * Formats a given number string into a hexadecimal string representation, ensuring it starts with '0x' and is 64 characters long.
 *
 * @param {string} numberString - The number string to format.
 * @returns {string} The formatted hexadecimal string with '0x' prefix and a total length of 66 characters, or an empty string if formatting fails.
 */
export function formatVerse(numberString: string): string {
  try {
    const scaledNumberBigInt =
      BigInt(numberString) * BigInt('1000000000000000000')
    let hexString = scaledNumberBigInt.toString(16)
    hexString = hexString.padStart(64, '0')
    return '0x' + hexString
  } catch (error: unknown) {
    return ''
  }
}

export function parseVerse(numberString: string): BigInt {
  try {
    const scaledNumberBigInt =
      BigInt(numberString) * BigInt('1000000000000000000')
    let hexString = scaledNumberBigInt.toString(16)
    hexString = hexString.padStart(64, '0')
    return BigInt('0x' + hexString)
  } catch (error: unknown) {
    return BigInt(0)
  }
}

export function bigIntToHexString(bigintValue: BigInt): string {
  let hexString = bigintValue.toString(16)
  hexString = hexString.padStart(64, '0')
  return '0x' + hexString
}

export function getUndefinedProperties(obj: Record<string, any>): string[] {
  return Object.entries(obj)
    .filter(([, value]) => value === undefined)
    .map(([key]) => key)
}

export const getRPCForNetwork = (network: NETWORK) => {
  return process?.env.LASR_RPC_URL ?? network === 'stable'
    ? LASR_RPC_URL_STABLE
    : LASR_RPC_URL_UNSTABLE
}

export const getIPFSForNetwork = (network: NETWORK) => {
  return process?.env.VIPFS_ADDRESS ?? network === 'stable'
    ? `${VIPFS_ADDRESS}`
    : `${VIPFS_ADDRESS_TEST}`
}
