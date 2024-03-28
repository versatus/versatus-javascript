import { buildBurnInstruction, buildCreateInstruction, buildMintInstructions, buildProgramUpdateField, buildTokenDistributionInstruction, buildTokenUpdateField, buildUpdateInstruction, } from './lib/programs/instruction-builders/builder-helpers.js';
import { THIS, } from './lib/consts.js';
import { Program, ProgramUpdate, } from './lib/programs/Program.js';
import { Address, AddressOrNamespace, } from './lib/programs/Address-Namespace.js';
import { ApprovalsExtend, ApprovalsValue, TokenField, TokenFieldValue, TokenOrProgramUpdate, TokenUpdate, TokenUpdateField, } from './lib/programs/Token.js';
import { TokenUpdateBuilder } from './lib/programs/instruction-builders/builders.js';
import { Outputs } from './lib/programs/Outputs.js';
import { checkIfValuesAreUndefined, formatAmountToHex, validate, validateAndCreateJsonString, } from './lib/utils.js';
class VerseTokenProgram extends Program {
    constructor() {
        super();
        Object.assign(this.methodStrategies, {
            approve: this.approve.bind(this),
            burn: this.burn.bind(this),
            create: this.create.bind(this),
            mint: this.mint.bind(this),
        });
    }
    approve(computeInputs) {
        try {
            const { transaction } = computeInputs;
            const { transactionInputs, programId } = transaction;
            const tokenId = new AddressOrNamespace(new Address(programId));
            const caller = new Address(transaction.from);
            const update = new TokenUpdateField(new TokenField('approvals'), new TokenFieldValue('insert', new ApprovalsValue(new ApprovalsExtend([JSON.parse(transactionInputs)]))));
            const tokenUpdate = new TokenUpdate(new AddressOrNamespace(caller), tokenId, [update]);
            const tokenOrProgramUpdate = new TokenOrProgramUpdate('tokenUpdate', tokenUpdate);
            const updateInstruction = new TokenUpdateBuilder()
                .addTokenAddress(tokenId)
                .addUpdateField(tokenOrProgramUpdate)
                .build();
            return new Outputs(computeInputs, [updateInstruction]).toJson();
        }
        catch (e) {
            throw e;
        }
    }
    burn(computeInputs) {
        try {
            const { transaction } = computeInputs;
            const { from, programId, value } = transaction;
            checkIfValuesAreUndefined({ from, programId, value });
            const burnInstruction = buildBurnInstruction({
                from: from,
                caller: from,
                programId: THIS,
                tokenAddress: programId,
                amount: value,
            });
            return new Outputs(computeInputs, [burnInstruction]).toJson();
        }
        catch (e) {
            throw e;
        }
    }
    create(computeInputs) {
        try {
            const { transaction } = computeInputs;
            const { transactionInputs, from, to } = transaction;
            const txInputs = validate(JSON.parse(transactionInputs), 'unable to parse transactionInputs');
            // metadata
            const totalSupply = txInputs?.totalSupply;
            const initializedSupply = txInputs?.initializedSupply;
            const symbol = txInputs?.symbol;
            const name = txInputs?.name;
            const recipientAddress = txInputs?.to ?? transaction.to;
            const metadataStr = validateAndCreateJsonString({
                symbol,
                name,
                totalSupply: formatAmountToHex(totalSupply),
            });
            // data
            const imgUrl = txInputs?.imgUrl;
            const paymentProgramAddress = txInputs?.paymentProgramAddress;
            const conversionRate = txInputs?.conversionRate;
            const methods = 'approve,create,burn,mint,update';
            const dataStr = validateAndCreateJsonString({
                type: 'fungible',
                imgUrl,
                paymentProgramAddress,
                conversionRate,
                methods,
            });
            const addTokenMetadata = buildTokenUpdateField({
                field: 'metadata',
                value: metadataStr,
                action: 'extend',
            });
            const addTokenData = buildTokenUpdateField({
                field: 'data',
                value: dataStr,
                action: 'extend',
            });
            const addProgramData = buildProgramUpdateField({
                field: 'data',
                value: dataStr,
                action: 'extend',
            });
            const distributionInstruction = buildTokenDistributionInstruction({
                programId: THIS,
                initializedSupply: formatAmountToHex(initializedSupply),
                to: recipientAddress ?? to,
                tokenUpdates: [addTokenMetadata, addTokenData],
            });
            const createAndDistributeInstruction = buildCreateInstruction({
                from,
                initializedSupply: formatAmountToHex(initializedSupply),
                totalSupply,
                programId: THIS,
                programOwner: from,
                programNamespace: THIS,
                distributionInstruction,
            });
            const addProgramMetadata = buildProgramUpdateField({
                field: 'metadata',
                value: metadataStr,
                action: 'extend',
            });
            const programUpdateInstruction = buildUpdateInstruction({
                update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), [
                    addProgramMetadata,
                    addProgramData,
                ])),
            });
            return new Outputs(computeInputs, [
                createAndDistributeInstruction,
                programUpdateInstruction,
            ]).toJson();
        }
        catch (e) {
            throw e;
        }
    }
    mint(computeInputs) {
        try {
            const { transaction } = computeInputs;
            const currProgramInfo = validate(computeInputs.accountInfo?.programs[transaction.to], 'token missing from self...');
            const tokenData = validate(currProgramInfo?.data, 'token missing required data to mint...');
            const paymentProgramAddress = tokenData.paymentProgramAddress;
            const inputValue = BigInt(transaction.value);
            const conversionRate = tokenData.conversionRate;
            const returnedValue = BigInt(inputValue.toString()) * BigInt(conversionRate.toString());
            checkIfValuesAreUndefined({
                paymentProgramAddress,
                inputValue,
                conversionRate,
                returnedValue,
            });
            const mintInstructions = buildMintInstructions({
                from: transaction.from,
                programId: transaction.programId,
                paymentTokenAddress: paymentProgramAddress,
                inputValue: inputValue,
                returnedValue: returnedValue,
            });
            return new Outputs(computeInputs, mintInstructions).toJson();
        }
        catch (e) {
            throw e;
        }
    }
}
const start = (input) => {
    try {
        const contract = new VerseTokenProgram();
        return contract.start(input);
    }
    catch (e) {
        throw e;
    }
};
process.stdin.setEncoding('utf8');
let data = '';
process.stdin.on('readable', () => {
    try {
        let chunk;
        while ((chunk = process.stdin.read()) !== null) {
            data += chunk;
        }
    }
    catch (e) {
        throw e;
    }
});
process.stdin.on('end', () => {
    try {
        const parsedData = JSON.parse(data);
        const result = start(parsedData);
        process.stdout.write(JSON.stringify(result));
    }
    catch (err) {
        // @ts-ignore
        process.stdout.write(err.message);
    }
});
