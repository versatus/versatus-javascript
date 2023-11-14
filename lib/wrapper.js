import { parseContractInput, sendOutput } from './versatus.js'
import start from '../example-contract.js'

function main() {
  const input = parseContractInput()
  const result = start(input)
  sendOutput(result)
}

main()
