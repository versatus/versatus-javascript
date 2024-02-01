import { FungibleTokenContract } from '../lib/classes/contracts/FungibleTokenContract'

import approveInputJson from '../examples/fungible-token/inputs/lasr-fungible-token-approve.json' assert { type: 'json' }
import createInputJson from '../examples/fungible-token/inputs/lasr-fungible-token-create.json' assert { type: 'json' }
import mintInputJson from '../examples/fungible-token/inputs/lasr-fungible-token-mint.json' assert { type: 'json' }

const fungibleTokenTest = new FungibleTokenContract()
console.log('\n\n=/=/=/=/=/=/=/=/=/=/=/=/=/=/=\n\n')
console.log(
  JSON.stringify(fungibleTokenTest.approve(approveInputJson), null, 2)
)
console.log('\n\n=/=/=/=/=/=/=/=/=/=/=/=/=/=/=\n\n')
console.log(JSON.stringify(fungibleTokenTest.create(createInputJson)))
console.log('\n\n=/=/=/=/=/=/=/=/=/=/=/=/=/=/=\n\n')
console.log(JSON.stringify(fungibleTokenTest.mint(mintInputJson)))
console.log('TEST COMPLETE')
