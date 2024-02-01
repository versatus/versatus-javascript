export declare class U256 {
    private value;
    constructor(value: bigint);
    toHex(): string;
    toJson(): object;
    static fromList(valueList: number[]): U256;
    static fromHex(hexStr: string): U256;
}
