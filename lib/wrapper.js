import start from '/Users/andrewhathaway/code/versatus/versatus-javascript/examples/erc-20/example-erc20-contract.js';
import { parseContractInput, sendOutput } from './versatus.js'

function main() {
  const input = parseContractInput()
  const result = start(input)
  sendOutput(result)
}

main()
