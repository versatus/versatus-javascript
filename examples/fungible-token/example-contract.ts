import { FungibleTokenContract } from '../../lib/classes/contracts/FungibleTokenContract'
import { Inputs } from '../../lib'

const start = (input: Inputs) => {
  const contract = new FungibleTokenContract()
  return contract.start(input)
}

export default start
