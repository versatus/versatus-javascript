import { ApprovalsExtend, ApprovalsInsert, ApprovalsRemove, ApprovalsRevoke, ApprovalsValue, StatusValue, TokenDataExtend, TokenDataInsert, TokenDataRemove, TokenDataValue, TokenIdExtend, TokenIdInsert, TokenIdPop, TokenIdPush, TokenIdValue, TokenMetadataExtend, TokenMetadataInsert, TokenMetadataRemove, TokenMetadataValue } from '../lib/programs/Token';
import { LinkedProgramsExtend, LinkedProgramsInsert, LinkedProgramsRemove, LinkedProgramsValue, ProgramDataExtend, ProgramDataInsert, ProgramDataRemove, ProgramDataValue, ProgramMetadataExtend, ProgramMetadataInsert, ProgramMetadataRemove, ProgramMetadataValue } from '../lib/programs/Program';
import { IKeyPair } from '../lib/interfaces';
export type TAccountType = 'user' | {
    Program: string;
};
/**
 * Represents a 20-byte Ethereum Compatible address.
 *
 * This structure is used to store Ethereum Compatible addresses, which are derived from the public key. It implements traits like Clone, Copy, Debug, Serialize, Deserialize, etc., for ease of use across various contexts.
 */
export type TStatus = 'locked' | 'free';
export type TTransactionType = {
    [k: string]: unknown;
};
export type TProgramFieldValues = 'balance' | 'data' | 'metadata' | 'linkedPrograms' | 'ownerId' | 'status';
export type TProgramUpdateValueTypes = ProgramDataValue | ProgramDataInsert | ProgramDataExtend | ProgramDataRemove | ProgramMetadataValue | ProgramMetadataInsert | ProgramMetadataExtend | ProgramMetadataRemove | LinkedProgramsValue | LinkedProgramsInsert | LinkedProgramsExtend | LinkedProgramsRemove | StatusValue;
export type TTokenFieldValues = 'approvals' | 'balance' | 'data' | 'metadata' | 'ownerId' | 'programId' | 'status' | 'tokenIds';
export type TNetwork = 'stable' | 'test';
export type TInstructionKinds = 'create' | 'update' | 'transfer' | 'burn';
export type TKeyPairArray = IKeyPair[];
export type TTokenUpdateValueTypes = TokenDataValue | TokenDataInsert | TokenDataExtend | TokenDataRemove | TokenMetadataValue | TokenMetadataInsert | TokenMetadataExtend | TokenMetadataRemove | TokenIdValue | TokenIdPush | TokenIdExtend | TokenIdInsert | TokenIdPop | StatusValue | ApprovalsValue | ApprovalsInsert | ApprovalsExtend | ApprovalsRemove | ApprovalsRevoke;
