import { Instruction } from './Instruction';
import { Inputs } from '../types';
export declare class Outputs {
    private inputs;
    private instructions;
    constructor(inputs: Inputs | null, instructions: Instruction[]);
    toJson(): object;
}
