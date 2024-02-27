import { Program } from './Program.js';
import { TokenUpdateBuilder } from '../builders.js';
import { AddressOrNamespace, TokenOrProgramUpdate } from '../utils.js';
import Address from '../Address.js';
import { Outputs } from '../Outputs.js';
import { TokenField, TokenFieldValue, TokenUpdate, TokenUpdateField, } from '../Token.js';
import { buildBurnInstruction, buildCreateInstruction, buildMintInstructions, buildTokenUpdateField, buildTokenDistributionInstruction, buildProgramUpdateField, buildUpdateInstruction, } from '../../builders.js';
import { ApprovalsExtend, ApprovalsValue } from '../Approvals.js';
import { ETH_PROGRAM_ADDRESS, THIS } from '../../consts.js';
import { ProgramUpdate } from '../Program.js';
import { formatVerse } from '../../utils.js';
/**
 * Class representing a fungible token program, extending the base `Program` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export class FungibleTokenProgram extends Program {
    /**
     * Constructs a new instance of the FungibleTokenProgram class.
     */
    constructor() {
        super();
        Object.assign(this.methodStrategies, {
            approve: this.approve.bind(this),
            burn: this.burn.bind(this),
            create: this.create.bind(this),
            createAndDistribute: this.createAndDistribute.bind(this),
            mint: this.mint.bind(this),
        });
    }
    approve(computeInputs) {
        const { transaction } = computeInputs;
        const { transactionInputs, programId } = transaction;
        const tokenId = new AddressOrNamespace(new Address(programId));
        const caller = new Address(transaction.from);
        // const jsonInput =
        //   '{"spender":"0x1a2b3c4d5e6f70819293a4b5c6d7e8f9","value":"0x1"}'
        const parsedInput = JSON.parse(transactionInputs);
        const itemsArray = [
            new Address(parsedInput.spender),
            parsedInput.value,
        ];
        const update = new TokenUpdateField(new TokenField('approvals'), new TokenFieldValue('extend', new ApprovalsValue(new ApprovalsExtend([itemsArray]))));
        const tokenUpdate = new TokenUpdate(new AddressOrNamespace(caller), tokenId, [update]);
        const tokenOrProgramUpdate = new TokenOrProgramUpdate('tokenUpdate', tokenUpdate);
        const updateInstruction = new TokenUpdateBuilder()
            .addTokenAddress(tokenId)
            .addUpdateField(tokenOrProgramUpdate)
            .build();
        return new Outputs(computeInputs, [updateInstruction]).toJson();
    }
    burn(computeInputs) {
        const { transaction } = computeInputs;
        const burnInstruction = buildBurnInstruction({
            from: transaction.from,
            caller: transaction.from,
            programId: THIS,
            tokenAddress: transaction.programId,
            amount: transaction.value,
        });
        return new Outputs(computeInputs, [burnInstruction]).toJson();
    }
    create(computeInputs) {
        const { transaction } = computeInputs;
        const { transactionInputs } = transaction;
        const initializedSupply = JSON.parse(transactionInputs)?.initializedSupply ?? '0';
        const totalSupply = JSON.parse(transactionInputs)?.totalSupply ?? '0';
        const createInstruction = buildCreateInstruction({
            from: transaction.from,
            initializedSupply: initializedSupply,
            totalSupply: totalSupply,
            programId: THIS,
            programOwner: transaction.from,
            programNamespace: THIS,
        });
        return new Outputs(computeInputs, [createInstruction]).toJson();
    }
    createAndDistribute(computeInputs) {
        const { transaction } = computeInputs;
        const { transactionInputs, from } = transaction;
        const parsedInputMetadata = JSON.parse(transactionInputs);
        const totalSupply = formatVerse(parsedInputMetadata?.totalSupply) ?? '0';
        const initializedSupply = formatVerse(parsedInputMetadata?.initializedSupply) ?? '0';
        const to = parsedInputMetadata?.to ?? from;
        const tokenUpdateField = buildTokenUpdateField({
            field: 'metadata',
            value: transactionInputs,
            action: 'extend',
        });
        if (tokenUpdateField instanceof Error) {
            throw tokenUpdateField;
        }
        const programUpdateField = buildProgramUpdateField({
            field: 'metadata',
            value: transactionInputs,
            action: 'extend',
        });
        if (programUpdateField instanceof Error) {
            throw programUpdateField;
        }
        const programUpdates = [programUpdateField];
        const programMetadataUpdateInstruction = buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)),
        });
        const tokenUpdates = [tokenUpdateField];
        const distributionInstruction = buildTokenDistributionInstruction({
            programId: THIS,
            initializedSupply,
            to,
            tokenUpdates,
        });
        const createAndDistributeInstruction = buildCreateInstruction({
            from,
            initializedSupply,
            totalSupply,
            programId: THIS,
            programOwner: from,
            programNamespace: THIS,
            distributionInstruction,
        });
        return new Outputs(computeInputs, [
            createAndDistributeInstruction,
            programMetadataUpdateInstruction,
        ]).toJson();
    }
    mint(computeInputs) {
        const { transaction } = computeInputs;
        const inputTokenAddress = ETH_PROGRAM_ADDRESS;
        const paymentValue = BigInt(transaction?.value);
        const conversionRate = BigInt(2);
        const returnedValue = paymentValue / conversionRate;
        const mintInstructions = buildMintInstructions({
            from: transaction.from,
            programId: transaction.programId,
            paymentTokenAddress: inputTokenAddress,
            paymentValue: paymentValue,
            returnedValue: returnedValue,
        });
        return new Outputs(computeInputs, mintInstructions).toJson();
    }
}
