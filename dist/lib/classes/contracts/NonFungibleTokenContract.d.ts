import { Contract } from './Contract';
import { ComputeInputs } from '../../types';
/**
 * Class representing a non-fungible token contract, extending the base `Contract` class.
 * It encapsulates the core functionality and properties of a non-fungible token (ERC721-like).
 */
export declare class NonFungibleTokenContract extends Contract {
    constructor();
    create(computeInputs: ComputeInputs): object;
    mint(computeInputs: ComputeInputs): object;
}
