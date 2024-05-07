import { Instruction } from '../../lib/programs/Instruction';
import { IComputeInputs } from '../../lib/interfaces';
export declare class Outputs {
    private inputs;
    private instructions;
    constructor(inputs: IComputeInputs | null, instructions: Instruction[]);
    toJson(): object;
}
