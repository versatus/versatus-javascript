import { Instruction } from '@/lib/programs/Instruction'

import { IComputeInputs } from '@/lib/interfaces'

export class Outputs {
  private inputs: IComputeInputs | null
  private instructions: Instruction[]

  constructor(inputs: IComputeInputs | null, instructions: Instruction[]) {
    this.inputs = inputs
    this.instructions = instructions
  }

  toJson(): object {
    return {
      computeInputs: this.inputs,
      instructions: this.instructions.map((instruction) =>
        instruction.toJson()
      ),
    }
  }
}
