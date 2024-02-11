import { BurnInstructionBuilder, CreateInstructionBuilder, TokenDistributionBuilder, TransferInstructionBuilder, } from './classes/builders.js';
import { AddressOrNamespace, StatusValue } from './classes/utils.js';
import Address from './classes/Address.js';
import { TokenField, TokenFieldValue, TokenMetadataExtend, TokenMetadataInsert, TokenMetadataRemove, TokenUpdateField, } from './classes/Token.js';
export function bigIntToHexString(bigintValue) {
    let hexString = bigintValue.toString(16);
    hexString = hexString.padStart(64, '0');
    return '0x' + hexString;
}
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
    if (distributionInstruction) {
        return new CreateInstructionBuilder()
            .setProgramId(new AddressOrNamespace(new Address(programId)))
            .setTotalSupply(bigIntToHexString(BigInt(totalSupply)))
            .setInitializedSupply(bigIntToHexString(BigInt(initializedSupply)))
            .addTokenDistribution(distributionInstruction)
            .setProgramOwner(new Address(programOwner))
            .setProgramNamespace(new AddressOrNamespace(new Address(programNamespace)))
            .build();
    }
    return new CreateInstructionBuilder()
        .setProgramId(new AddressOrNamespace(new Address(programId)))
        .setTotalSupply(bigIntToHexString(BigInt(totalSupply)))
        .setInitializedSupply(bigIntToHexString(BigInt(initializedSupply)))
        .setProgramOwner(new Address(programOwner))
        .setProgramNamespace(new AddressOrNamespace(new Address(programNamespace)))
        .build();
}
export function buildTokenDistributionInstruction({ programId, initializedSupply, caller, tokenUpdates, }) {
    return new TokenDistributionBuilder()
        .setProgramId(new AddressOrNamespace(new Address(programId)))
        .setAmount(bigIntToHexString(BigInt(initializedSupply)))
        .setReceiver(new AddressOrNamespace(new Address(caller)))
        .extendUpdateFields(tokenUpdates)
        .build();
}
export function buildMintInstructions({ from, programId, paymentTokenAddress, paymentValue, returnedValue, }) {
    const transferToProgram = buildTransferInstruction({
        from: from,
        to: 'this',
        tokenAddress: paymentTokenAddress,
        amount: paymentValue,
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
    if (tokenIds) {
        return new TransferInstructionBuilder()
            .setTransferFrom(fromAddressOrNamespace)
            .setTransferTo(toAddressOrNamespace)
            .setTokenAddress(tokenAddressOrNamespace)
            .addTokenIds(tokenIds)
            .build();
    }
    return new TransferInstructionBuilder()
        .setTransferFrom(fromAddressOrNamespace)
        .setTransferTo(toAddressOrNamespace)
        .setAmount(bigIntToHexString(amount))
        .setTokenAddress(tokenAddressOrNamespace)
        .build();
}
export function buildTokenUpdateField({ field, value, action, }) {
    let tokenFieldAction;
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
    return new TokenUpdateField(new TokenField(field), new TokenFieldValue(field, tokenFieldAction));
}
