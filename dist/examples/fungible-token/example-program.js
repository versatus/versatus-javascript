import { FungibleTokenProgram } from '../../lib/classes/programs/FungibleTokenProgram.js';
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
        const program = new FungibleTokenProgram();
        const result = program.start(parsedData);
        process.stdout.write(JSON.stringify(result));
    }
    catch (err) {
        console.error('Failed to parse JSON input:', err);
    }
});
