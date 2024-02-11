import { FungibleTokenContract } from '../lib/classes/contracts/FungibleTokenContract.js';
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
        const fungibleTokenTest = new FungibleTokenContract();
        const output = fungibleTokenTest.createAndDistribute(parsedData);
        console.log(JSON.stringify(output));
    }
    catch (err) {
        console.error('Failed to parse JSON input:', err);
    }
});
