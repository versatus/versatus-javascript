import Address from './Address';
import { U256 } from './U256';
export declare class ApprovalsInsert {
    private key;
    private value;
    constructor(key: Address, value: string[]);
    toJson(): object;
}
export declare class ApprovalsExtend {
    private items;
    constructor(items: Array<[Address, string]>);
    toJson(): object;
}
export declare class ApprovalsRemove {
    private key;
    private items;
    constructor(key: Address, items: U256[]);
    toJson(): object;
}
export declare class ApprovalsRevoke {
    private key;
    constructor(key: Address);
    toJson(): object;
}
export declare class ApprovalsValue {
    private value;
    constructor(value: ApprovalsInsert | ApprovalsExtend | ApprovalsRemove | ApprovalsRevoke);
    toJson(): object;
}
