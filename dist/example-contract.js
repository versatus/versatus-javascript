import { FungibleTokenContract } from './lib/classes/contracts/FungibleTokenContract.js.js.js';
const start = (input) => {
    const contract = new FungibleTokenContract();
    return contract.start(input);
};
export default start;
