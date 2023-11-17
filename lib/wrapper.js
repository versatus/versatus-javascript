import start from '/Users/andrewhathaway/code/versatus/js-contract-test/example-contract.js';
import { parseContractInput, sendOutput } from './versatus.js'

function main() {
  const input = parseContractInput()
  const result = start(input)
  sendOutput(result)
}

main()
