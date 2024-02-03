import { Contract } from './Contract.js';
import { BurnInstructionBuilder, CreateInstructionBuilder, TokenDistributionBuilder, TokenUpdateBuilder, TransferInstructionBuilder, } from '../builders.js';
import { AddressOrNamespace, TokenOrProgramUpdate } from '../utils.js';
import Address from '../Address.js';
import { Outputs } from '../Outputs.js';
import { TokenField, TokenFieldValue, TokenMetadataExtend, TokenUpdate, TokenUpdateField, } from '../Token.js';
import { bigIntToHexString } from '../../helpers.js';
import { ApprovalsExtend, ApprovalsValue } from '../Approvals.js';
/**
 * Class representing a fungible token contract, extending the base `Contract` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export class FungibleTokenContract extends Contract {
    /**
     * Constructs a new instance of the FungibleTokenContract class.
     */
    constructor() {
        super();
        this.methodStrategies = {
            approve: this.approve.bind(this),
            burn: this.burn.bind(this),
            create: this.create.bind(this),
            createAndDistribute: this.createAndDistribute.bind(this),
            mint: this.mint.bind(this),
        };
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
        const caller = new Address(transaction.from);
        const burnInstruction = new BurnInstructionBuilder()
            .setProgramId(new AddressOrNamespace('this'))
            .setCaller(caller)
            .setTokenAddress(new Address(transaction.programId))
            .setBurnFromAddress(new AddressOrNamespace(caller))
            .setAmount(bigIntToHexString(BigInt(transaction?.value ?? 0)))
            .build();
        return new Outputs(computeInputs, [burnInstruction]).toJson();
    }
    create(computeInputs) {
        const { transaction } = computeInputs;
        const { transactionInputs } = transaction;
        const caller = new Address(transaction.from);
        const createInstruction = new CreateInstructionBuilder()
            .setProgramId(new AddressOrNamespace('this'))
            .setTotalSupply(bigIntToHexString(BigInt(JSON.parse(transactionInputs).totalSupply)))
            .setInitializedSupply(bigIntToHexString(BigInt(0)))
            .setProgramOwner(caller)
            .setProgramNamespace(new AddressOrNamespace('this'))
            .build();
        return new Outputs(computeInputs, [createInstruction]).toJson();
    }
    createAndDistribute(computeInputs) {
        const { transaction } = computeInputs;
        const { transactionInputs } = transaction;
        const caller = new Address(transaction.from);
        const update = new TokenUpdateField(new TokenField('metadata'), new TokenFieldValue('metadata', new TokenMetadataExtend(JSON.parse(transactionInputs))));
        const totalSupply = JSON.parse(transactionInputs)?.totalSupply ?? 0;
        const initalizedSupply = transaction?.value ?? 0;
        const initUpdates = [update];
        const initDistribution = new TokenDistributionBuilder()
            .setProgramId(new AddressOrNamespace('this'))
            .setAmount(bigIntToHexString(BigInt(initalizedSupply)))
            .setReceiver(new AddressOrNamespace(caller))
            .extendUpdateFields(initUpdates)
            .build();
        const createInstruction = new CreateInstructionBuilder()
            .setProgramId(new AddressOrNamespace('this'))
            .setTotalSupply(bigIntToHexString(BigInt(totalSupply)))
            .setInitializedSupply(bigIntToHexString(BigInt(initalizedSupply)))
            .setProgramOwner(caller)
            .setProgramNamespace(new AddressOrNamespace('this'))
            .addTokenDistribution(initDistribution)
            .build();
        return new Outputs(computeInputs, [createInstruction]).toJson();
    }
    mint(computeInputs) {
        const { transaction } = computeInputs;
        const caller = new Address(transaction.from);
        const payable = BigInt(transaction?.value ?? 0);
        const payableToken = new Address(transaction.programId);
        const minter = transaction.to;
        const amount = bigIntToHexString(payable / BigInt('0x1'));
        const transferTo = new TransferInstructionBuilder()
            .setTransferFrom(new AddressOrNamespace('this'))
            .setTransferTo(new AddressOrNamespace(caller))
            .setAmount(amount)
            .setTokenAddress(new Address(minter))
            .build();
        const transferFrom = new TransferInstructionBuilder()
            .setTransferFrom(new AddressOrNamespace(caller))
            .setTransferTo(new AddressOrNamespace('this'))
            .setAmount(bigIntToHexString(payable))
            .setTokenAddress(payableToken)
            .build();
        return new Outputs(computeInputs, [transferTo, transferFrom]).toJson();
    }
}
