import { FungibleTokenProgram } from './lib/classes/programs/FungibleTokenProgram.js';
const start = (input) => {
    const contract = new FungibleTokenProgram();
    return contract.start(input);
};
export default start;
