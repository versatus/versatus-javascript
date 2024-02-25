import { FaucetProgram } from '../../lib/classes/programs/FaucetProgram'
import { ComputeInputs } from '../../lib'

const start = (input: ComputeInputs) => {
  const contract = new FaucetProgram()
  return contract.start(input)
}

export default start
