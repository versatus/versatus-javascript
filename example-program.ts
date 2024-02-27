import { FungibleTokenProgram } from './lib/classes/programs/FungibleTokenProgram'
import { ComputeInputs } from './lib/types'

const start = (input: ComputeInputs) => {
  const contract = new FungibleTokenProgram()
  return contract.start(input)
}

export default start
