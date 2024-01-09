import start from '/Users/andrewhathaway/code/versatus/versatus-javascript/example-contract.js';
import { parseContractInput, sendOutput } from '/Users/andrewhathaway/code/versatus/versatus-javascript/lib/versatus.js'

function main() {
  const input = parseContractInput()
  const result = start(input)
  sendOutput(result)
}

main()
