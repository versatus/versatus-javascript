import { Program } from '../../lib/classes/programs/Program';
import { ComputeInputs } from '../../lib/types';
/**
 * Class representing a faucet program, extending the base `Program` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export declare class FaucetProgram extends Program {
    /**
     * Constructs a new instance of the FungibleTokenProgram class.
     */
    constructor();
    addProgram(computeInputs: ComputeInputs): object;
    create(computeInputs: ComputeInputs): object;
    faucet(computeInputs: ComputeInputs): object;
}
