import { Program } from '@/lib/classes/programs/Program'
import { ComputeInputs } from '@/lib/types'
import { Outputs } from '@/lib/classes/Outputs'

import { buildBurnInstruction, buildMintInstructions } from '@/lib/builders'
import { ETH_PROGRAM_ADDRESS, THIS } from '@/lib/consts'

/**
 * Class representing a snake program, extending the base `Program` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export class SnakeProgram extends Program {
  /**
   * Constructs a new instance of the FungibleTokenProgram class.
   */
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      burn: this.burn.bind(this),
      mint: this.mint.bind(this),
    })
  }

  burn(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const burnInstruction = buildBurnInstruction({
      from: transaction.from,
      caller: transaction.from,
      programId: THIS,
      tokenAddress: transaction.programId,
      amount: transaction.value,
    })

    return new Outputs(computeInputs, [burnInstruction]).toJson()
  }

  mint(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const inputTokenAddress = ETH_PROGRAM_ADDRESS
    const paymentValue = BigInt(transaction?.value)
    const conversionRate = BigInt(2)
    const returnedValue = paymentValue / conversionRate

    const mintInstructions = buildMintInstructions({
      from: transaction.from,
      programId: transaction.programId,
      paymentTokenAddress: inputTokenAddress,
      paymentValue: paymentValue,
      returnedValue: returnedValue,
    })

    return new Outputs(computeInputs, mintInstructions).toJson()
  }
}
