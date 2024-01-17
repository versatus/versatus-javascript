import { ERC20Contract } from '../../lib/contracts'
import { Input } from '../../lib/types'

const ERC_20_CONTRACT_NAME = 'Versatus ERC20'
const ERC_20_CONTRACT_SYMBOL = 'VRSTSERC'
const ERC_20_CONTRACT_DECIMALS = 18
const ERC_20_CONTRACT_TOTAL_SUPPLY = 100000000

const start = (input: Input) => {
  const contract = new ERC20Contract(
    ERC_20_CONTRACT_NAME,
    ERC_20_CONTRACT_SYMBOL,
    ERC_20_CONTRACT_DECIMALS,
    ERC_20_CONTRACT_TOTAL_SUPPLY
  )
  return contract.start(input)
}

export default start
