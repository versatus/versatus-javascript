import start from '../examples/fungible-token/example-contract.js';
import { parseContractInput, sendOutput } from './versatus.js';
function main() {
    const input = parseContractInput();
    const result = start(input);
    sendOutput(result);
}
main();
