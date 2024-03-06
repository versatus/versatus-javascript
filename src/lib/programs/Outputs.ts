import { Instruction } from '@/lib/programs/Instruction'
import { ComputeInputs } from '@/lib/types'

export class Outputs {
  private inputs: ComputeInputs | null
  private instructions: Instruction[]

  constructor(inputs: ComputeInputs | null, instructions: Instruction[]) {
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
