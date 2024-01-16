import start from '../examples/basic/example-contract.js';
import { parseContractInput, sendOutput } from './versatus.js';
function main() {
    var input = parseContractInput();
    var result = start(input);
    sendOutput(result);
}
main();
