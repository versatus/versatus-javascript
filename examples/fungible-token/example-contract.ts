import { FungibleTokenContract } from '../../lib/classes/contracts/FungibleTokenContract'
import { ComputeInputs } from '../../lib'

const start = (input: ComputeInputs) => {
  const contract = new FungibleTokenContract()
  return contract.start(input)
}

export default start
