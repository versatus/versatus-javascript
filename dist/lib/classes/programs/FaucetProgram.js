import { Program } from './Program.js';
import { Outputs } from '../Outputs.js';
import { buildCreateInstruction, buildTransferInstruction, buildProgramUpdateField, buildUpdateInstruction, } from '../../builders.js';
import { THIS } from '../../consts.js';
import { AddressOrNamespace, TokenOrProgramUpdate } from '../utils.js';
import { ProgramUpdate } from '../Program.js';
import { formatVerse } from '../../utils.js';
/**
 * Class representing a fungible token program, extending the base `Program` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export class FaucetProgram extends Program {
    /**
     * Constructs a new instance of the FungibleTokenProgram class.
     */
    constructor() {
        super();
        Object.assign(this.methodStrategies, {
            addProgram: this.addProgram.bind(this),
            create: this.create.bind(this),
            faucet: this.faucet.bind(this),
        });
    }
    addProgram(computeInputs) {
        const { transaction, accountInfo } = computeInputs;
        const { transactionInputs, from } = transaction;
        const parsedTransactionInput = JSON.parse(transactionInputs);
        const programAddressToFaucet = parsedTransactionInput?.programAddressToFaucet;
        const depositAmount = BigInt(transaction.value);
        const transferToProgram = buildTransferInstruction({
            from: from,
            to: 'this',
            tokenAddress: programAddressToFaucet,
            amount: depositAmount,
        });
        const supportedProgramsStr = accountInfo?.programAccountData.programs;
        if (!supportedProgramsStr) {
            throw new Error('Faucet not created yet');
        }
        const programsMap = JSON.parse(supportedProgramsStr);
        if (!programsMap) {
            throw new Error('Programs Object not found. Have you created the Faucet yet?');
        }
        const faucetRecipientsUpdate = buildProgramUpdateField({
            field: 'data',
            value: JSON.stringify({
                programs: JSON.stringify({
                    [programAddressToFaucet]: JSON.stringify({
                        recipients: JSON.stringify({}),
                    }),
                }),
            }),
            action: 'extend',
        });
        if (faucetRecipientsUpdate instanceof Error) {
            throw faucetRecipientsUpdate;
        }
        const programUpdates = [faucetRecipientsUpdate];
        const programDataUpdateInstruction = buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)),
        });
        return new Outputs(computeInputs, [
            transferToProgram,
            programDataUpdateInstruction,
        ]).toJson();
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
        const faucetRecipientsInit = buildProgramUpdateField({
            field: 'data',
            value: JSON.stringify({
                programs: JSON.stringify({}),
            }),
            action: 'extend',
        });
        if (faucetRecipientsInit instanceof Error) {
            throw faucetRecipientsInit;
        }
        const createSupportedProgramsAndRecipientsUpdateInstruction = buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), [
                faucetRecipientsInit,
            ])),
        });
        return new Outputs(computeInputs, [
            createInstruction,
            createSupportedProgramsAndRecipientsUpdateInstruction,
        ]).toJson();
    }
    faucet(computeInputs) {
        const { transaction, accountInfo } = computeInputs;
        const { transactionInputs, from } = transaction;
        const parsedInputMetadata = JSON.parse(transactionInputs);
        const amountToFaucet = BigInt(formatVerse('1'));
        const to = parsedInputMetadata?.to;
        const programAddressToFaucet = parsedInputMetadata?.programAddressToFaucet ?? transaction.programId;
        const transferToCaller = buildTransferInstruction({
            from: 'this',
            to: to,
            tokenAddress: programAddressToFaucet,
            amount: amountToFaucet,
        });
        const supportedProgramsStr = accountInfo?.programAccountData.programs;
        if (!supportedProgramsStr) {
            throw new Error('No programs found');
        }
        const programsMap = JSON.parse(supportedProgramsStr);
        if (!programsMap) {
            throw new Error('Requested program not found');
        }
        const desiredProgramMap = JSON.parse(programsMap[programAddressToFaucet]);
        if (!desiredProgramMap) {
            throw new Error('Desired program not found');
        }
        const recipients = desiredProgramMap.recipients;
        const faucetRecipientCanClaim = canClaimTokens(to, recipients);
        if (!faucetRecipientCanClaim) {
            throw new Error('Too soon to claim tokens.');
        }
        const currentTime = new Date().getTime();
        const faucetRecipientsUpdate = buildProgramUpdateField({
            field: 'data',
            value: JSON.stringify({
                programs: JSON.stringify({
                    [programAddressToFaucet]: JSON.stringify({
                        recipients: JSON.stringify({ [to]: currentTime }),
                    }),
                }),
            }),
            action: 'extend',
        });
        if (faucetRecipientsUpdate instanceof Error) {
            throw faucetRecipientsUpdate;
        }
        const programUpdates = [faucetRecipientsUpdate];
        const programDataUpdateInstruction = buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)),
        });
        return new Outputs(computeInputs, [
            transferToCaller,
            programDataUpdateInstruction,
        ]).toJson();
    }
}
function canClaimTokens(recipientAddress, recipients) {
    const currentTime = new Date().getTime();
    const lastClaimTime = recipients[recipientAddress];
    if (lastClaimTime === undefined) {
        return true;
    }
    const oneHour = 60 * 1000;
    const timeSinceLastClaim = currentTime - lastClaimTime;
    return timeSinceLastClaim >= oneHour;
}
