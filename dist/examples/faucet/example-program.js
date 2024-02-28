import { FaucetProgram } from '../../lib/classes/programs/FaucetProgram.js';
const start = (input) => {
    const contract = new FaucetProgram();
    return contract.start(input);
};
export default start;
