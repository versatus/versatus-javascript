import { BurnInstructionBuilder, CreateInstructionBuilder, TokenDistributionBuilder, TransferInstructionBuilder, UpdateInstructionBuilder, } from '../../../lib/programs/instruction-builders/builders.js';
import { ApprovalsExtend, StatusValue, TokenField, TokenFieldValue, TokenMetadataExtend, TokenMetadataInsert, TokenMetadataRemove, TokenOrProgramUpdate, TokenUpdateField, } from '../../../lib/programs/Token.js';
import { ProgramDataExtend, ProgramDataInsert, ProgramDataRemove, ProgramFieldValue, ProgramMetadataExtend, ProgramMetadataInsert, ProgramMetadataRemove, } from '../../../lib/programs/Program.js';
import { THIS } from '../../../lib/consts.js';
import { bigIntToHexString } from '../../../lib/utils.js';
import { ProgramField, ProgramUpdate, ProgramUpdateField, } from '../../../lib/programs/Program.js';
import { Address, AddressOrNamespace } from '../../../lib/programs/Address-Namespace.js';
export function buildBurnInstruction({ from, caller, programId, tokenAddress, amount, }) {
    return new BurnInstructionBuilder()
        .setProgramId(new AddressOrNamespace(new Address(programId)))
        .setCaller(new Address(caller))
        .setTokenAddress(new Address(tokenAddress))
        .setBurnFromAddress(new AddressOrNamespace(new Address(from)))
        .setAmount(bigIntToHexString(BigInt(amount)))
        .build();
}
export function buildCreateInstruction({ programId, initializedSupply, totalSupply, programOwner, programNamespace, distributionInstruction, }) {
    const instructionBuilder = new CreateInstructionBuilder()
        .setProgramId(new AddressOrNamespace(new Address(programId)))
        .setProgramOwner(new Address(programOwner))
        .setProgramNamespace(new AddressOrNamespace(new Address(programNamespace)));
    if (initializedSupply !== undefined) {
        instructionBuilder.setInitializedSupply(bigIntToHexString(BigInt(initializedSupply)));
    }
    if (totalSupply !== undefined) {
        instructionBuilder.setTotalSupply(bigIntToHexString(BigInt(totalSupply)));
    }
    if (distributionInstruction !== undefined) {
        instructionBuilder.addTokenDistribution(distributionInstruction);
    }
    return instructionBuilder.build();
}
export function buildUpdateInstruction({ update, }) {
    return new UpdateInstructionBuilder().addUpdate(update).build();
}
export function buildTokenDistributionInstruction({ programId, initializedSupply, to, tokenUpdates, }) {
    const tokenDistributionBuilder = new TokenDistributionBuilder()
        .setProgramId(new AddressOrNamespace(new Address(programId)))
        .setAmount(bigIntToHexString(BigInt(initializedSupply)))
        .setReceiver(new AddressOrNamespace(new Address(to)));
    if (tokenUpdates) {
        tokenDistributionBuilder.extendUpdateFields(tokenUpdates);
    }
    return tokenDistributionBuilder.build();
}
export function buildMintInstructions({ from, programId, paymentTokenAddress, inputValue, returnedValue, }) {
    const transferToProgram = buildTransferInstruction({
        from: from,
        to: 'this',
        tokenAddress: paymentTokenAddress,
        amount: inputValue,
    });
    const transferToCaller = buildTransferInstruction({
        from: 'this',
        to: from,
        tokenAddress: programId,
        amount: returnedValue,
    });
    return [transferToProgram, transferToCaller];
}
export function buildTransferInstruction({ from, to, tokenAddress, amount, tokenIds, }) {
    const toAddressOrNamespace = new AddressOrNamespace(new Address(to));
    const fromAddressOrNamespace = new AddressOrNamespace(new Address(from));
    const tokenAddressOrNamespace = new Address(tokenAddress);
    const instructionBuilder = new TransferInstructionBuilder()
        .setTransferFrom(fromAddressOrNamespace)
        .setTransferTo(toAddressOrNamespace)
        .setTokenAddress(tokenAddressOrNamespace);
    if (tokenIds) {
        instructionBuilder.addTokenIds(tokenIds);
    }
    if (amount) {
        instructionBuilder.setAmount(bigIntToHexString(amount));
    }
    return instructionBuilder.build();
}
export function buildTokenUpdateField({ field, value, action, }) {
    let tokenFieldAction;
    if (value instanceof Array) {
        if (field === 'approvals') {
            tokenFieldAction = new ApprovalsExtend(value);
        }
        else {
            return new Error('Invalid field');
        }
    }
    else {
        if (field === 'metadata') {
            if (action === 'extend') {
                tokenFieldAction = new TokenMetadataExtend(JSON.parse(value));
            }
            else if (action === 'insert') {
                const [key, insertValue] = JSON.parse(value).split(':');
                tokenFieldAction = new TokenMetadataInsert(key, insertValue);
            }
            else if (action === 'remove') {
                tokenFieldAction = new TokenMetadataRemove(value);
            }
            else {
                return new Error('Invalid action');
            }
        }
        else if (field === 'status') {
            tokenFieldAction = new StatusValue(value);
        }
        else {
            return new Error('Invalid field');
        }
    }
    return new TokenUpdateField(new TokenField(field), new TokenFieldValue(field, tokenFieldAction));
}
export function buildProgramUpdateField({ field, value, action, }) {
    let programFieldAction;
    if (field === 'metadata') {
        if (action === 'extend') {
            programFieldAction = new ProgramMetadataExtend(JSON.parse(value));
        }
        else if (action === 'insert') {
            const [key, insertValue] = JSON.parse(value).split(':');
            programFieldAction = new ProgramMetadataInsert(key, insertValue);
        }
        else if (action === 'remove') {
            programFieldAction = new ProgramMetadataRemove(value);
        }
        else {
            return new Error('Invalid metadata action');
        }
    }
    else if (field === 'data') {
        if (action === 'extend') {
            programFieldAction = new ProgramDataExtend(JSON.parse(value));
        }
        else if (action === 'insert') {
            const [key, insertValue] = JSON.parse(value).split(':');
            programFieldAction = new ProgramDataInsert(key, insertValue);
        }
        else if (action === 'remove') {
            programFieldAction = new ProgramDataRemove(value);
        }
        else {
            return new Error('Invalid data action');
        }
    }
    else if (field === 'status') {
        programFieldAction = new StatusValue(value);
    }
    else {
        return new Error('Invalid field');
    }
    return new ProgramUpdateField(new ProgramField(field), new ProgramFieldValue(field, programFieldAction));
}
export function buildTokenMetadataUpdateInstruction({ transactionInputs, }) {
    const tokenUpdateField = buildTokenUpdateField({
        field: 'metadata',
        value: transactionInputs,
        action: 'extend',
    });
    if (tokenUpdateField instanceof Error) {
        throw tokenUpdateField;
    }
    return [tokenUpdateField];
}
export function buildProgramMetadataUpdateInstruction({ transactionInputs, }) {
    const programUpdateField = buildProgramUpdateField({
        field: 'metadata',
        value: transactionInputs,
        action: 'extend',
    });
    if (programUpdateField instanceof Error) {
        throw programUpdateField;
    }
    const programUpdates = [programUpdateField];
    return buildUpdateInstruction({
        update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)),
    });
}
