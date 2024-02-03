import { Instruction } from './Instruction'
import { ComputeInputs } from '../types'

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
