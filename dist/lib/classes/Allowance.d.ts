import Address from './Address';
export declare class AllowanceInsert {
    private key;
    private value;
    constructor(key: Address, value: string);
    toJson(): object;
}
export declare class AllowanceExtend {
    private items;
    constructor(items: Array<[Address, string]>);
    toJson(): object;
}
export declare class AllowanceRemove {
    private key;
    private items;
    constructor(key: Address, items: string[]);
    toJson(): object;
}
export declare class AllowanceRevoke {
    private key;
    constructor(key: Address);
    toJson(): object;
}
export declare class AllowanceValue {
    private value;
    constructor(value: AllowanceInsert | AllowanceExtend | AllowanceRemove | AllowanceRevoke);
    toJson(): object;
}
