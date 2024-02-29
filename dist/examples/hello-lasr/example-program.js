import { Program } from '../../lib/classes.js';
class HelloLasrProgram extends Program {
    constructor() {
        super();
        Object.assign(this.methodStrategies, {});
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
