import { Program } from './Program';
import { ComputeInputs } from '../../types';
/**
 * Class representing a fungible token contract, extending the base `Contract` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export declare class FungibleTokenContract extends Program {
    /**
     * Constructs a new instance of the FungibleTokenContract class.
     */
    constructor();
    approve(computeInputs: ComputeInputs): object;
    burn(computeInputs: ComputeInputs): object;
    create(computeInputs: ComputeInputs): object;
    createAndDistribute(computeInputs: ComputeInputs): object;
    mint(computeInputs: ComputeInputs): object;
}
