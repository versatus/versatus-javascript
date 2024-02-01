export function bigIntToHexString(bigintValue: BigInt) {
  return '0x' + bigintValue.toString(16)
}
