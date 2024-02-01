export class U256 {
    constructor(value) {
        this.value = value;
    }
    toHex() {
        return this.value.toString(16).padStart(64, '0');
    }
    toJson() {
        return { U256: `0x${this.toHex()}` };
    }
    static fromList(valueList) {
        if (valueList.length !== 4 ||
            !valueList.every((x) => typeof x === 'number')) {
            throw new Error('U256 must be initialized with a list of 4 integers');
        }
        const value = valueList.reduce((acc, curr, i) => (acc + BigInt(curr)) << BigInt(i * 64), BigInt(0));
        return new U256(value);
    }
    static fromHex(hexStr) {
        if (hexStr.startsWith('0x')) {
            hexStr = hexStr.substring(2);
        }
        const value = BigInt(`0x${hexStr}`);
        return new U256(value);
    }
}
