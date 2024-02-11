import { Contract } from './Contract';
import { ComputeInputs } from '../../types';
export declare const THIS = "this";
/**
 * Class representing a fungible token contract, extending the base `Contract` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export declare class FungibleTokenContract extends Contract {
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
