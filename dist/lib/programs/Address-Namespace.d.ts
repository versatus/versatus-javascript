export declare class Address {
    private address;
    constructor(addressInput: string);
    toJson(): string;
}
export declare class Namespace {
    private namespace;
    constructor(namespace: string);
    toJson(): object;
}
export declare class AddressOrNamespace {
    private static readonly THIS;
    private value;
    constructor(value: Address | Namespace | 'this');
    toJson(): object | string;
}
export declare class Credit {
    private value;
    constructor(value: string);
    toJson(): object;
}
export declare class Debit {
    private value;
    constructor(value: string);
    toJson(): object;
}
export declare class BalanceValue {
    private value;
    constructor(value: AddressOrNamespace | string);
    toJson(): object;
}
