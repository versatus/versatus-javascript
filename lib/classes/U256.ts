export class U256 {
  private value: bigint

  constructor(value: bigint) {
    this.value = value
  }

  toHex(): string {
    return this.value.toString(16).padStart(64, '0')
  }

  toJson(): object {
    return { U256: `0x${this.toHex()}` }
  }

  static fromList(valueList: number[]): U256 {
    if (
      valueList.length !== 4 ||
      !valueList.every((x) => typeof x === 'number')
    ) {
      throw new Error('U256 must be initialized with a list of 4 integers')
    }

    const value = valueList.reduce(
      (acc, curr, i) => (acc + BigInt(curr)) << BigInt(i * 64),
      BigInt(0)
    )
    return new U256(value)
  }

  static fromHex(hexStr: string): U256 {
    if (hexStr.startsWith('0x')) {
      hexStr = hexStr.substring(2)
    }
    const value = BigInt(`0x${hexStr}`)
    return new U256(value)
  }
}
