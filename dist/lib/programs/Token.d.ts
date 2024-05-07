import { TTokenFieldValues, TTokenUpdateValueTypes } from '../types';
import { Address, AddressOrNamespace } from '../../lib/programs/Address-Namespace';
import { ProgramUpdate } from '../../lib/programs/Program';
export declare class TokenMetadataInsert {
    private key;
    private value;
    constructor(key: string, value: string);
    toJson(): object;
}
export declare class TokenMetadataExtend {
    private map;
    constructor(map: Record<string, string>);
    toJson(): object;
}
export declare class TokenMetadataRemove {
    private key;
    constructor(key: string);
    toJson(): object;
}
export declare class TokenMetadataValue {
    private value;
    constructor(value: TokenMetadataInsert | TokenMetadataExtend | TokenMetadataRemove);
    toJson(): object;
}
export declare class TokenIdPush {
    private value;
    constructor(value: BigInt);
    toJson(): object;
}
export declare class TokenIdExtend {
    private items;
    constructor(items: BigInt[]);
    toJson(): object;
}
export declare class TokenIdInsert {
    private key;
    private value;
    constructor(key: number, value: BigInt);
    toJson(): object;
}
export declare class TokenIdPop {
    toJson(): object;
}
export declare class TokenIdRemove {
    private key;
    constructor(key: BigInt);
    toJson(): object;
}
export declare class TokenIdValue {
    private value;
    constructor(value: TokenIdPush | TokenIdExtend | TokenIdInsert | TokenIdPop | TokenIdRemove);
    toJson(): object;
}
export declare class TokenDataInsert {
    private key;
    private value;
    constructor(key: string, value: string);
    toJson(): object;
}
export declare class TokenDataExtend {
    private map;
    constructor(map: Record<string, string>);
    toJson(): object;
}
export declare class TokenDataRemove {
    private key;
    constructor(key: string);
    toJson(): object;
}
export declare class TokenDataValue {
    private value;
    constructor(value: TokenDataInsert | TokenDataExtend | TokenDataRemove);
    toJson(): object;
}
export declare class TokenFieldValue {
    private kind;
    private value;
    constructor(kind: string, value: TTokenUpdateValueTypes);
    toJson(): object;
}
export declare class TokenField {
    private value;
    constructor(value: TTokenFieldValues);
    toJson(): string;
}
export declare class TokenUpdateField {
    private field;
    private value;
    constructor(field: TokenField, value: TokenFieldValue);
    toJson(): object;
}
export declare class TokenUpdate {
    private account;
    private token;
    private updates;
    constructor(account: AddressOrNamespace | null, token: AddressOrNamespace | null, updates: TokenUpdateField[]);
    toJson(): object;
}
export declare class TokenDistribution {
    private programId;
    private to;
    private amount;
    private tokenIds;
    private updateFields;
    constructor(programId: AddressOrNamespace | null, to: AddressOrNamespace | null, amount: string | null, tokenIds: string[], updateFields: TokenUpdateField[]);
    toJson(): object;
}
export declare class ApprovalsInsert {
    private key;
    private value;
    constructor(key: Address, value: string[]);
    toJson(): object;
}
export declare class ApprovalsExtend {
    private items;
    constructor(items: Array<[Address, string[]]>);
    toJson(): object;
}
export declare class ApprovalsRemove {
    private key;
    private items;
    constructor(key: Address, items: string[]);
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
