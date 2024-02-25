import { Program } from './Program';
import { ComputeInputs } from '../../types';
/**
 * Class representing a fungible token program, extending the base `Program` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export declare class SnakeProgram extends Program {
    /**
     * Constructs a new instance of the FungibleTokenProgram class.
     */
    constructor();
    burn(computeInputs: ComputeInputs): object;
    create(computeInputs: ComputeInputs): object;
    createAndDistribute(computeInputs: ComputeInputs): object;
    mint(computeInputs: ComputeInputs): object;
}
