import { SnakeProgram } from '../../lib/classes/programs/SnakeProgram'
import { ComputeInputs } from '../../lib'

const start = (input: ComputeInputs) => {
  const contract = new SnakeProgram()
  return contract.start(input)
}

export default start
