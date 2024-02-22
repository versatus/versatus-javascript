import { FungibleTokenProgram } from '../lib/classes/programs/FungibleTokenProgram'

import approveInputJson from '../examples/fungible-token/inputs/lasr-fungible-token-approve.json' assert { type: 'json' }
import burnInputJson from '../examples/fungible-token/inputs/lasr-fungible-token-burn.json' assert { type: 'json' }
import createInputJson from '../examples/fungible-token/inputs/lasr-fungible-token-create.json' assert { type: 'json' }
import createAndDistributeInputJson from '../examples/fungible-token/inputs/lasr-fungible-token-create-and-distribute.json' assert { type: 'json' }
import mintInputJson from '../examples/fungible-token/inputs/lasr-fungible-token-mint.json' assert { type: 'json' }
import updateInputJson from '../examples/fungible-token/inputs/lasr-fungible-token-update.json' assert { type: 'json' }

const fungibleTokenTest = new FungibleTokenProgram()
// console.log('\x1b[34m%s\x1b[0m', '=/=/=/=/=/=/=/=/=/=/=/=/=/=')
// console.log('\x1b[35m%s\x1b[0m', 'APPROVE:')
// console.log(JSON.stringify(fungibleTokenTest.approve(approveInputJson)))
// console.log('\x1b[34m%s\x1b[0m', '=/=/=/=/=/=/=/=/=/=/=/=/=/=')
console.log('\x1b[35m%s\x1b[0m', 'BURN:')
console.log(JSON.stringify(fungibleTokenTest.burn(burnInputJson)))
console.log('\x1b[34m%s\x1b[0m', '=/=/=/=/=/=/=/=/=/=/=/=/=/=')
console.log('\x1b[35m%s\x1b[0m', 'CREATE:')
console.log(JSON.stringify(fungibleTokenTest.create(createInputJson)))
console.log('\x1b[34m%s\x1b[0m', '=/=/=/=/=/=/=/=/=/=/=/=/=/=')
console.log('\x1b[35m%s\x1b[0m', 'CREATE AND DISTRIBUTE:')
console.log(
  JSON.stringify(
    fungibleTokenTest.createAndDistribute(createAndDistributeInputJson)
  )
)
console.log('\x1b[34m%s\x1b[0m', '=/=/=/=/=/=/=/=/=/=/=/=/=/=')
console.log('\x1b[35m%s\x1b[0m', 'MINT:')
console.log(JSON.stringify(fungibleTokenTest.mint(mintInputJson)))
console.log('\x1b[34m%s\x1b[0m', '=/=/=/=/=/=/=/=/=/=/=/=/=/=')
console.log('\x1b[35m%s\x1b[0m', 'UPDATE:')
console.log(JSON.stringify(fungibleTokenTest.update(updateInputJson)))
console.log('\x1b[34m%s\x1b[0m', '=/=/=/=/=/=/=/=/=/=/=/=/=/=')

console.log('TEST COMPLETE')
