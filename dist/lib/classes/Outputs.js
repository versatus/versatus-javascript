export class Outputs {
    constructor(inputs, instructions) {
        this.inputs = inputs;
        this.instructions = instructions;
    }
    toJson() {
        return {
            inputs: this.inputs,
            instructions: this.instructions.map((instruction) => instruction.toJson()),
        };
    }
}
