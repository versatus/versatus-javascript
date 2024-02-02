import { AddressOrNamespace, StatusValue } from './utils';
import { TokenFieldValues } from '../types';
import { ApprovalsExtend, ApprovalsValue } from './Approvals';
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
    constructor(kind: string, value: TokenDataValue | TokenMetadataExtend | StatusValue | ApprovalsValue | ApprovalsExtend);
    toJson(): object;
}
export declare class TokenField {
    private value;
    constructor(value: TokenFieldValues);
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
