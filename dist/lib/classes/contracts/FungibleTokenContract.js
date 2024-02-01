import { Contract } from './Contract.js';
import { CreateInstructionBuilder, TokenDistributionBuilder, TransferInstructionBuilder, } from '../builders.js';
import { AddressOrNamespace } from '../utils.js';
import Address from '../Address.js';
import { Outputs } from '../Outputs.js';
import { Instruction } from '../Instruction.js';
import { TokenField, TokenFieldValue, TokenMetadataExtend, TokenUpdateField, } from '../Token.js';
import { bigIntToHexString } from '../../helpers.js';
/**
 * Class representing a fungible token contract, extending the base `Contract` class.
 * It encapsulates the core functionality and properties of a fungible token.
 */
export class FungibleTokenContract extends Contract {
    /**
     * Constructs a new instance of the FungibleTokenContract class.
     */
    constructor() {
        super();
        this.methodStrategies = {
            create: this.create.bind(this),
            mint: this.mint.bind(this),
        };
    }
    create(inputs) {
        const { transaction } = inputs;
        const { inputs: createMetadata } = transaction;
        const caller = new Address(transaction.from);
        const update = new TokenUpdateField(new TokenField('metadata'), new TokenFieldValue('metadata', new TokenMetadataExtend(JSON.parse(createMetadata))));
        const initUpdates = [update];
        const initDistribution = new TokenDistributionBuilder()
            .setProgramId(new AddressOrNamespace('this'))
            .setAmount(bigIntToHexString(BigInt(transaction.value)))
            .setReceiver(new AddressOrNamespace(caller))
            .extendUpdateFields(initUpdates)
            .build();
        const create = new CreateInstructionBuilder()
            .setProgramId(new AddressOrNamespace('this'))
            .setTotalSupply(bigIntToHexString(BigInt(transaction.value)))
            .setInitializedSupply(bigIntToHexString(BigInt(transaction.value)))
            .setProgramOwner(caller)
            .setProgramNamespace(new AddressOrNamespace('this'))
            .addTokenDistribution(initDistribution)
            .build();
        const createInstruction = new Instruction('create', create);
        return new Outputs(inputs, [createInstruction]).toJson();
    }
    mint(inputs) {
        const { transaction } = inputs;
        const caller = new Address(transaction.from);
        const payable = BigInt(transaction.value);
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
        const transferToInstruction = new Instruction('transfer', transferTo);
        const transferFromInstruction = new Instruction('transfer', transferFrom);
        return new Outputs(inputs, [
            transferToInstruction,
            transferFromInstruction,
        ]).toJson();
    }
}
