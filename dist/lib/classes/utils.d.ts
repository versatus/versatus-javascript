import Address from './Address';
import { Namespace } from './Namespace';
import { U256 } from './U256';
import { TokenUpdate } from './Token';
import { ProgramUpdate } from './Program';
export declare class AddressOrNamespace {
    private static readonly THIS;
    private value;
    constructor(value: Address | Namespace | 'this');
    toJson(): object | string;
}
export declare class Credit {
    private value;
    constructor(value: U256);
    toJson(): object;
}
export declare class Debit {
    private value;
    constructor(value: U256);
    toJson(): object;
}
export declare class BalanceValue {
    private value;
    constructor(value: AddressOrNamespace | U256);
    toJson(): object;
}
export declare class StatusValue {
    private value;
    constructor(value: string);
    toJson(): object;
}
export declare class TokenOrProgramUpdate {
    private kind;
    private value;
    constructor(kind: string, value: TokenUpdate | ProgramUpdate);
    toJson(): object;
}
