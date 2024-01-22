import start from '../examples/fungible-token/example-contract'
import { parseContractInput, sendOutput } from './versatus'

function main() {
  const input = parseContractInput()
  const result = start(input)
  sendOutput(result)
}

main()
