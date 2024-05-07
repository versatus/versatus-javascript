import { Program } from '../../src/lib/programs/Program'

import { IComputeInputs } from '../../src'
/**
 * Class representing a faucet program, extending the base `Program` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export declare class FaucetProgram extends Program {
  /**
   * Constructs a new instance of the FungibleTokenProgram class.
   */
  constructor()
  addProgram(computeInputs: IComputeInputs): object
  create(computeInputs: IComputeInputs): object
  faucet(computeInputs: IComputeInputs): object
}
