import { Program } from '../../lib/classes/programs/Program.js';
import { Outputs } from '../../lib/classes/Outputs.js';
import { buildBurnInstruction, buildMintInstructions } from '../../lib/builders.js';
import { ETH_PROGRAM_ADDRESS, THIS } from '../../lib/consts.js';
/**
 * Class representing a snake program, extending the base `Program` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
class SnakeProgram extends Program {
    /**
     * Constructs a new instance of the FungibleTokenProgram class.
     */
    constructor() {
        super();
        Object.assign(this.methodStrategies, {
            burn: this.burn.bind(this),
            mint: this.mint.bind(this),
        });
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
const start = (input) => {
    const contract = new SnakeProgram();
    return contract.start(input);
};
process.stdin.setEncoding('utf8');
let data = '';
process.stdin.on('readable', () => {
    let chunk;
    while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
    }
});
process.stdin.on('end', () => {
    try {
        const parsedData = JSON.parse(data);
        const result = start(parsedData);
        process.stdout.write(JSON.stringify(result));
    }
    catch (err) {
        console.error('Failed to parse JSON input:', err);
    }
});
