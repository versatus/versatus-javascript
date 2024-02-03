import { Instruction } from './Instruction';
import { ComputeInputs } from '../types';
export declare class Outputs {
    private inputs;
    private instructions;
    constructor(inputs: ComputeInputs | null, instructions: Instruction[]);
    toJson(): object;
}
