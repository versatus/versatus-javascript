import Address from './Address';
import { AddressOrNamespace } from './utils';
export declare class LinkedProgramsInsert {
    private key;
    constructor(key: Address);
    toJson(): object;
}
export declare class LinkedProgramsExtend {
    private items;
    constructor(items: Address[]);
    toJson(): object;
}
export declare class LinkedProgramsRemove {
    private key;
    constructor(key: Address);
    toJson(): object;
}
export declare class LinkedProgramsValue {
    private value;
    constructor(value: LinkedProgramsInsert | LinkedProgramsExtend | LinkedProgramsRemove);
    toJson(): object;
}
export declare class ProgramMetadataInsert {
    private key;
    private value;
    constructor(key: string, value: string);
    toJson(): object;
}
export declare class ProgramMetadataExtend {
    private map;
    constructor(map: Record<string, string>);
    toJson(): object;
}
export declare class ProgramMetadataRemove {
    private key;
    constructor(key: string);
    toJson(): object;
}
export declare class ProgramMetadataValue {
    private value;
    constructor(value: ProgramMetadataInsert | ProgramMetadataExtend | ProgramMetadataRemove);
    toJson(): object;
}
export declare class ProgramDataInsert {
    private key;
    private value;
    constructor(key: string, value: string);
    toJson(): object;
}
export declare class ProgramDataExtend {
    private map;
    constructor(map: Record<string, string>);
    toJson(): object;
}
export declare class ProgramDataRemove {
    private key;
    constructor(key: string);
    toJson(): object;
}
export declare class ProgramDataValue {
    private value;
    constructor(value: ProgramDataInsert | ProgramDataExtend | ProgramDataRemove);
    toJson(): object;
}
export declare class ProgramFieldValue {
    private kind;
    private value;
    constructor(kind: string, value: ProgramDataValue | ProgramMetadataValue);
    toJson(): object;
}
export declare class ProgramField {
    private value;
    constructor(value: string);
    toJson(): string;
}
export declare class ProgramUpdateField {
    private field;
    private value;
    constructor(field: ProgramField, value: ProgramFieldValue);
    toJson(): object;
}
export declare class ProgramUpdate {
    private account;
    private updates;
    constructor(account: AddressOrNamespace, updates: ProgramUpdateField[]);
    toJson(): object;
}
