import { Address, AddressOrNamespace } from '../lib/programs';
import { TAccountType, TStatus, TTransactionType } from '../lib/types';
/**
 * This file contains types the protocol uses to prepare data, structure it and call out to a particular compute payload. The inputs type for a contract call
 */
export interface IComputeInputs {
    accountInfo: IAccount;
    contractInputs: string;
    op: string;
    transaction: ITransaction;
    version: number;
    [k: string]: unknown;
}
/**
 * Represents an LASR account.
 *
 * This structure contains details of an LASR account, including its address, associated programs, nonce, signatures, hashes, and certificates. It implements traits for serialization, hashing, and comparison.
 */
export interface IAccount {
    accountType: TAccountType;
    nonce: string;
    ownerAddress: Address;
    programAccountData: IArbitraryData;
    programAccountLinkedPrograms: AddressOrNamespace[];
    programAccountMetadata: IMetadata;
    programNamespace?: AddressOrNamespace | null;
    programs: {
        [k: string]: IProgram;
    };
    [k: string]: unknown;
}
/**
 * Represents a generic data container.
 *
 * This structure is used to store arbitrary data as a vector of bytes (`Vec<u8>`). It provides a default, cloneable, serializable, and debuggable interface. It is typically used for storing data that doesn't have a fixed format or structure.
 */
export interface IArbitraryData {
    [k: string]: string;
}
/**
 * Represents metadata as a byte vector.
 *
 * This structure is designed to encapsulate metadata, stored as a vector of bytes. It supports cloning, serialization, and debugging. The metadata can be of any form that fits into a byte array, making it a flexible container.
 */
export interface IMetadata {
    [k: string]: string;
}
export interface IProgram {
    allowance: {
        [k: string]: string;
    };
    approvals: {
        [k: string]: string[];
    };
    balance: string;
    data: IArbitraryData;
    metadata: IMetadata;
    ownerId: Address;
    programId: Address;
    status: TStatus;
    tokenIds: string[];
    [k: string]: unknown;
}
export interface IInitTransaction {
    to: string;
    from: string;
    transactionInputs: string;
    nonce?: string;
    op: string;
    programId: string;
    transactionType?: TTransactionType;
    value: string;
    [k: string]: unknown;
}
export interface ITransaction extends IInitTransaction {
    r: string;
    s: string;
    v: number;
}
export interface IWallet {
    keypair: string;
    secret_key: string;
    public_key: string;
    encryption_public_key: string;
    encryption_secret_key: string;
    address: string;
    type: 'derived' | 'imported';
    nonce: string;
}
export interface IKeyPair {
    mnemonic: string;
    keypair: string;
    secret_key: string;
    public_key: string;
    address: string;
}
