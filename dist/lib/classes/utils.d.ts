import { TokenUpdate } from '../../lib/classes/Token';
import { ProgramUpdate } from '../../lib/programs/Program';
export declare class StatusValue {
    private value;
    constructor(value: string);
    toJson(): object;
}
export declare class TokenOrProgramUpdate {
    private kind;
    private value;
    constructor(kind: string, value: TokenUpdate | ProgramUpdate);
    toJson(): object;
}
