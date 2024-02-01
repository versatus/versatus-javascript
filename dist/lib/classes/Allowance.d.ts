import Address from './Address';
import { U256 } from './U256';
export declare class AllowanceInsert {
    private key;
    private value;
    constructor(key: Address, value: U256);
    toJson(): object;
}
export declare class AllowanceExtend {
    private items;
    constructor(items: Array<[Address, U256]>);
    toJson(): object;
}
export declare class AllowanceRemove {
    private key;
    private items;
    constructor(key: Address, items: U256[]);
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
