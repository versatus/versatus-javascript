import { Instruction } from '../../lib/programs/Instruction';
import { ComputeInputs } from '../../lib/types';
export declare class Outputs {
    private inputs;
    private instructions;
    constructor(inputs: ComputeInputs | null, instructions: Instruction[]);
    toJson(): object;
}
