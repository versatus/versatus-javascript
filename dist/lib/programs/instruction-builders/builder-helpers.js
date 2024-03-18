import { BurnInstructionBuilder, CreateInstructionBuilder, TokenDistributionBuilder, TransferInstructionBuilder, UpdateInstructionBuilder, } from '../../../lib/programs/instruction-builders/builders.js';
import { ApprovalsExtend, StatusValue, TokenDataExtend, TokenDataInsert, TokenDataRemove, TokenField, TokenFieldValue, TokenMetadataExtend, TokenMetadataInsert, TokenMetadataRemove, TokenOrProgramUpdate, TokenUpdate, TokenUpdateField, } from '../../../lib/programs/Token.js';
import { ProgramDataExtend, ProgramDataInsert, ProgramDataRemove, ProgramFieldValue, ProgramMetadataExtend, ProgramMetadataInsert, ProgramMetadataRemove, } from '../../../lib/programs/Program.js';
import { THIS } from '../../../lib/consts.js';
import { formatBigIntToHex, formatAmountToHex } from '../../../lib/utils.js';
import { ProgramField, ProgramUpdate, ProgramUpdateField, } from '../../../lib/programs/Program.js';
import { Address, AddressOrNamespace, } from '../../../lib/programs/Address-Namespace.js';
export function buildBurnInstruction({ from, caller, programId, tokenAddress, amount, }) {
    return new BurnInstructionBuilder()
        .setProgramId(new AddressOrNamespace(new Address(programId)))
        .setCaller(new Address(caller))
        .setTokenAddress(new Address(tokenAddress))
        .setBurnFromAddress(new AddressOrNamespace(new Address(from)))
        .setAmount(formatBigIntToHex(BigInt(amount)))
        .build();
}
export function buildCreateInstruction({ programId, initializedSupply, totalSupply, programOwner, programNamespace, distributionInstruction, }) {
    try {
        const instructionBuilder = new CreateInstructionBuilder()
            .setProgramId(new AddressOrNamespace(new Address(programId)))
            .setProgramOwner(new Address(programOwner))
            .setProgramNamespace(new AddressOrNamespace(new Address(programNamespace)));
        if (initializedSupply !== undefined) {
            instructionBuilder.setInitializedSupply(formatBigIntToHex(BigInt(initializedSupply)));
        }
        if (totalSupply !== undefined) {
            instructionBuilder.setTotalSupply(formatBigIntToHex(BigInt(totalSupply)));
        }
        if (distributionInstruction !== undefined) {
            instructionBuilder.addTokenDistribution(distributionInstruction);
        }
        return instructionBuilder.build();
    }
    catch (e) {
        throw e;
    }
}
export function buildUpdateInstruction({ update, }) {
    return new UpdateInstructionBuilder().addUpdate(update).build();
}
export function buildTokenDistributionInstruction({ programId, initializedSupply, to, tokenUpdates, nonFungible, }) {
    const tokenDistributionBuilder = new TokenDistributionBuilder()
        .setProgramId(new AddressOrNamespace(new Address(programId)))
        .setReceiver(new AddressOrNamespace(new Address(to)));
    if (!nonFungible) {
        tokenDistributionBuilder.setAmount(formatBigIntToHex(BigInt(initializedSupply)));
    }
    else {
        const tokenIds = [];
        for (let i = 1; i <= parseInt(initializedSupply); i++) {
            tokenIds.push(formatAmountToHex(i.toString()));
        }
        tokenDistributionBuilder.extendTokenIds(tokenIds);
    }
    if (tokenUpdates) {
        tokenDistributionBuilder.extendUpdateFields(tokenUpdates);
    }
    return tokenDistributionBuilder.build();
}
export function buildMintInstructions({ from, programId, paymentTokenAddress, inputValue, returnedTokenIds, returnedValue, }) {
    try {
        const transferToProgram = buildTransferInstruction({
            from: from,
            to: 'this',
            tokenAddress: paymentTokenAddress,
            amount: inputValue,
        });
        const mintTransferArguments = {
            from: 'this',
            to: from,
            tokenAddress: programId,
            amount: returnedValue,
        };
        if (returnedValue) {
            mintTransferArguments.amount = returnedValue;
        }
        else if (returnedTokenIds) {
            mintTransferArguments.tokenIds = returnedTokenIds;
        }
        else {
            throw new Error('invalid mint builder arguments. missing amount or tokenIds');
        }
        const transferToCaller = buildTransferInstruction(mintTransferArguments);
        return [transferToProgram, transferToCaller];
    }
    catch (e) {
        throw e;
    }
}
export function buildTransferInstruction({ from, to, tokenAddress, amount, tokenIds, }) {
    try {
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
            instructionBuilder.setAmount(formatBigIntToHex(amount));
        }
        return instructionBuilder.build();
    }
    catch (e) {
        throw e;
    }
}
export function buildTokenUpdateField({ field, value, action, }) {
    try {
        let tokenFieldAction;
        if (value instanceof Array) {
            if (field === 'approvals') {
                tokenFieldAction = new ApprovalsExtend(value);
            }
            else {
                throw new Error(`Invalid field: ${field}`);
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
                    throw new Error('Invalid action');
                }
            }
            else if (field === 'data') {
                if (action === 'extend') {
                    tokenFieldAction = new TokenDataExtend(JSON.parse(value));
                }
                else if (action === 'insert') {
                    const [key, insertValue] = JSON.parse(value).split(':');
                    tokenFieldAction = new TokenDataInsert(key, insertValue);
                }
                else if (action === 'remove') {
                    tokenFieldAction = new TokenDataRemove(value);
                }
                else {
                    throw new Error(`Invalid data action: ${action}`);
                }
            }
            else if (field === 'status') {
                tokenFieldAction = new StatusValue(value);
            }
            else {
                throw new Error(`Invalid field: ${field}`);
            }
        }
        return new TokenUpdateField(new TokenField(field), new TokenFieldValue(field, tokenFieldAction));
    }
    catch (e) {
        throw e;
    }
}
export function buildProgramUpdateField({ field, value, action, }) {
    try {
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
                throw new Error(`Invalid metadata action: ${action}`);
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
                throw new Error(`Invalid data action: ${action}`);
            }
        }
        else if (field === 'status') {
            programFieldAction = new StatusValue(value);
        }
        else {
            throw new Error(`Invalid field: ${field}`);
        }
        return new ProgramUpdateField(new ProgramField(field), new ProgramFieldValue(field, programFieldAction));
    }
    catch (e) {
        throw e;
    }
}
export function buildTokenMetadataUpdateInstruction({ accountAddress, tokenAddress, transactionInputs, }) {
    try {
        const tokenUpdateField = buildTokenUpdateField({
            field: 'metadata',
            value: transactionInputs,
            action: 'extend',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('tokenUpdate', new TokenUpdate(new AddressOrNamespace(accountAddress), new AddressOrNamespace(tokenAddress), [tokenUpdateField])),
        });
    }
    catch (e) {
        throw e;
    }
}
export function buildProgramMetadataUpdateInstruction({ transactionInputs, }) {
    try {
        const programUpdateField = buildProgramUpdateField({
            field: 'metadata',
            value: transactionInputs,
            action: 'extend',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), [programUpdateField])),
        });
    }
    catch (e) {
        throw e;
    }
}
export function buildProgramDataUpdateInstruction({ transactionInputs, }) {
    try {
        const programUpdateField = buildProgramUpdateField({
            field: 'metadata',
            value: transactionInputs,
            action: 'extend',
        });
        return buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), [programUpdateField])),
        });
    }
    catch (e) {
        throw e;
    }
}
