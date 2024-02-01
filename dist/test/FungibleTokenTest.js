import { FungibleTokenContract } from '../lib/classes/contracts/FungibleTokenContract.js';
import mintInputJson from '../examples/fungible-token/inputs/lasr-fungible-token-mint.json' assert { type: 'json' };
import createInputJson from '../examples/fungible-token/inputs/lasr-fungible-token-create.json' assert { type: 'json' };
const fungibleTokenTest = new FungibleTokenContract();
console.log('TEST COMPLETE');
console.log('\n\n=/=/=/=/=/=/=/=/=/=/=/=/=/=/=\n\n');
console.log(JSON.stringify(fungibleTokenTest.create(createInputJson), null, 2));
console.log('\n\n=/=/=/=/=/=/=/=/=/=/=/=/=/=/=\n\n');
console.log(JSON.stringify(fungibleTokenTest.mint(mintInputJson), null, 2));
