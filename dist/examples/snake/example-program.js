import { SnakeProgram } from '../../lib/classes/programs/SnakeProgram.js';
const start = (input) => {
    const contract = new SnakeProgram();
    return contract.start(input);
};
export default start;
