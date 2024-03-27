import { AddressOrNamespace, Outputs, Program, ProgramUpdate, TokenOrProgramUpdate, } from '@/lib/classes';
import { buildProgramUpdateField, buildUpdateInstruction } from '@/lib/builders';
import { THIS } from '@/lib/consts';
class HelloLasrProgram extends Program {
    constructor() {
        super();
        Object.assign(this.methodStrategies, {
            hello: this.hello.bind(this),
        });
    }
    hello(computeInputs) {
        const { transaction } = computeInputs;
        const { transactionInputs: txInputStr } = transaction;
        const txInputs = JSON.parse(txInputStr);
        const name = txInputs?.name ?? 'World';
        const currentTime = new Date().getTime();
        const helloWorldUpdate = buildProgramUpdateField({
            field: 'data',
            value: JSON.stringify({
                hello: `Hello, ${name}! The time is ${currentTime}!`,
            }),
            action: 'extend',
        });
        if (helloWorldUpdate instanceof Error) {
            throw helloWorldUpdate;
        }
        const programUpdates = [helloWorldUpdate];
        const helloWorldUpdateInstruction = buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)),
        });
        return new Outputs(computeInputs, [helloWorldUpdateInstruction]).toJson();
    }
}
const start = (input) => {
    const contract = new HelloLasrProgram();
    return contract.start(input);
};
process.stdin.setEncoding('utf8');
let data = '';
process.stdin.on('readable', () => {
    let chunk;
    while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
    }
});
process.stdin.on('end', () => {
    try {
        const parsedData = JSON.parse(data);
        const result = start(parsedData);
        process.stdout.write(JSON.stringify(result));
    }
    catch (err) {
        console.error('Failed to parse JSON input:', err);
    }
});
