import { Program } from '../../../lib/classes/programs/Program.js';
import { TokenUpdateBuilder } from '../../../lib/classes/builders.js';
import { AddressOrNamespace, TokenOrProgramUpdate } from '../../../lib/classes/utils.js';
import Address from '../../../lib/classes/Address.js';
import { Outputs } from '../../../lib/classes/Outputs.js';
import { TokenField, TokenFieldValue, TokenUpdate, TokenUpdateField, } from '../../../lib/classes/Token.js';
import { buildBurnInstruction, buildMintInstructions } from '../../../lib/builders.js';
import { ApprovalsExtend, ApprovalsValue } from '../../../lib/classes/Approvals.js';
import { ETH_PROGRAM_ADDRESS, THIS } from '../../../lib/consts.js';
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
            mint: this.mint.bind(this),
        });
    }
    approve(computeInputs) {
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
