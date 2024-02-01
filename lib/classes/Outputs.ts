import { Instruction } from './Instruction'
import { Inputs } from '../types'

export class Outputs {
  private inputs: Inputs | null
  private instructions: Instruction[]

  constructor(inputs: Inputs | null, instructions: Instruction[]) {
    this.inputs = inputs
    this.instructions = instructions
  }

  toJson(): object {
    return {
      inputs: this.inputs,
      instructions: this.instructions.map((instruction) =>
        instruction.toJson()
      ),
    }
  }
}
